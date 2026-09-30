import Image from "next/image";
import { Link } from "@/i18n/routing";
import { magicFollowContent, type MagicFollowPerson } from "@/lib/magic-follow/content";
import type { SupportedLocale } from "@/types/database";
import "@/styles/claws-home.css";
import "@/styles/magic-follow.css";

export function MagicFollowPage({ locale, people }: { locale: SupportedLocale; people: MagicFollowPerson[] }) {
  const ar = locale === "ar";
  const content = magicFollowContent[locale];
  const nav = <>
    <Link href="/magic-follow" aria-current="page"><bdi>Magic follow</bdi></Link>
    <Link href="/#projects">{ar ? "المشاريع" : "Projects"}</Link>
    <Link href="/#stack">{ar ? "الأدوات" : "Stack"}</Link>
    <Link href="/future">{ar ? "المستقبل" : "Future"}</Link>
    <Link href="/track">{ar ? "المتابعة" : "Track"}</Link>
  </>;
  return <div className="claws-home magic-follow" data-theme="light">
    <a className="claws-skip" href="#main">{ar ? "انتقل إلى المحتوى" : "Skip to content"}</a>
    <header className="claws-header">
      <Link href="/" className="claws-brand"><Image src="/10claws.svg" width={28} height={28} alt="" priority /><span dir="ltr">10 Claws</span></Link>
      <nav aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}>{nav}</nav>
      <Link href="/magic-follow" locale={ar ? "en" : "ar"} className="claws-language" aria-label={ar ? "Switch to English" : "التبديل إلى العربية"}>{ar ? "EN" : "AR"}</Link>
    </header>
    <main id="main">
      <section className="magic-follow-intro">
        <p className="claws-label">{content.kicker}</p>
        <h1><bdi>Magic follow</bdi></h1>
        <p className="magic-follow-description">{content.intro}</p>
      </section>
      <section aria-label={content.kicker} className="magic-follow-directory">
        <table>
          <caption className="sr-only">{content.kicker}</caption>
          <thead><tr><th scope="col">{content.name}</th><th scope="col">{content.handle}</th><th scope="col">{content.why}</th></tr></thead>
          <tbody>
            {people.map((person) => <tr key={person.handle} className="magic-follow-person">
              <th scope="row"><bdi>{person.name}</bdi></th>
              <td><a href={`https://x.com/${encodeURIComponent(person.handle.replace(/^@/, ""))}`} target="_blank" rel="noopener noreferrer" aria-label={`${content.profile}: ${person.name}`}><bdi>@{person.handle.replace(/^@/, "")}</bdi><span aria-hidden="true"> ↗</span></a></td>
              <td><span className="magic-follow-mobile-label claws-label">{content.why}</span><p>{person.why[locale]}</p></td>
            </tr>)}
            {!people.length && <tr><td colSpan={3} className="magic-follow-empty"><h2>{content.emptyTitle}</h2><p>{content.emptyBody}</p></td></tr>}
          </tbody>
        </table>
      </section>
    </main>
    <footer className="claws-footer">
      <Link href="/" className="claws-brand"><Image src="/10claws.svg" width={18} height={18} alt="" /><span dir="ltr">10 Claws</span></Link>
      <nav aria-label={ar ? "روابط التذييل" : "Footer navigation"}>{nav}</nav>
    </footer>
  </div>;
}
