import { ApiError } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

export async function resolveProductPrice(productId: string, billingCycle: "monthly" | "quarterly" | "annual") {
  const product = await prisma.subscriptionProduct.findFirst({
    where: {
      id: productId,
      deletedAt: null,
      status: "ACTIVE",
    },
  });

  if (!product) {
    throw new ApiError(404, "PRODUCT_NOT_FOUND", "The selected product could not be found");
  }

  const priceMap = {
    monthly: product.monthlyPriceKobo,
    quarterly: product.quarterlyPriceKobo,
    annual: product.annualPriceKobo,
  } as const;

  const price = priceMap[billingCycle];

  if (!price) {
    throw new ApiError(400, "BILLING_CYCLE_UNAVAILABLE", "This billing cycle is unavailable for the selected product");
  }

  return { product, amountKobo: price };
}

export async function applyCoupon(amountKobo: number, productId: string, couponCode?: string) {
  if (!couponCode) {
    return {
      finalAmountKobo: amountKobo,
      discountKobo: 0,
      coupon: null,
    };
  }

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: couponCode,
      deletedAt: null,
      status: "ACTIVE",
      OR: [{ productId: null }, { productId }],
    },
  });

  if (!coupon) {
    throw new ApiError(404, "COUPON_NOT_FOUND", "Coupon could not be found or is inactive");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new ApiError(400, "COUPON_EXPIRED", "Coupon has expired");
  }

  if (coupon.maxRedemptions && coupon.redeemedCount >= coupon.maxRedemptions) {
    throw new ApiError(400, "COUPON_LIMIT_REACHED", "Coupon redemption limit reached");
  }

  const percentDiscount = coupon.discountPercent ? Math.floor((amountKobo * coupon.discountPercent) / 100) : 0;
  const flatDiscount = coupon.discountKobo ?? 0;
  const discountKobo = Math.min(amountKobo, percentDiscount || flatDiscount);

  return {
    finalAmountKobo: Math.max(0, amountKobo - discountKobo),
    discountKobo,
    coupon,
  };
}
