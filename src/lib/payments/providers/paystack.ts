import crypto from "node:crypto";
import { getEnv } from "@/lib/env/server";
import type { PaymentInitializationInput, PaymentVerificationResult } from "@/lib/payments/types";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export async function initializePaystackTransaction(input: PaymentInitializationInput) {
  const env = getEnv();

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      currency: "NGN",
      channels: ["card", "bank", "ussd", "bank_transfer", "qr"],
      metadata: {
        source: "subunited",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Paystack initialize failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    data: { authorization_url: string; access_code: string; reference: string };
  };

  return {
    authorizationUrl: payload.data.authorization_url,
    accessCode: payload.data.access_code,
    reference: payload.data.reference,
    provider: "PAYSTACK" as const,
  };
}

export async function verifyPaystackTransaction(reference: string): Promise<PaymentVerificationResult> {
  const env = getEnv();

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Paystack verify failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    data: { reference: string; amount: number; status: "success" | "failed" | "pending" };
  };

  return {
    providerReference: payload.data.reference,
    amountKobo: payload.data.amount,
    status: payload.data.status === "pending" ? "processing" : payload.data.status,
    raw: payload,
  };
}

export function verifyPaystackSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const env = getEnv();
  const digest = crypto.createHmac("sha512", env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  return digest === signature;
}
