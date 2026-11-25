import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Nav } from "@/components/Nav";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Tina · AI Researcher and Forward Deployed Engineer",
  description:
    "Portfolio and career intelligence platform: experience, projects and a live AI job-match demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8f6f1] text-slate-800">
        <PlaceholderBanner />
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">{children}</main>
        <footer className="mx-auto w-full max-w-5xl px-6 pb-10">
          <p className="border-t border-[#e6e1d6] pt-8 text-xs text-slate-500">
            Built with Next.js and TypeScript · Deployed on Vercel via GitHub Actions CI
          </p>
        </footer>
      </body>
    </html>
  );
}
