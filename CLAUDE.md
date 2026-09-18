# my-todos — working notes for Claude

A to-do app. One `index.html` plus a single Vercel serverless function that proxies the
Anthropic API. No build step, no framework, no `package.json`.

## Two things to know

**This repo is public.** It is one of only two public repos on the account; everything else is
private. `api/claude.js` reads `ANTHROPIC_API_KEY` from `process.env` and no key is in the
source — keep it that way. A key committed here is a key published.

The proxy sets `Access-Control-Allow-Origin: *`, so anyone who finds the deployed URL can
spend your API credits through it. That is fine for a personal toy and not fine for anything
else. If this ever gets real use, put an origin check or auth in front of it.

**It is dormant.** Thirty-four commits, last touched 2026-06-28, nearly all of them
"Update index.html" — edited straight through the GitHub web UI rather than locally.
