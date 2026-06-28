import { withApiHandler } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { reconcilePayment } from "@/lib/services/purchases";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const body = (await request.json()) as {
      eventType: string;
      eventData?: { paymentReference?: string };
    };

    await prisma.webhookEvent.create({
      data: {
        provider: "MONNIFY",
        eventType: body.eventType,
        payload: body,
        processedAt: new Date(),
      },
    });

    if (body.eventData?.paymentReference) {
      return reconcilePayment({ provider: "MONNIFY", reference: body.eventData.paymentReference });
    }

    return { received: true };
  });
}
