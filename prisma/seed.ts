import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const catalog = [
  {
    category: {
      name: "AI",
      slug: "ai",
      description: "AI productivity and research tools",
    },
    products: [
      ["ChatGPT Plus", "chatgpt-plus", 300000],
      ["Claude Pro", "claude-pro", 280000],
      ["Gemini Advanced", "gemini-advanced", 250000],
      ["Cursor Pro", "cursor-pro", 200000],
      ["Perplexity Pro", "perplexity-pro", 180000],
      ["Lovable", "lovable", 220000],
      ["Bolt", "bolt", 210000],
    ],
  },
  {
    category: {
      name: "Streaming",
      slug: "streaming",
      description: "Premium entertainment subscriptions",
    },
    products: [
      ["Netflix", "netflix", 700000],
      ["Spotify", "spotify", 350000],
      ["Disney+", "disney-plus", 400000],
      ["Apple Music", "apple-music", 320000],
    ],
  },
  {
    category: {
      name: "Education",
      slug: "education",
      description: "Learning and professional growth",
    },
    products: [
      ["Udemy", "udemy", 250000],
      ["Coursera", "coursera", 260000],
      ["Skillshare", "skillshare", 210000],
    ],
  },
  {
    category: {
      name: "Cloud",
      slug: "cloud",
      description: "Cloud infrastructure and hosting",
    },
    products: [
      ["DigitalOcean", "digitalocean", 500000],
      ["Hetzner", "hetzner", 480000],
      ["Vultr", "vultr", 460000],
    ],
  },
  {
    category: {
      name: "VPN",
      slug: "vpn",
      description: "Privacy and access tools",
    },
    products: [
      ["NordVPN", "nordvpn", 290000],
      ["Surfshark", "surfshark", 240000],
      ["Windscribe", "windscribe", 170000],
    ],
  },
] as const;

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@subunited.app" },
    update: {},
    create: {
      email: "admin@subunited.app",
      emailVerified: true,
      name: "SubUnited Admin",
      role: "ADMIN",
      referralCode: "SUBADMIN",
    },
  });

  await prisma.wallet
    .upsert({
      where: { id: admin.id },
      update: {},
      create: {
        id: admin.id,
        userId: admin.id,
        balanceKobo: 5000000,
        ledger: { seeded: true },
      },
    })
    .catch(async () => {
      const existing = await prisma.wallet.findFirst({
        where: { userId: admin.id },
      });
      if (!existing) {
        await prisma.wallet.create({
          data: {
            userId: admin.id,
            balanceKobo: 5000000,
            ledger: { seeded: true },
          },
        });
      }
    });

  for (const entry of catalog) {
    const category = await prisma.category.upsert({
      where: { slug: entry.category.slug },
      update: entry.category,
      create: entry.category,
    });

    for (const [name, slug, monthlyPriceKobo] of entry.products) {
      const product = await prisma.subscriptionProduct.upsert({
        where: { slug },
        update: {
          name,
          description: `${name} access managed through SubUnited with secure fulfillment and renewal workflows.`,
          categoryId: category.id,
          monthlyPriceKobo,
          quarterlyPriceKobo: Math.round(monthlyPriceKobo * 2.85),
          annualPriceKobo: Math.round(monthlyPriceKobo * 10.8),
          visibility: "PUBLIC",
          status: "ACTIVE",
          tags: [category.slug, "digital-access", "instant-delivery"],
          requiresCredentials: true,
          requiresOtp: ["Netflix", "Disney+", "ChatGPT Plus"].includes(name),
          requiresEmailOtp: [
            "Netflix",
            "Google",
            "Microsoft",
            "Spotify",
          ].includes(name),
          popularityScore: 80,
          gallery: [],
        },
        create: {
          name,
          slug,
          description: `${name} access managed through SubUnited with secure fulfillment and renewal workflows.`,
          categoryId: category.id,
          monthlyPriceKobo,
          quarterlyPriceKobo: Math.round(monthlyPriceKobo * 2.85),
          annualPriceKobo: Math.round(monthlyPriceKobo * 10.8),
          visibility: "PUBLIC",
          status: "ACTIVE",
          tags: [category.slug, "digital-access", "instant-delivery"],
          requiresCredentials: true,
          requiresOtp: ["Netflix", "Disney+", "ChatGPT Plus"].includes(name),
          requiresEmailOtp: [
            "Netflix",
            "Google",
            "Microsoft",
            "Spotify",
          ].includes(name),
          popularityScore: 80,
          gallery: [],
          metadata: { market: "NG", seeded: true },
          seo: {
            title: `${name} on SubUnited`,
            description: `${name} secure access marketplace listing`,
          },
        },
      });

      const pool = await prisma.credentialPool
        .upsert({
          where: { id: `${product.id}-primary` },
          update: { name: `${name} Primary Pool`, provider: name },
          create: {
            id: `${product.id}-primary`,
            productId: product.id,
            name: `${name} Primary Pool`,
            provider: name,
          },
        })
        .catch(async () => {
          const existing = await prisma.credentialPool.findFirst({
            where: { productId: product.id, name: `${name} Primary Pool` },
          });
          if (existing) return existing;
          return prisma.credentialPool.create({
            data: {
              productId: product.id,
              name: `${name} Primary Pool`,
              provider: name,
            },
          });
        });

      const existingCredential = await prisma.credential.findFirst({
        where: { poolId: pool.id, email: `${slug}@demo.subunited.app` },
      });

      if (!existingCredential) {
        await prisma.credential.create({
          data: {
            poolId: pool.id,
            email: `${slug}@demo.subunited.app`,
            encryptedPassword: "seeded-encrypted-password",
            recoveryEmail: `recovery+${slug}@subunited.app`,
            provider: name,
            deviceLimit: 2,
            notes: "Seeded credential for local development",
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
