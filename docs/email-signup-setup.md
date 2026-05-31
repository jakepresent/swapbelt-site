# SwapBelt early access signup setup

The site keeps the signup form native, but the email submission should go through a Cloudflare Pages Function so the beehiiv API key is never exposed in browser JavaScript.

## Current decision

- Signup label: **early access list**
- Subscriber destination: existing SwapBelt beehiiv publication
- Double opt-in: **on**
- beehiiv welcome email: **send immediately**
- No Cloudflare D1 database for v1. beehiiv is the source of truth.

## Secret handling

Do not commit API keys, publication IDs, copied secret-file contents, or key-like prefixes.

Before deploying, confirm both beehiiv values from beehiiv:

```text
Settings -> Workspace Settings -> API
```

Required values:

1. A valid beehiiv API key from the API Keys section. This is the Bearer token Cloudflare uses to call beehiiv.
2. The SwapBelt Publication ID from the Publication ID section.

The Publication ID is used in the URL path and is not the same thing as the Bearer API key. During setup, keep both values only in Cloudflare environment variables/secrets and in local private notes outside this repo.

## Cloudflare Pages setup

This repo uses a Pages Function at:

```text
functions/subscribe.js
```

Required Cloudflare environment variables/secrets:

```text
BEEHIIV_API_KEY          # secret, valid beehiiv v2 API key
BEEHIIV_PUBLICATION_ID   # variable, beehiiv publication id
ALLOWED_ORIGINS          # variable, comma-separated origins
```

Recommended `ALLOWED_ORIGINS` for production:

```text
https://swapbelt.com,https://www.swapbelt.com,https://jakepresent.github.io
```

If testing from a Cloudflare preview URL, add that preview origin temporarily.

## Site endpoint wiring

The frontend reads:

```js
window.SWAPBELT_SUBSCRIBE_ENDPOINT
```

For Cloudflare Pages, set this before `script.js` in `index.html` after the Pages Function is deployed:

```html
<script>
  window.SWAPBELT_SUBSCRIBE_ENDPOINT = '/subscribe';
</script>
<script src="script.js"></script>
```

If the site remains hosted on GitHub Pages while the Worker/Pages Function lives on Cloudflare, use the full Worker URL instead:

```html
<script>
  window.SWAPBELT_SUBSCRIBE_ENDPOINT = 'https://YOUR-WORKER-OR-PAGES-DOMAIN/subscribe';
</script>
<script src="script.js"></script>
```

## Local validation

Static checks:

```bash
node --check script.js
node --check functions/subscribe.js
```

The Function expects JSON:

```json
{
  "email": "runner@example.com",
  "source": "swapbelt-site",
  "referring_site": "https://swapbelt.com/"
}
```

beehiiv request body sent by the Function:

```json
{
  "email": "runner@example.com",
  "reactivate_existing": false,
  "send_welcome_email": true,
  "double_opt_override": "on",
  "utm_source": "swapbelt-site",
  "utm_medium": "website",
  "utm_campaign": "early_access",
  "referring_site": "https://swapbelt.com/"
}
```

## Deploy notes

Prefer Josh-owned Cloudflare account for long-term ownership. Jake can be invited as an admin/member and perform setup there.

Do not use `wrangler secret put` or Cloudflare dashboard secret forms in a terminal/logging context that prints the key. Paste secrets only into secure prompts or dashboard fields.
