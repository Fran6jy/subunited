import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Wallet,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { getOptionalViewer } from "@/lib/auth/viewer";
import { SessionNav } from "@/components/auth/session-nav";

export const dynamic = "force-dynamic";

const stats = [
  { label: "Automated fulfillment", value: "99.9%" },
  { label: "Average delivery", value: "< 30s" },
  { label: "Payment rails", value: "Paystack + Monnify" },
  { label: "Built for", value: "Nigeria" },
];

const features = [
  {
    title: "Instant access orchestration",
    description:
      "Automatically assign credentials, unlock dashboards, and manage subscription lifecycles without manual fulfillment.",
    icon: Zap,
  },
  {
    title: "Enterprise-grade security",
    description:
      "AES-256-GCM encryption, strong session handling, audit logging, scoped roles, and resilient webhook processing.",
    icon: ShieldCheck,
  },
  {
    title: "Wallets, renewals, and billing",
    description:
      "Track wallets, renewal windows, invoices, and recurring product usage with a premium customer experience.",
    icon: Wallet,
  },
];

const products = [
  ["ChatGPT Plus", 300000],
  ["Netflix", 700000],
  ["Spotify", 350000],
  ["NordVPN", 290000],
] as const;

export default async function HomePage() {
  const viewer = await getOptionalViewer();

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid grid-bg opacity-20" />
        <div className="container-shell relative py-8">
          <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur xl:px-6">
            <div>
              <div className="text-lg font-semibold tracking-tight">
                SubUnited
              </div>
              <div className="text-xs text-muted">
                Subscription access orchestration
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
              <a href="#features">Features</a>
              <a href="#marketplace">Marketplace</a>
              <a href="#pricing">Pricing</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
              <SessionNav userName={viewer?.name ?? viewer?.email ?? null} />
            </div>
          </header>

          <div className="grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Built for automated digital access in Nigeria
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Premium subscription commerce with instant, secure delivery.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                SubUnited automates product discovery, payment verification,
                credential assignment, OTP workflows, renewals, and customer
                access from one elegant platform.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/marketplace">
                    Explore marketplace <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard">Preview dashboard</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-3xl p-4">
                    <div className="text-2xl font-semibold">{stat.value}</div>
                    <div className="mt-1 text-sm text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[28px] p-4 sm:p-6">
              <div className="rounded-[24px] border border-white/10 bg-[#0B0E14] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted">Customer dashboard</div>
                    <div className="text-2xl font-semibold">
                      Active subscriptions
                    </div>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
                    All systems healthy
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {products.map(([name, amount]) => (
                    <div
                      key={name}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-sm text-muted">
                            Credential ready • OTP enabled • Renewal available
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatNaira(amount)}
                          </div>
                          <div className="text-sm text-emerald-300">Active</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 p-4">
                    <div className="text-sm text-muted">Wallet</div>
                    <div className="mt-2 text-xl font-semibold">₦125,000</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 p-4">
                    <div className="text-sm text-muted">OTPs served</div>
                    <div className="mt-2 text-xl font-semibold">2,491</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 p-4">
                    <div className="text-sm text-muted">Success rate</div>
                    <div className="mt-2 text-xl font-semibold">99.97%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container-shell py-20">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 text-sm uppercase tracking-[0.2em] text-muted">
            Why SubUnited
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Automation, reliability, and a first-class buyer experience.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card rounded-[28px] p-6"
              >
                <div className="mb-5 inline-flex rounded-2xl border border-white/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-muted">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="marketplace" className="container-shell pb-20">
        <div className="glass-card rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-muted">
                Marketplace
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Curated digital access categories
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link href="/marketplace">Browse all listings</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "AI",
              "Streaming",
              "Education",
              "VPN",
              "Cloud",
              "Teams",
              "Productivity",
              "Creator Tools",
            ].map((category) => (
              <div
                key={category}
                className="rounded-3xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{category}</div>
                  <LayoutDashboard className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-3 text-sm leading-6 text-muted">
                  Discover verified subscription products, transparent pricing,
                  and automated delivery.
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
