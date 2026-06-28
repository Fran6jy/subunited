import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/server-session";

export async function getOptionalViewer() {
  const session = await getServerSession();

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (user && !user.deletedAt) return user;
  }

  const headerStore = await headers();
  const userId = headerStore.get("x-subunited-user-id");

  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt) return null;

  return user;
}
