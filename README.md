# English Smart Learning Platform

Production-ready scaffold for a bilingual English learning platform based on the Level 4 final prompt.

The project keeps the required systems in scope:

- Public website, student dashboard, and admin dashboard
- Thai/English language mode with UTF-8 Thai text support
- Four-skill learning modules: listening, speaking, reading, writing
- Vocabulary, sentence builder, quizzes, level-up engine, and AI Coach
- Study time tracking and access control
- Payment automation with provider adapter design
- Manual transfer review and webhook verification
- Security logs, audit trails, login lockout, and suspicious activity
- Google Sheets MVP template and migration-ready database schema
- Long-term vocabulary import design from open data/API sources

## Open Locally

Open `index.html` in a browser. The frontend is static and does not require a build step.

## Thai Language Safety

All source files are UTF-8. The HTML uses:

```html
<meta charset="UTF-8" />
<html lang="th">
```

The UI uses `Noto Sans Thai` first, then `Inter` and system fallbacks. Thai and English text are managed through a dictionary in `app.js`.

## Suggested Production Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Next.js API Routes or Node.js/Express
- Database: Google Sheets for MVP, PostgreSQL for production
- Auth: email/password, password hash, session/JWT, RBAC
- Payment: provider adapter for Stripe PromptPay, Omise PromptPay, Manual Transfer
- Voice: Web Speech API, SpeechSynthesis, SpeechRecognition

## Google Sheets Database

Target spreadsheet:

https://docs.google.com/spreadsheets/d/1Zb0uOjI-uS8R9VDu2fyoq4lqgHuXXpOakVEEJWhl914/edit?usp=sharing

Use the template in `docs/google-sheets-template.md`.

## Vocabulary Import

See `docs/vocabulary-import-design.md` for the long-term design. The recommended approach is to use Wiktionary dumps and WordNet as durable base data, then enrich with API providers such as Datamuse and Free Dictionary through server-side adapters.

Starter vocabulary data is included at `data/vocabulary-seed.csv`. Source configuration is included at `data/vocabulary-import-sources.json`.

## Important Production Notes

Payment gateways, webhooks, AI model keys, and Google Sheets credentials must be configured only on the server. Never store provider secrets in frontend code.
