import { withApiHandler, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { purchaseParamsSchema } from "@/lib/validation/purchase";
import { getRequestUser } from "@/lib/auth/session";

export async function GET(
  _: Request,
  context: { params: Promise<{ purchaseId: string }> },
) {
  return withApiHandler(async () => {
    const params = purchaseParamsSchema.parse(await context.params);
    const user = await getRequestUser();

    const purchase = await prisma.purchase.findUnique({
      where: { id: params.purchaseId },
      include: {
        product: true,
        payments: true,
        credential: true,
      },
    });

    if (!purchase || purchase.userId !== user.id) {
      throw new ApiError(404, "PURCHASE_NOT_FOUND", "Purchase not found");
    }

    return { purchase };
  });
}
