import { ApiError } from "@/lib/api";
import { getRequestUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/services/dashboard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const user = await getRequestUser();
    const data = await getDashboardData(user.id);

    return (
      <DashboardShell
        data={data}
        customerName={user.name ?? user.email.split("@")[0]}
      />
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return (
        <main className="container-shell flex min-h-screen items-center justify-center py-12">
          <div className="glass-card max-w-xl rounded-[28px] p-8">
            <div className="text-sm uppercase tracking-[0.2em] text-muted">
              Dashboard
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Authentication required
            </h1>
            <p className="mt-4 text-muted">
              Provide the `x-subunited-user-id` header in development or connect
              the full Better Auth session flow in the next phase.
            </p>
          </div>
        </main>
      );
    }

    throw error;
  }
}
