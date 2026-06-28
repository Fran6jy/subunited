import { withApiHandler } from "@/lib/api";
import { verifyPaymentSchema } from "@/lib/validation/purchase";
import { reconcilePayment } from "@/lib/services/purchases";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const body = verifyPaymentSchema.parse(await request.json());
    return reconcilePayment(body);
  });
}
