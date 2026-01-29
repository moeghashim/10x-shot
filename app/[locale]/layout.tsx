import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans, Noto_Kufi_Arabic, IBM_Plex_Mono } from "next/font/google"
import "../globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import AuthSessionProvider from "@/components/session-provider"
import { SupabaseAuthSync } from "@/components/supabase-auth-sync"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] })
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"] })
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://10xbuilder.ai"),
  title: "10XBuilder.ai - Measuring AI Productivity Impact",
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

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? notoKufiArabic.className : plexSans.className;

  return (
    <html lang={locale} dir={dir} className="scroll-smooth">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5E5WHH8QY0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5E5WHH8QY0');
            `,
          }}
        />
      </head>
      <body className={fontClass}>
        <NextIntlClientProvider messages={messages}>
          <AuthSessionProvider>
            <SupabaseAuthSync>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                {children}
                <Analytics />
              </Suspense>
            </SupabaseAuthSync>
          </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
