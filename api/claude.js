// Proxy to the Anthropic API so the key stays on the server.
//
// This endpoint spends real money on every call, so it is closed by default:
// no browser origin can reach it unless you name that origin in ALLOWED_ORIGINS.
// Requests from the same origin (the deployed site itself) send no Origin header
// and are allowed — those are this app's own calls.
//
// Set ALLOWED_ORIGINS in the Vercel project as a comma-separated list, e.g.
//   ALLOWED_ORIGINS=https://my-todos.vercel.app,http://localhost:3000

const ALLOWED_MODELS = new Set([
  'claude-opus-5',
  'claude-sonnet-5',
  'claude-haiku-4-5-20251001',
]);
const MAX_TOKENS_CEILING = 4096;

function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // No Origin header means a same-origin or server-side call — this app's own.
  // A cross-origin caller must be on the list; otherwise it never gets a CORS
  // header back and the browser drops the response.
  if (origin) {
    if (!allowedOrigins().includes(origin)) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server is not configured' });
  }

  // Forward a known shape rather than whatever the caller sent, so a request
  // cannot pick an arbitrary model or an unbounded token budget.
  const { model, messages, system, max_tokens, temperature } = req.body || {};

  if (!ALLOWED_MODELS.has(model)) {
    return res.status(400).json({ error: 'Unsupported model' });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }

  const payload = {
    model,
    messages,
    max_tokens: Math.min(Number(max_tokens) || 1024, MAX_TOKENS_CEILING),
  };
  if (system) payload.system = system;
  if (temperature !== undefined) payload.temperature = temperature;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Claude API' });
  }
}
