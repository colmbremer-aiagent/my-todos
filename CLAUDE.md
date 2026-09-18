# my-todos — working notes for Claude

A to-do app. One `index.html` plus a single Vercel serverless function that proxies the
Anthropic API. No build step, no framework, no `package.json`.

## Two things to know

**This repo is public.** It is one of only two public repos on the account; everything else is
private. `api/claude.js` reads `ANTHROPIC_API_KEY` from `process.env` and no key is in the
source — keep it that way. A key committed here is a key published.

`api/claude.js` is closed by default as of 2026-09-17. A cross-origin caller gets 403 unless
its origin is listed in the **`ALLOWED_ORIGINS`** env var on Vercel (comma-separated). The
app's own same-origin calls send no `Origin` header and still work, so nothing needs setting
for normal use. It also pins the model to a known list and caps `max_tokens` at 4096, so a
caller cannot pick an expensive model or an unbounded budget.

Nothing in this app actually calls `/api/claude` — the to-do list talks to Firebase directly.
The endpoint is unused. Deleting it removes the cost exposure entirely and would be the
simpler fix if you don't want it.

**It is dormant.** Thirty-four commits, last touched 2026-06-28, nearly all of them
"Update index.html" — edited straight through the GitHub web UI rather than locally.
