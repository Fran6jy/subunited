import { withApiHandler, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { reconcilePayment } from "@/lib/services/purchases";
import { verifyPaystackSignature } from "@/lib/payments/providers/paystack";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  return withApiHandler(async () => {
    if (!verifyPaystackSignature(rawBody, signature)) {
      throw new ApiError(401, "INVALID_SIGNATURE", "Invalid Paystack webhook signature");
    }

    const body = JSON.parse(rawBody) as {
      event: string;
      data: { reference: string };
    };

    await prisma.webhookEvent.create({
      data: {
        provider: "PAYSTACK",
        eventType: body.event,
        signature,
        payload: body,
        processedAt: new Date(),
      },
    });

    if (body.event === "charge.success") {
      return reconcilePayment({ provider: "PAYSTACK", reference: body.data.reference });
    }

    return { received: true };
  });
}
