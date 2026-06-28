import type { PaymentInitializationInput, PaymentVerificationResult } from "@/lib/payments/types";
import { getEnv } from "@/lib/env/server";

const MONNIFY_BASE_URL = "https://api.monnify.com/api/v1";

async function getMonnifyToken() {
  const env = getEnv();
  const credentials = Buffer.from(`${env.MONNIFY_API_KEY}:${env.MONNIFY_SECRET_KEY}`).toString("base64");

  const response = await fetch(`${MONNIFY_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Monnify auth failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    responseBody: { accessToken: string };
  };

  return payload.responseBody.accessToken;
}

export async function initializeMonnifyTransaction(input: PaymentInitializationInput) {
  const token = await getMonnifyToken();

  const response = await fetch(`${MONNIFY_BASE_URL}/merchant/transactions/init-transaction`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountKobo / 100,
      customerName: input.email.split("@")[0],
      customerEmail: input.email,
      paymentReference: input.reference,
      paymentDescription: "SubUnited purchase",
      currencyCode: "NGN",
      contractCode: "SUBUNITED",
      redirectUrl: input.callbackUrl,
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER", "USSD"],
    }),
  });

  if (!response.ok) {
    throw new Error(`Monnify initialize failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    responseBody: { checkoutUrl: string; transactionReference: string };
  };

  return {
    authorizationUrl: payload.responseBody.checkoutUrl,
    accessCode: payload.responseBody.transactionReference,
    reference: input.reference,
    provider: "MONNIFY" as const,
  };
}

export async function verifyMonnifyTransaction(reference: string): Promise<PaymentVerificationResult> {
  const token = await getMonnifyToken();

  const response = await fetch(`${MONNIFY_BASE_URL}/merchant/transactions/query?paymentReference=${reference}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Monnify verify failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    responseBody: { paymentReference: string; amountPaid: number; paymentStatus: "PAID" | "FAILED" | "PENDING" };
  };

  return {
    providerReference: payload.responseBody.paymentReference,
    amountKobo: Math.round(payload.responseBody.amountPaid * 100),
    status:
      payload.responseBody.paymentStatus === "PAID"
        ? "success"
        : payload.responseBody.paymentStatus === "FAILED"
          ? "failed"
          : "processing",
    raw: payload,
  };
}
