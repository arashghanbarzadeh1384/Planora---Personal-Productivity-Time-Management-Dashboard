import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers";

export const metadata: Metadata = {
  title: { default: "Planora — Your life, in flow", template: "%s — Planora" },
  description: "A personal operating system for thoughtful work and a calmer life.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
