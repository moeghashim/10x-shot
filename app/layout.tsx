import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400"] })

export const metadata: Metadata = {
  title: "10xBuilder.ai - Measuring AI Productivity Impact",
  description:
    "Tracking the real impact of AI on productivity across 10 diverse projects. Can artificial intelligence truly deliver 10x improvements?",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={plexSans.className}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
