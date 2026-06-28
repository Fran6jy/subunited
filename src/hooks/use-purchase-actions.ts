"use client";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/fetcher";

export function usePurchaseInitialization() {
  return useMutation({
    mutationFn: (body: {
      productId: string;
      billingCycle: "monthly" | "quarterly" | "annual";
      provider: "PAYSTACK" | "MONNIFY" | "WALLET";
      email: string;
      couponCode?: string;
      userId?: string;
    }) =>
      apiFetch<{
        authorizationUrl: string | null;
        purchaseId: string;
        paymentReference: string;
      }>("/api/payments/initialize", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

export function useGenerateOtp() {
  return useMutation({
    mutationFn: (body: { purchaseId: string }) =>
      apiFetch<{ code: string; expiresInSeconds: number }>("/api/otp", {
        method: "POST",
        body: JSON.stringify({ ...body, userId: "ignored-on-server" }),
        headers: {
          "x-subunited-user-id": body.purchaseId,
        },
      }),
  });
}
