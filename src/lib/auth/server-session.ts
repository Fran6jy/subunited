import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export async function getServerSession() {
  return getAuth().api.getSession({
    headers: await headers(),
  });
}
