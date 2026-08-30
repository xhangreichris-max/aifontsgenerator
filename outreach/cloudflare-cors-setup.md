# Cloudflare CORS setup for /api/*.json

**Why:** GitHub Pages does not send `Access-Control-Allow-Origin` headers.
Without it, a developer's own JavaScript (running on their own domain)
can't `fetch()` `https://aifontsgenerator.com/api/styles.json` — the
browser blocks the response before their code ever sees it. This only
affects browser-based `fetch`/`XHR` calls; curl, server-side code, and
directly opening the URL in a browser tab all work fine already.

This file is instructions only. Nothing has been changed in Cloudflare —
follow these steps manually in the dashboard.

**Prerequisite:** aifontsgenerator.com's DNS must already be proxied
through Cloudflare (orange cloud, not grey/DNS-only) for a Transform
Rule to apply. If you're not sure, check **DNS → Records** first and
confirm the proxy status icon next to the domain's A/CNAME record is
orange.

## Steps

1. Log in to the Cloudflare dashboard: https://dash.cloudflare.com
2. Select the **aifontsgenerator.com** zone (click it from the account
   home list).
3. In the left sidebar, go to **Rules → Transform Rules**.
4. Click the **HTTP Response Header Modification** tab (not "Rewrite
   URL" and not "Modify Request Header").
5. Click **Create rule**.
6. Fill in the rule form with these exact values:

   | Field | Value |
   |---|---|
   | Rule name | `API CORS headers` |
   | When incoming requests match | **Custom filter expression** |

7. Under "Custom filter expression", set the condition:

   | Field | Value |
   |---|---|
   | Field | `URI Path` |
   | Operator | `matches regex` |
   | Value | `^/api/.*\.json$` |

   (If the dropdown doesn't offer "matches regex," use **Field:** `URI
   Path`, **Operator:** `contains`, **Value:** `/api/` instead — slightly
   broader, but every current file under `/api/` is JSON, so it's
   equivalent in practice.)

8. Under "Then modify response header", click **Add header** and set:

   | Field | Value |
   |---|---|
   | Action | `Set static` |
   | Header name | `Access-Control-Allow-Origin` |
   | Value | `*` |

9. Click **Deploy**.

## Verify it worked

From any terminal (replace nothing — this is the real URL):

```
curl -I https://aifontsgenerator.com/api/styles.json
```

Look for this line in the response headers:

```
access-control-allow-origin: *
```

If it's missing, double-check step 2 (correct zone) and step 6's path
match — Cloudflare Transform Rules only fire on requests that hit
Cloudflare's edge, so if the DNS record for aifontsgenerator.com isn't
proxied (orange cloud), this rule will never run.

## Notes

- This rule only touches response headers. It does not cache, redirect,
  or rewrite anything, and it has no effect on any other page or file
  on the site — only requests whose path matches `/api/*.json`.
- `Access-Control-Allow-Origin: *` is appropriate here because
  `/api/styles.json` and `/api/index.json` are public, read-only,
  non-authenticated data — there's no session or credential that a
  wildcard origin could leak.
- If you ever add a non-JSON file under `/api/` that should NOT get
  this header, either narrow the regex in step 7 (e.g. explicitly list
  `^/api/(styles|index)\.json$`) or give that file a different path.
