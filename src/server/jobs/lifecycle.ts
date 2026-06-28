import { prisma } from "@/lib/db/prisma";
import { publishUserEvent } from "@/lib/realtime/pubsub";

export async function expireDuePurchases() {
  const duePurchases = await prisma.purchase.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: {
        lte: new Date(),
      },
      deletedAt: null,
    },
  });

  for (const purchase of duePurchases) {
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        status: "EXPIRED",
      },
    });

    await publishUserEvent(purchase.userId, {
      type: "purchase.expired",
      payload: {
        purchaseId: purchase.id,
      },
    });
  }

  return { expiredCount: duePurchases.length };
}

export async function enqueueRenewalReminders() {
  const threshold = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const dueSoon = await prisma.purchase.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: {
        lte: threshold,
        gt: new Date(),
      },
      deletedAt: null,
    },
  });

  for (const purchase of dueSoon) {
    await prisma.notification.create({
      data: {
        userId: purchase.userId,
        title: "Renewal reminder",
        message: "One of your subscriptions is expiring soon. Renew now to avoid interruption.",
        channel: "IN_APP",
        metadata: {
          purchaseId: purchase.id,
        },
      },
    });

    await publishUserEvent(purchase.userId, {
      type: "renewal.reminder",
      payload: {
        purchaseId: purchase.id,
      },
    });
  }

  return { reminderCount: dueSoon.length };
}
