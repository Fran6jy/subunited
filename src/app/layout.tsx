import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "SubUnited",
  description:
    "Enterprise-grade subscription management and digital access marketplace for Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AppNav />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
