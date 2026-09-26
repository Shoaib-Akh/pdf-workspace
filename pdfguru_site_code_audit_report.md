# PDF Guru / PDF Workspace — Technical & SEO Audit Report

**Date:** 26 September 2026  
**Repository:** https://github.com/Shoaib-Akh/pdf-workspace  
**Production domain configured in code:** https://pdfguru.site  
**Reviewed branch:** `main`

## Executive summary

The project has a strong set of PDF tools, a large SEO page inventory, client-side processing, useful structured-data components, and a clear route architecture. The main problems are not the number of tools; they are deployment consistency, SEO rendering, canonical URL consistency, authentication/security, and a few incomplete/fake product flows.

The most important fixes are:

1. Make public SEO pages server-rendered or statically prerendered instead of relying on a client-rendered Vite SPA.
2. Remove all `pdfworkspace.app` references from production SEO metadata and use one canonical domain everywhere.
3. Remove the `secret123` admin fallback and redesign admin authentication around a real secret/session mechanism.
4. Decide on one deployment architecture (Vercel or Cloudflare Workers/Pages) and make the API route path consistent with it.
5. Implement real authentication or hide/remove the sign-in/signup flow until it actually works.
6. Fix the blog HTML sanitization boundary and the public ticket-status data exposure.
7. Fix structured-data assets and brand inconsistencies.

---

## 1. Critical — SEO pages are client-rendered only

### Evidence

`index.html` contains an empty application root and loads the React entry point:

- `<div id="root"></div>`
- `<script type="module" src="/src/main.tsx"></script>`

The React entry mounts `BrowserRouter` and `App`, and all route content is created in the browser. The tool pages are also lazy-loaded with `React.lazy()`.

Sources:
- https://github.com/Shoaib-Akh/pdf-workspace/blob/main/index.html
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/main.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/app/App.tsx

### Why this matters

Your SEO metadata is generated with `react-helmet-async`, which is also client-side. The initial HTML contains only the generic title/description. A crawler or social bot that does not fully execute the JavaScript can receive the shell instead of the actual H1, body copy, FAQs, internal links and page-specific metadata.

This matches the earlier live inspection: the site was reachable, but the crawler exposed very little useful page text.

### Fix

Use one of these architectures:

- **Preferred:** Next.js App Router / SSR for all public pages.
- **Lower-disruption option:** keep Vite + React for the processing UI but prerender/SSG all public landing pages.
- Keep `/workspace`, admin and other interactive sessions client-side/noindex.

The public SEO pages can remain client-side for the actual PDF processing while the marketing/SEO shell is statically generated.

---

## 2. Critical — Wrong canonical domain on PDF-to-JPG

`src/pages/convert/PdfToJpgPage.tsx` hard-codes:

`https://pdfworkspace.app/pdf-to-jpg`

But the production configuration defaults to `https://pdfguru.site`, and the sitemap uses `https://pdfguru.site/...`.

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/convert/PdfToJpgPage.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/lib/config.ts
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/public/sitemap.xml

### Risk

Google can receive conflicting URL signals. The PDF-to-JPG page can declare a different canonical domain than the actual site and sitemap.

### Fix

Never hard-code the production domain inside individual pages:

```ts
canonical={`${APP_CONFIG.url}/pdf-to-jpg`}
```

Then audit the entire repository for:

```text
pdfworkspace.app
pdfguru.site
PDF Workspace
PDF Guru
```

and establish a single source of truth.

---

## 3. Critical — Two deployment architectures are mixed

The repository contains both:

- `vercel.json` with a catch-all rewrite to `/index.html`
- `wrangler.toml` configured for a Cloudflare Worker + D1 database
- `src/worker.ts` containing API routes and admin endpoints

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/vercel.json
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/wrangler.toml
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/worker.ts

### Risk

The frontend and API can end up deployed to different runtimes unintentionally. The Vercel config is only an SPA rewrite, while the API implementation is in a Cloudflare Worker. If the production site is served by Vercel without a separate API deployment, calls such as `/api/contact` and `/api/admin/...` will not automatically execute `src/worker.ts`.

### Fix

Choose one architecture and document it:

**Option A — Cloudflare:**

```text
Cloudflare Worker
      +
Cloudflare Assets
      +
D1
```

**Option B — Vercel:**

```text
Vercel frontend
      +
Vercel/other API endpoints
      +
Database
```

Do not keep two competing production paths without an explicit routing design.

---

## 4. Critical security — hard-coded admin fallback secret

`src/worker.ts` uses:

```ts
const expected = env.ADMIN_SECRET || 'secret123'
```

and the admin login also uses the same fallback. The successful login returns the secret itself as the token.

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/worker.ts
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/admin/AdminDashboard.tsx

