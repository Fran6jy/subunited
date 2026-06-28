import { createAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export async function GET(request: Request) {
  const handler = toNextJsHandler(createAuth());
  return handler.GET(request);
}

export async function POST(request: Request) {
  const handler = toNextJsHandler(createAuth());
  return handler.POST(request);
}
