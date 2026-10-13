# Stack SVG assets

All tiles use local SVG assets in `public/stack-logos/`; there are no third-party image requests at runtime. Brand marks remain the property of their owners.

| Assets | Source | Notes |
| --- | --- | --- |
| Codex, OpenAI (ChatGPT), Grok, Firecrawl, Gemini, Kling, Nano Banana, LangChain, ByteDance | [Lobe Icons](https://github.com/lobehub/lobe-icons), `@lobehub/icons-static-svg` 1.95.1 | MIT license included. ByteDance is the parent-brand mark for Seedance. Monochrome SVGs use explicit white instead of `currentColor` for rendering as images. |
| Stripe, Convex, Vercel, X | [Simple Icons](https://github.com/simple-icons/simple-icons/tree/develop/icons) | CC0 license included. Explicit white fill for dark surfaces. |
| Paperclip | [Official repository favicon](https://github.com/paperclipai/paperclip/blob/master/docs/favicon.svg) | MIT license included. |
| Droid | [Factory documentation favicon](https://docs.factory.com/favicon.svg) | Official Factory mark; brand rights retained by Factory. |
| PI | Created for this page | Simple pi symbol for the coding agent; avoids confusing it with the unrelated Pi chatbot brand. |
| Trigger.dev | Created for this page | Lightning symbol used after no usable SVG was found in the queried icon sources. This is a custom identifying icon, not an official logo. |
| Page generator, Recipe generator, Marketing, Autonomy, automation | Created for this page | Distinct SVG symbols for project-specific skills that have no external brand assets. |
| `skill.svg` | Created for this page | Generic SVG for future, unmapped catalog names. |

Name lookup is case-insensitive in `lib/stack-logos.ts`. New tool names can be added there without changing the tier component. Grades and project usage remain derived from the backend, not from the logo map.
