import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";
import { getEnv } from "@/lib/env/server";

function createAuthInstance() {
  const env = getEnv();

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.APP_URL,
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    trustedOrigins: [env.APP_URL],
  });
}

let authInstance: ReturnType<typeof createAuthInstance> | undefined;

export function getAuth() {
  if (!authInstance) {
    authInstance = createAuthInstance();
  }

  return authInstance;
}
