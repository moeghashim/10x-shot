import { permanentRedirect } from "next/navigation";

export default async function FormerAboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(`/${locale === "ar" ? "ar" : "en"}/magic-follow`);
}
