import { activatePurchase } from "@/lib/services/purchases";
import { publishUserEvent } from "@/lib/realtime/pubsub";

export async function handleActivatePurchaseJob(payload: { purchaseId: string }) {
  const result = await activatePurchase(payload.purchaseId);

  await publishUserEvent(result.purchase.userId, {
    type: "purchase.activated",
    payload: {
      purchaseId: result.purchase.id,
      status: result.purchase.status,
      expiresAt: result.purchase.expiresAt?.toISOString() ?? null,
    },
  });

  return result;
}
