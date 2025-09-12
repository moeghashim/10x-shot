import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "10xBuilder.ai - AI Productivity Experiment",
  description:
    "Tracking the impact of AI on productivity across 10 projects. See how artificial intelligence transforms development speed, learning curves, and project outcomes.",
  keywords: ["AI", "productivity", "development", "automation", "machine learning", "projects"],
  authors: [{ name: "Moe Ghashim", url: "https://x.com/moeghashim" }],
  openGraph: {
    title: "10xBuilder.ai - AI Productivity Experiment",
    description: "Tracking the impact of AI on productivity across 10 projects",
    url: "https://10xbuilder.ai",
    siteName: "10xBuilder.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "10xBuilder.ai - AI Productivity Experiment",
    description: "Tracking the impact of AI on productivity across 10 projects",
    creator: "@moeghashim",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
