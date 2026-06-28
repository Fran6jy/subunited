import Link from "next/link";
import { LayoutDashboard, Settings, Shield, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/pricing", label: "Pricing", icon: Store },
  { href: "/categories", label: "Categories", icon: Store },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: Shield },
] as const;

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/85 backdrop-blur-xl">
      <div className="container-shell flex min-h-16 flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="min-w-0">
          <div className="text-base font-semibold tracking-tight">SubUnited</div>
          <div className="text-xs text-muted">Digital access marketplace</div>
        </Link>
        <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Create account</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
