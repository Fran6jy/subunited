import { withApiHandler } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { getRequestUser } from "@/lib/auth/session";

export async function GET() {
  return withApiHandler(async () => {
    const user = await getRequestUser();
    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id, deletedAt: null },
      include: {
        product: true,
        payments: true,
        credential: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { purchases };
  });
}
