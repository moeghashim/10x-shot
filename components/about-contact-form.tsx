import { aboutContent } from "@/lib/about/content"
import type { SupportedLocale } from "@/types/database"

export function AboutContactForm({ locale }: { locale: SupportedLocale }) {
  const content = aboutContent[locale]
  const fieldClass = "mt-2 w-full border border-white/40 bg-white px-4 py-3 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"

  return (
    <form
      action="https://formsubmit.co/founder@10claws.com"
      method="POST"
      acceptCharset="UTF-8"
      className="mt-8 max-w-3xl space-y-6"
      aria-label={content.contact}
      aria-describedby="contact-delivery contact-captcha"
    >
      <input type="hidden" name="_subject" value="10 Claws — About Us enquiry" />
      <input type="hidden" name="_captcha" value="true" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="language" value={locale} />
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium">{content.form.name}</label>
          <input id="contact-name" name="name" autoComplete="name" required maxLength={120} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium">{content.form.email}</label>
          <input id="contact-email" name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254} className={fieldClass} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-company" className="text-sm font-medium">{content.form.company}</label>
        <input id="contact-company" name="company" autoComplete="organization" maxLength={160} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium">{content.form.message}</label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={5} className={fieldClass} />
      </div>
      <div className="space-y-2 text-sm leading-6 text-white/70">
        <p id="contact-captcha">{content.form.captcha}</p>
        <p id="contact-delivery">{content.form.delivery}</p>
      </div>
      <button type="submit" className="border border-white bg-white px-6 py-3 font-medium text-black hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        {content.contact}
      </button>
    </form>
  )
}
