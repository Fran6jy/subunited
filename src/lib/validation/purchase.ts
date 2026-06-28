import { z } from "zod";

export const initializePaymentSchema = z.object({
  productId: z.string().uuid(),
  billingCycle: z.enum(["monthly", "quarterly", "annual"]),
  provider: z.enum(["PAYSTACK", "MONNIFY", "WALLET"]),
  couponCode: z.string().trim().min(3).max(32).optional(),
  email: z.string().email(),
  userId: z.string().uuid().optional(),
});

export const verifyPaymentSchema = z.object({
  provider: z.enum(["PAYSTACK", "MONNIFY"]),
  reference: z.string().min(4),
});

export const generateOtpSchema = z.object({
  purchaseId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const purchaseParamsSchema = z.object({
  purchaseId: z.string().uuid(),
});
