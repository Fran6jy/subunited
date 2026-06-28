"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function SessionNav({ userName }: { userName: string | null }) {
  const router = useRouter();

  if (!userName) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">Create account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-muted">{userName}</div>
      <Button
        size="sm"
        variant="secondary"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
          router.refresh();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
