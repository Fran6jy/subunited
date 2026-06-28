import { ApiError } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { decrypt } from "@/lib/security/encryption";

export async function revealPurchaseCredential(input: { purchaseId: string; userId: string }) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: input.purchaseId },
    include: {
      product: true,
      credential: true,
    },
  });

  if (!purchase) {
    throw new ApiError(404, "PURCHASE_NOT_FOUND", "Purchase not found");
  }

  if (purchase.userId !== input.userId) {
    throw new ApiError(403, "ACCESS_DENIED", "You do not own this purchase");
  }

  if (!purchase.credential) {
    throw new ApiError(404, "CREDENTIAL_NOT_ASSIGNED", "Credential has not been assigned yet");
  }

  return {
    productName: purchase.product.name,
    email: purchase.credential.email,
    password: decrypt(purchase.credential.encryptedPassword),
    recoveryEmail: purchase.credential.recoveryEmail,
    recoveryPhone: purchase.credential.recoveryPhone,
    notes: purchase.credential.notes,
    provider: purchase.credential.provider,
  };
}
