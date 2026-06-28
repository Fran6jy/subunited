import { initializePaymentSchema } from "@/lib/validation/purchase";
import { withApiHandler } from "@/lib/api";
import { createPurchaseIntent } from "@/lib/services/purchases";
import { getEnv } from "@/lib/env/server";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const body = initializePaymentSchema.parse(await request.json());
    const env = getEnv();

    return createPurchaseIntent({
      ...body,
      callbackUrl: `${env.APP_URL}/dashboard?payment=callback`,
    });
  });
}
