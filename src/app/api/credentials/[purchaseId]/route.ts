import { withApiHandler } from "@/lib/api";
import { purchaseParamsSchema } from "@/lib/validation/purchase";
import { getRequestUser } from "@/lib/auth/session";
import { revealPurchaseCredential } from "@/lib/services/access";

export async function GET(_: Request, context: { params: Promise<{ purchaseId: string }> }) {
  return withApiHandler(async () => {
    const params = purchaseParamsSchema.parse(await context.params);
    const user = await getRequestUser();

    return revealPurchaseCredential({
      purchaseId: params.purchaseId,
      userId: user.id,
    });
  });
}
