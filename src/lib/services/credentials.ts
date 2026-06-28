import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/api";

export async function assignCredentialToPurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { product: true },
  });

  if (!purchase) {
    throw new ApiError(404, "PURCHASE_NOT_FOUND", "Purchase not found");
  }

  if (!purchase.product.requiresCredentials) {
    return null;
  }

  if (purchase.credentialId) {
    return prisma.credential.findUnique({ where: { id: purchase.credentialId } });
  }

  const credential = await prisma.credential.findFirst({
    where: {
      deletedAt: null,
      status: "AVAILABLE",
      pool: {
        productId: purchase.productId,
      },
    },
    orderBy: [{ healthScore: "desc" }, { createdAt: "asc" }],
  });

  if (!credential) {
    throw new ApiError(409, "NO_CREDENTIAL_AVAILABLE", "No credential is currently available for this product");
  }

  const updatedCredential = await prisma.credential.update({
    where: { id: credential.id },
    data: {
      status: "ASSIGNED",
      assignedUserId: purchase.userId,
    },
  });

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      credentialId: updatedCredential.id,
      status: "ACTIVE",
      activatedAt: purchase.activatedAt ?? new Date(),
    },
  });

  return updatedCredential;
}
