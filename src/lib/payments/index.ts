import { ApiError } from "@/lib/api";
import { initializeMonnifyTransaction, verifyMonnifyTransaction } from "@/lib/payments/providers/monnify";
import { initializePaystackTransaction, verifyPaystackTransaction } from "@/lib/payments/providers/paystack";
import type { PaymentInitializationInput } from "@/lib/payments/types";

export async function initializePayment(provider: "PAYSTACK" | "MONNIFY", input: PaymentInitializationInput) {
  switch (provider) {
    case "PAYSTACK":
      return initializePaystackTransaction(input);
    case "MONNIFY":
      return initializeMonnifyTransaction(input);
    default:
      throw new ApiError(400, "UNSUPPORTED_PROVIDER", "Unsupported payment provider");
  }
}

export async function verifyPayment(provider: "PAYSTACK" | "MONNIFY", reference: string) {
  switch (provider) {
    case "PAYSTACK":
      return verifyPaystackTransaction(reference);
    case "MONNIFY":
      return verifyMonnifyTransaction(reference);
    default:
      throw new ApiError(400, "UNSUPPORTED_PROVIDER", "Unsupported payment provider");
  }
}
