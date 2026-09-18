# my-todos — working notes for Claude

A to-do app. One `index.html` plus a single Vercel serverless function that proxies the
Anthropic API. No build step, no framework, no `package.json`.

## Two things to know

**This repo is public.** It is one of only two public repos on the account; everything else is
private. `api/claude.js` reads `ANTHROPIC_API_KEY` from `process.env` and no key is in the
source — keep it that way. A key committed here is a key published.

**There is no backend.** `api/claude.js` was a proxy to the Anthropic API, closed to unknown
origins on 2026-09-17 and then deleted the same day — nothing in the app ever called it, and
an unused endpoint that spends money is a liability with no upside. It is in git history at
`e029ed8` if it is ever wanted back.

`vercel.json` still carries a no-op `/api/(.*)` rewrite. Harmless, and it means a new endpoint
would work without touching config.

`index.html` talks to a Firebase Realtime Database directly, with the database URL and its
path hardcoded in the page. **In a public repo that path is published**, so it is not a
secret — whatever protects that data has to be the Firebase rules, not the obscurity of the
URL. Check the rules before putting anything private in there.

**It is dormant.** Thirty-four commits, last touched 2026-06-28, nearly all of them
"Update index.html" — edited straight through the GitHub web UI rather than locally.
