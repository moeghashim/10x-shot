import Image from "next/image";
import { StitchPublicHeader, PublicNavigation } from "@/components/stitch-public-header";
import { Link } from "@/i18n/routing";
import { magicFollowContent, type MagicFollowPerson } from "@/lib/magic-follow/content";
import type { SupportedLocale } from "@/types/database";
import "@/styles/claws-home.css";
import "@/styles/magic-follow.css";

export function MagicFollowPage({ locale, people }: { locale: SupportedLocale; people: MagicFollowPerson[] }) {
  const ar = locale === "ar";
  const content = magicFollowContent[locale];
  const nav = <PublicNavigation locale={locale} />;
  return <div className="claws-home magic-follow" data-theme="light">
    <a className="claws-skip" href="#main">{ar ? "انتقل إلى المحتوى" : "Skip to content"}</a>
    <StitchPublicHeader locale={locale} />
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
      <nav aria-label={ar ? "روابط التذييل" : "Footer navigation"}><Link href="/magic-follow" aria-current="page"><bdi>Magic follow</bdi></Link>{nav}</nav>
    </footer>
  </div>;
}
