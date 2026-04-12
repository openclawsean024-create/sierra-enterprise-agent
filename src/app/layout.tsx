import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sierra 企業客服 AI Agent",
  description: "瞄準中小企業的 AI 客服解决方案",
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-950 text-gray-100 antialiased`}>
        <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-white">Sierra</span>
                  <span className="text-xs text-gray-500 ml-1">AI Agent</span>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <NavLink href="/">首頁</NavLink>
                <NavLink href="/chat">對話</NavLink>
                <NavLink href="/dashboard">數據分析</NavLink>
                <NavLink href="/tickets">工單</NavLink>
                <NavLink href="/widget">嵌入 Widget</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full text-xs bg-green-900/40 border border-green-800 text-green-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse" />
                系統正常
              </span>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
