"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import type { SupportedLocale } from "@/types/database";
import "@/styles/claws-home.css";

export function PublicNavigation({ locale, isHomepage = false }: { locale: SupportedLocale; isHomepage?: boolean }) {
  const ar = locale === "ar";
  return <>
    <Link href={isHomepage ? "#projects" : "/#projects"}>{ar ? "المشاريع" : "Projects"}</Link>
    <Link href="/stack">{ar ? "الأدوات" : "Stack"}</Link>
    <Link href="/future">{ar ? "المستقبل" : "Future"}</Link>
    <Link href="/track">{ar ? "المتابعة" : "Track"}</Link>
  </>;
}

export function StitchPublicHeader({ locale, isHomepage = false }: { locale: SupportedLocale; isHomepage?: boolean }) {
  const ar = locale === "ar";
  const pathname = usePathname();
  return <header className="claws-header">
    <Link href="/" className="claws-brand"><Image src="/10claws.svg" width={28} height={28} alt="" priority /><span dir="ltr">10 Claws</span></Link>
    <nav aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}><PublicNavigation locale={locale} isHomepage={isHomepage} /></nav>
    <Link href={pathname || "/"} locale={ar ? "en" : "ar"} className="claws-language" aria-label={ar ? "Switch to English" : "التبديل إلى العربية"}>{ar ? "EN" : "AR"}</Link>
  </header>;
}
