import { authenticator } from "otplib";
import { ApiError } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { decrypt } from "@/lib/security/encryption";

export async function generatePurchaseOtp(input: { purchaseId: string; userId: string }) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: input.purchaseId },
    include: {
      credential: true,
      product: true,
    },
  });

  if (!purchase) {
    throw new ApiError(404, "PURCHASE_NOT_FOUND", "Purchase not found");
  }

  if (purchase.userId !== input.userId) {
    throw new ApiError(403, "OTP_ACCESS_DENIED", "You do not have access to this subscription");
  }

  if (!purchase.product.requiresOtp) {
    throw new ApiError(400, "OTP_NOT_REQUIRED", "This product does not require OTP generation");
  }

  if (!purchase.credential?.encryptedOtpSecret) {
    throw new ApiError(404, "OTP_SECRET_UNAVAILABLE", "OTP is currently unavailable for this credential");
  }

  const secret = decrypt(purchase.credential.encryptedOtpSecret);
  const token = authenticator.generate(secret);

  return {
    code: token,
    expiresInSeconds: authenticator.options.step ?? 30,
    generatedAt: new Date().toISOString(),
  };
}
