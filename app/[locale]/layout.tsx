import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import { Analytics } from "@vercel/analytics/next"
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Script from "next/script"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Alexandria } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://10xbuilder.ai"),
  title: "10XBuilder.ai - Measuring AI Productivity Impact",
  description:
    "Tracking the real impact of AI on productivity across 10 diverse projects. Can artificial intelligence truly deliver 10x improvements?",
  generator: "v0.dev",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-simple.svg", type: "image/svg+xml" }],
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

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const messages = await getMessages();
  const fontClass = locale === 'ar' ? alexandria.className : GeistSans.className;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`scroll-smooth ${GeistSans.variable} ${GeistMono.variable} ${alexandria.variable}`}
    >
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5E5WHH8QY0" strategy="lazyOnload" />
        <Script id="ga4" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5E5WHH8QY0');
          `}
        </Script>
      </head>
      <body className={fontClass}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
