# Magic follow

Replaces the About Us page with a curated X directory: name, linked handle, and a reason to follow each person. English and Arabic content lives in `lib/magic-follow/content.ts`. The list is intentionally empty until the owner supplies accounts; the public page shows a localized empty state.

The former About content and FormSubmit enquiry form are removed. Homepage and shared public navigation now link to Magic follow. Both localized About URLs redirect permanently (308), and the sitemap lists the new routes.

Validation: lint, TypeScript, and production builds pass. Redirect status and destinations checked for both languages; sitemap checked for the replacement URLs. English desktop and Arabic mobile layouts checked for navigation, column labels, empty state, and horizontal overflow. Profile rows cannot be verified against real people until the list is supplied.

![Magic follow desktop](screenshots/magic-follow-desktop.png)

![Magic follow Arabic mobile](screenshots/magic-follow-mobile-ar.png)