### Risk

This is not suitable for production administration. Anyone who knows or discovers the fallback can authenticate if the environment variable is absent/misconfigured.

### Fix

- Remove the fallback entirely.
- Fail closed if `ADMIN_SECRET` is missing.
- Do not use the raw admin secret as a bearer token.
- Use a short-lived signed session token or a proper identity provider.
- Add rate limiting and login attempt controls.
- Restrict admin access to the intended origin.
- Rotate the existing admin secret before launch.
- Do not store admin tokens as long-lived raw secrets in `localStorage` if a safer cookie/session design is possible.

---

## 5. High — Sign-in / sign-up is currently only a UI simulation

`AuthPage.tsx` does not call an authentication API. Submitting the form only sets local React state and displays “Check Your Inbox”. No magic link is actually sent.

Source:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/auth/AuthPage.tsx

### Risk

The UI claims functionality that is not implemented. Users can believe an account has been created or a sign-in email has been sent when neither occurred.

### Fix

Either:

- implement a real auth provider and email/magic-link flow, or
- remove/disable sign-in and signup until the backend is ready.

Do not keep simulated authentication on production routes.

---

## 6. High — Blog HTML is injected directly into the DOM

`BlogDetailPage.tsx` renders database content using:

```tsx
dangerouslySetInnerHTML={{ __html: blog.content }}
```

The admin UI intentionally accepts raw HTML, and the Worker stores that HTML in the database.

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/blog/BlogDetailPage.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/admin/AdminDashboard.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/worker.ts

### Risk

If an attacker gets blog-admin access, stored XSS can be introduced into public pages. The weak admin authentication makes this more important.

### Fix

Sanitize HTML before storage and/or before rendering. Use an allowlist for:

```text
h2, h3, p, ul, ol, li, strong, em, a, img, blockquote, code, pre
```

Strip scripts, event-handler attributes, unsafe URLs and other active content. Also add a strong Content Security Policy.

---

## 7. High — API CORS is wide open

The Worker sends:

```ts
Access-Control-Allow-Origin: *
```

for all API routes.

Source:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/worker.ts

### Risk

This is unnecessary for admin/contact APIs and increases the public attack surface.

### Fix

Allow only the production frontend origin, for example:

```text
https://pdfguru.site
```

and explicitly handle `OPTIONS` for that origin.

---

## 8. High — Ticket status endpoint returns the complete contact record

`GET /api/status/:trackingId` returns the full database row from `contact_messages`.

The row includes fields such as:

- name
- email
- message
- admin reply
- status
- timestamps

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/worker.ts
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/schema.sql

### Risk

The endpoint is public and uses only the tracking ID as the lookup key. It should not return unnecessary personal data.

### Fix

Return only what the user needs, e.g.:

```json
{
  "status": "replied",
  "reply": "..."
}
```

For stronger protection, require an additional verification value or issue a signed status token when the ticket is created.

---

## 9. High — Organization structured data points to a missing logo

`buildOrganizationSchema()` creates:

```ts
logo: `${config.siteUrl}/logo.png`
```

but `public/logo.png` does not exist in the repository.

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/components/seo/JsonLd.tsx
- Repository public assets

### Fix

Use an existing production logo asset or add a real `/logo.png`. The repository currently has an Open Graph image at `/og/home.jpg`.

---

## 10. High — Brand/domain configuration is inconsistent

The repository contains multiple identities:

- `PDF Guru`
- `PDF Workspace`
- `pdfguru.site`
- `pdfworkspace.app`

Examples:

`src/lib/config.ts` defaults to PDF Guru / pdfguru.site, while `.env.example` defaults to PDF Workspace / pdfworkspace.app. The blog page also hard-codes `PDF Workspace` text.

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/lib/config.ts
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/.env.example
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/blog/BlogDetailPage.tsx

### Fix

Choose one production brand and one canonical domain. Use configuration for all titles, URLs, schema, canonical tags, Open Graph, blog URLs and internal references.

---

## 11. Medium — Sitemap/robots do exist in the repository

Important correction to the earlier live inspection: the repository does contain both `public/robots.txt` and `public/sitemap.xml`.

`robots.txt` correctly points to:

`https://pdfguru.site/sitemap.xml`

and excludes `/workspace/` and `/api/`.

The sitemap contains the public tool/category/learn/legal URLs.

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/public/robots.txt
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/public/sitemap.xml

The remaining question is **whether the deployed production environment is actually serving these files directly**. My live fetcher could not open those production URLs, so this must be verified in the browser/curl from a normal network.

---

## 12. Medium — Tool aliases can create duplicate crawlable URLs

`App.tsx` exposes several aliases for the same page, such as:

