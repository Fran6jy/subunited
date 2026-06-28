import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
  const settings = await prisma.systemSetting
    .findMany({
      where: { deletedAt: null, key: { startsWith: "api." } },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
    .catch(() => []);

  return (
    <main className="container-shell min-h-screen py-10">
      <div className="mb-8">
        <div className="text-sm uppercase tracking-[0.2em] text-muted">Admin</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">API keys</h1>
        <p className="mt-3 text-muted">Operational key records are read from system settings with the `api.` prefix.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {settings.length === 0 ? (
          <div className="glass-card rounded-[28px] p-8 text-muted">No API key metadata has been configured yet.</div>
        ) : (
          settings.map((setting) => (
            <div key={setting.id} className="glass-card rounded-[24px] p-5">
              <div className="font-medium">{setting.key}</div>
              <div className="mt-2 text-sm text-muted">Last updated {new Date(setting.updatedAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
