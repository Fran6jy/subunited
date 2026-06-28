import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/api";

export async function getRequestUser() {
  const headerStore = await headers();
  const userId = headerStore.get("x-subunited-user-id");

  if (!userId) {
    throw new ApiError(401, "UNAUTHENTICATED", "Authentication is required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.deletedAt) {
    throw new ApiError(401, "INVALID_SESSION", "The current session is invalid");
  }

  return user;
}
