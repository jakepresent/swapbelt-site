const ALLOWED_METHODS = 'POST, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type';

export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = buildCorsHeaders(request, env);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': ALLOWED_METHODS,
        'Access-Control-Allow-Headers': ALLOWED_HEADERS,
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  const configError = validateConfig(env);
  if (configError) {
    return jsonResponse({ error: configError }, 500, corsHeaders);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  if (payload.website) {
    return jsonResponse({ ok: true }, 200, corsHeaders);
  }

  const email = String(payload.email || '').trim().toLowerCase();
  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'Enter a valid email address' }, 400, corsHeaders);
  }

  const beehiivResponse = await subscribeToBeehiiv({
    env,
    email,
    referringSite: safeString(payload.referring_site),
    source: safeString(payload.source) || 'swapbelt-site'
  });

  if (beehiivResponse.ok) {
    return jsonResponse({ ok: true }, 200, corsHeaders);
  }

  if (beehiivResponse.status === 400 && beehiivResponse.alreadySubscribed) {
    return jsonResponse({ ok: true, already_subscribed: true }, 200, corsHeaders);
  }

  return jsonResponse(
    { error: 'Could not join early access list right now' },
    beehiivResponse.status >= 400 && beehiivResponse.status < 500 ? 400 : 502,
    corsHeaders
  );
}

function validateConfig(env) {
  if (!env.BEEHIIV_API_KEY) return 'Missing BEEHIIV_API_KEY';
  if (!env.BEEHIIV_PUBLICATION_ID) return 'Missing BEEHIIV_PUBLICATION_ID';
  if (!/^pub_[0-9a-fA-F-]+$/.test(env.BEEHIIV_PUBLICATION_ID)) return 'Invalid BEEHIIV_PUBLICATION_ID';
  return '';
}

async function subscribeToBeehiiv({ env, email, referringSite, source }) {
  const url = `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      reactivate_existing: false,
      send_welcome_email: true,
      double_opt_override: 'on',
      utm_source: source,
      utm_medium: 'website',
      utm_campaign: 'early_access',
      referring_site: referringSite
    })
  });

  const body = await safeJson(response);

  return {
    ok: response.ok,
    status: response.status,
    alreadySubscribed: isAlreadySubscribed(body),
    body
  };
}

function isAlreadySubscribed(body) {
  const serialized = JSON.stringify(body || {}).toLowerCase();
  return serialized.includes('already') && serialized.includes('subscrib');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeString(value) {
  if (typeof value !== 'string') return '';
  return value.slice(0, 500);
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = (env.ALLOWED_ORIGINS || 'https://swapbelt.com,https://www.swapbelt.com')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function jsonResponse(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers });
}
