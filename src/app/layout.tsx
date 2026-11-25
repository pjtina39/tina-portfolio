import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tina · AI Researcher and Forward Deployed Engineer",
  description:
    "Portfolio and career intelligence platform: experience, projects and a live AI job-match demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <PlaceholderBanner />
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
          Built with Next.js and TypeScript · Deployed on Vercel via GitHub Actions CI
        </footer>
      </body>
    </html>
  );
}
