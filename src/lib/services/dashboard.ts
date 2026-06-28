import { prisma } from "@/lib/db/prisma";

export async function getDashboardData(userId: string) {
  const [wallet, purchases, notifications, referrals] = await Promise.all([
    prisma.wallet.findFirst({ where: { userId, deletedAt: null } }),
    prisma.purchase.findMany({
      where: { userId, deletedAt: null },
      include: {
        product: true,
        credential: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.notification.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.referral.findMany({
      where: { ownerUserId: userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const activePurchases = purchases.filter((purchase) => purchase.status === "ACTIVE");
  const otpEnabledPurchases = purchases.filter((purchase) => purchase.product.requiresOtp);
  const pendingRenewals = purchases.filter((purchase) => {
    if (!purchase.expiresAt) return false;
    const diff = purchase.expiresAt.getTime() - Date.now();
    return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  });

  return {
    walletBalanceKobo: wallet?.balanceKobo ?? 0,
    stats: {
      activeSubscriptions: activePurchases.length,
      pendingRenewals: pendingRenewals.length,
      otpEnabledProducts: otpEnabledPurchases.length,
      totalOrders: purchases.length,
    },
    purchases,
    notifications,
    referrals,
  };
}
