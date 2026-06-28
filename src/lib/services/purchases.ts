import { randomUUID } from "node:crypto";
import { ApiError } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { initializePayment, verifyPayment } from "@/lib/payments";
import { getQueues } from "@/server/queue";
import { applyCoupon, resolveProductPrice } from "@/lib/services/pricing";
import { assignCredentialToPurchase } from "@/lib/services/credentials";

export async function createPurchaseIntent(input: {
  productId: string;
  billingCycle: "monthly" | "quarterly" | "annual";
  provider: "PAYSTACK" | "MONNIFY" | "WALLET";
  email: string;
  userId?: string;
  couponCode?: string;
  callbackUrl: string;
}) {
  const { product, amountKobo } = await resolveProductPrice(
    input.productId,
    input.billingCycle,
  );
  const couponResult = await applyCoupon(
    amountKobo,
    input.productId,
    input.couponCode,
  );

  const user = input.userId
    ? await prisma.user.findUnique({ where: { id: input.userId } })
    : await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new ApiError(
      404,
      "USER_NOT_FOUND",
      "A valid user is required to create a purchase intent",
    );
  }

  const purchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      productId: product.id,
      status: input.provider === "WALLET" ? "PROCESSING" : "PENDING",
      pricePaidKobo: couponResult.finalAmountKobo,
    },
  });

  const reference = `sub_${randomUUID()}`;

  const payment = await prisma.payment.create({
    data: {
      purchaseId: purchase.id,
      provider: input.provider,
      providerReference: reference,
      amountKobo: couponResult.finalAmountKobo,
      status: input.provider === "WALLET" ? "PROCESSING" : "PENDING",
      metadata: {
        productId: product.id,
        billingCycle: input.billingCycle,
        couponCode: input.couponCode ?? null,
        discountKobo: couponResult.discountKobo,
      },
    },
  });

  if (input.provider === "WALLET") {
    await spendFromWallet(
      user.id,
      couponResult.finalAmountKobo,
      purchase.id,
      payment.id,
    );

    return {
      purchaseId: purchase.id,
      paymentReference: payment.providerReference,
      provider: input.provider,
      authorizationUrl: null,
      amountKobo: couponResult.finalAmountKobo,
      status: "success",
    };
  }

  const initialized = await initializePayment(input.provider, {
    amountKobo: couponResult.finalAmountKobo,
    email: input.email,
    reference,
    callbackUrl: input.callbackUrl,
  });

  return {
    purchaseId: purchase.id,
    paymentReference: initialized.reference,
    provider: initialized.provider,
    authorizationUrl: initialized.authorizationUrl,
    accessCode: initialized.accessCode,
    amountKobo: couponResult.finalAmountKobo,
    status: "pending",
  };
}

export async function reconcilePayment(input: {
  provider: "PAYSTACK" | "MONNIFY";
  reference: string;
}) {
  const payment = await prisma.payment.findUnique({
    where: { providerReference: input.reference },
    include: { purchase: true },
  });

  if (!payment || !payment.purchaseId || !payment.purchase) {
    throw new ApiError(404, "PAYMENT_NOT_FOUND", "Payment reference not found");
  }

  const verification = await verifyPayment(input.provider, input.reference);

  const paymentStatus =
    verification.status === "success"
      ? "SUCCESS"
      : verification.status === "failed"
        ? "FAILED"
        : "PROCESSING";

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      amountKobo: verification.amountKobo,
      status: paymentStatus,
      verifiedAt: verification.status === "success" ? new Date() : null,
      metadata: verification.raw as object,
    },
  });

  if (verification.status === "success") {
    await prisma.purchase.update({
      where: { id: payment.purchaseId },
      data: {
        status: "PAID",
      },
    });

    await getQueues().payments.add("activate-purchase", {
      purchaseId: payment.purchaseId,
    });
  }

  if (verification.status === "failed") {
    await prisma.purchase.update({
      where: { id: payment.purchaseId },
      data: {
        status: "FAILED",
      },
    });
  }

  return {
    paymentId: payment.id,
    purchaseId: payment.purchaseId,
    status: verification.status,
    amountKobo: verification.amountKobo,
  };
}

export async function activatePurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { product: true },
  });

  if (!purchase) {
    throw new ApiError(404, "PURCHASE_NOT_FOUND", "Purchase not found");
  }

  const durationDays =
    purchase.product.annualPriceKobo === purchase.pricePaidKobo ? 365 : 30;

  const updated = await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      status: purchase.product.requiresCredentials ? "PAID" : "ACTIVE",
      activatedAt: new Date(),
      expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
    },
  });

  const credential = await assignCredentialToPurchase(purchase.id);

  return {
    purchase: updated,
    credential,
  };
}

async function spendFromWallet(
  userId: string,
  amountKobo: number,
  purchaseId: string,
  paymentId: string,
) {
  const wallet = await prisma.wallet.findFirst({
    where: { userId, deletedAt: null },
  });

  if (!wallet || wallet.balanceKobo < amountKobo) {
    throw new ApiError(
      400,
      "INSUFFICIENT_WALLET_BALANCE",
      "Wallet balance is insufficient for this purchase",
    );
  }

  const updatedLedger = Array.isArray(wallet.ledger) ? wallet.ledger : [];

  await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      balanceKobo: { decrement: amountKobo },
      ledger: [
        ...updatedLedger,
        {
          type: "wallet_spend",
          amountKobo,
          purchaseId,
          paymentId,
          at: new Date().toISOString(),
        },
      ],
    },
  });

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "SUCCESS",
      verifiedAt: new Date(),
      metadata: {
        source: "wallet",
      },
    },
  });

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: "PAID",
    },
  });

  await getQueues().payments.add("activate-purchase", { purchaseId });
}