- `/pdf-to-doc`
- `/pdf-to-docx`
- `/pdf-to-word`
- `/doc-to-pdf`
- `/docx-to-pdf`
- `/xlsx-to-pdf`
- `/xls-to-pdf`
- `/ppt-to-pdf`
- `/pptx-to-pdf`

Source:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/app/App.tsx

### Fix

Keep aliases for UX if needed, but make the primary URL explicit and ensure every alias redirects to or canonicalizes to the primary URL.

---

## 13. Medium — Homepage says PDF to Word is “Coming Soon” while the route is implemented

The homepage popular-tools list labels PDF to Word as:

`Coming Soon`

while the project contains a working `PdfToWordPage` route and tool definition marked available.

Sources:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/home/HomePage.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/convert/PdfToWordPage.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/data/tools.ts

### Fix

Make the product state consistent. Either make the tool genuinely “Coming Soon” or present it as available.

---

## 14. Medium — README and implementation state are inconsistent

README states some advanced conversions are “Server Processing (Future)”, while individual tools such as PDF-to-Word and PDF-to-Excel have browser implementations in the current source.

Source:
- https://github.com/Shoaib-Akh/pdf-workspace
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/convert/PdfToWordPage.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/convert/PdfToExcelPage.tsx

### Fix

Update README/product copy to distinguish:

- what is truly available now,
- what is browser-only,
- what is approximate/heuristic,
- what requires future server processing.

This is especially important for PDF-to-Word/Excel quality claims.

---

## 15. Medium — Workspace currently contains demo/static document-analysis values

`WorkspacePage.tsx` displays hard-coded example values such as:

- “4 Pages”
- “2 Tables”
- “1,480 Words”
- sample document metadata
- fixed sample text
- alert-based fake export buttons

Source:
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/pages/workspace/WorkspacePage.tsx

### Risk

This can make the workspace appear to process a user's uploaded document while showing sample data instead of actual extracted data.

### Fix

Connect those panels to the actual PDF engine/extraction results before marketing the workspace as production-ready.

---

## 16. Positive aspects found

The repository already has several good foundations:

- 60+ planned public landing/tool pages.
- A dedicated SEO metadata component.
- JSON-LD builders for WebSite, Organization, WebApplication, FAQ and breadcrumbs.
- A real sitemap and robots file in source control.
- Breadcrumb navigation on tool pages.
- Client-side loading of heavy PDF/OCR libraries and explicit Vite chunk configuration.
- Browser-first privacy architecture for many tools.
- Privacy-oriented analytics sanitization that blocks filename/email/text-like property keys.
- A broad internal linking structure among related tools.

Sources:
- https://github.com/Shoaib-Akh/pdf-workspace
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/components/seo/MetaTags.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/components/seo/JsonLd.tsx
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/src/services/analytics/analytics.ts
- https://raw.githubusercontent.com/Shoaib-Akh/pdf-workspace/main/vite.config.ts

---

# Recommended fix order

## Phase 1 — Security + production correctness

1. Remove `secret123` fallback.
2. Replace admin-token-as-secret architecture.
3. Restrict API CORS.
4. Protect/sanitize blog HTML.
5. Reduce data returned by ticket-status API.
6. Decide Cloudflare vs Vercel deployment.
7. Remove or implement fake authentication.

## Phase 2 — SEO foundation

1. Establish `APP_CONFIG.url` as the only canonical source.
2. Replace all hard-coded domains.
3. Fix the missing organization logo.
4. Verify production `robots.txt` and `sitemap.xml` return the actual files.
5. Prerender/SSR all public SEO routes.
6. Add `noindex` to admin/auth/session pages where appropriate.
7. Canonicalize every alias route.

## Phase 3 — Product quality

1. Replace Workspace demo values with real extraction data.
2. Remove fake alerts from export buttons.
3. Reconcile “Coming Soon” and “Available” states.
4. Reconcile README and actual tool capabilities.
5. Add automated smoke tests for every major tool route.

## Phase 4 — SEO growth

1. Maintain one landing page per genuine search intent.
2. Strengthen internal linking between category hubs and tool pages.
3. Publish useful, non-duplicate guides in the Learn section.
4. Track indexing and search performance in Google Search Console.

---

# Final assessment

The codebase has a good foundation for a large browser-first PDF utility site, but I would not treat the current repository as fully production-ready yet. The highest-risk areas are **client-only SEO rendering, mixed deployment architecture, weak admin authentication, fake auth, and inconsistent canonical/brand configuration**.

The good news is that these are mostly architecture and hardening issues. The existing route structure, SEO components, sitemap, internal-linking model and browser PDF engine give you a solid base to fix them without throwing the whole project away.
