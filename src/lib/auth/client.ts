"use client";

import { createAuthClient } from "better-auth/react";
import { clientEnv } from "@/lib/env/client";

export const authClient = createAuthClient({
  baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
});
