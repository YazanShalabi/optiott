# Optimizely SaaS CMS — Best Practices Addendum

> Updated from real implementation experience on OptiOTT. Supplements the
> built-in `optimizely-saas-cms` skill with hard-won lessons about the
> preview3 REST API, Visual Builder, and content modeling.

---

## 1. Always Use BlankExperience as Primary Layout

**Do NOT use traditional page layouts** (`HomePage`, `AboutPage`, `ContactPage`, etc.). Use **`BlankExperience`** (baseType: `_experience`) as the primary content type for every page. This gives authors full drag-and-drop control in Visual Builder.

- `BlankExperience` = full-page VB composition zone
- Create specialized experiences only when zones are needed (e.g. `HomePageExperience` with hero zone + main zone; `ContentPageExperience` with breadcrumb zone + main zone)
- The 3 home-page variants of a template become 3 VB compositions of the SAME code
- Detail items (individual movies, blog posts, TV shows) are also `BlankExperience` content — children of the listing experience

**Symptom of doing this wrong:** pages show a document icon in the tree instead of the grid/layout icon. The Visual Builder outline is locked to the page type's fixed property form rather than a drag-and-drop composition.

---

## 2. Content Type Definition Gotchas (hard rules)

The preview3 API rejects non-matching schemas. These rules were discovered by trial and error:

### Base type values need underscore prefixes
- `_component` (not `component`)
- `_experience` (not `experience`)
- `_page` (not `page`)
- `_section`, `_image`, `_video`, `_media`, `_folder`

### Valid property types are LIMITED
Only these `type` values are accepted:
```
array, boolean, component, dateTime, float, integer, json, string, url
```
- ❌ `contentReference` → use `component`
- ❌ `contentReferenceList` → use `array` with `items.type: component`
- ❌ `xhtmlString` / `richText` → use `string` (rich text storage)
- ❌ `date` → use `dateTime`
- ✅ For image properties pointing at asset URLs: use **`url`**, NOT `component` referencing `ImageMedia`. `ImageMedia` (baseType `_image`) CANNOT be referenced as a component property.
- ✅ For links (LinkToDetail, LinkToPage): use **`url`** (Optimizely rejects `_page` as a component content type).

### `component` property type requires `contentType`
```json
"MyProp": {
  "type": "component",
  "contentType": "MyComponentType"
}
```
- Must be a SINGLE STRING, not an array
- The referenced type must have `baseType: _component` (not `_image`, `_page`, etc.)

### `array` property type requires `items`
```json
"MyArray": {
  "type": "array",
  "items": { "type": "component", "contentType": "SomeBlock" }
}
```

### `array` properties NOT allowed on `elementEnabled` types
If a content type has `"compositionBehaviors": ["sectionEnabled", "elementEnabled"]`, it CANNOT have `array` properties. Error: `"The property 'X' is not allowed when content type has ElementEnabled."`

**Fix:** Children of `elementEnabled` components are managed through the VB composition (drag-and-drop), not via array properties. Remove the array prop entirely.

### Property groups must exist or be omitted
Do NOT use `"group": "Content"` or `"group": "Metadata"` unless you've defined those groups first. Omit the `group` field entirely.

### Display template `choices` keys must match a strict regex
Choice keys in `.opti-style.json` must match `[A-Za-z_][A-Za-z0-9_]*` — **no hyphens allowed**. Use camelCase.
```json
// ❌ WRONG
"choices": { "two-col": {...}, "full-width": {...} }
// ✅ CORRECT
"choices": { "twoCol": {...}, "fullWidth": {...} }
```

### Display template `editor` values
Only `"select"` or `"checkbox"` are accepted. Any other value is silently rejected.

### Choice values must be objects, not strings
```json
// ❌ WRONG
"choices": { "twoCol": "Two Column" }
// ✅ CORRECT
"choices": { "twoCol": { "displayName": "Two Column", "sortOrder": 10 } }
```

---

## 3. REST API Patterns (preview3/experimental)

Base URL: `https://api.cms.optimizely.com/preview3/experimental/content`
Auth: `Bearer <access_token>` from `POST https://api.cms.optimizely.com/oauth/token` with `grant_type=client_credentials`

### Create content
```http
POST /preview3/experimental/content
Content-Type: application/json

{
  "contentType": "BlankExperience",
  "container": "<parent-key-without-dashes>",
  "displayName": "Home",
  "routeSegment": "home",
  "status": "draft",
  "locale": "en"
}
```
- `locale` is REQUIRED at the top level for localized content types (omit for non-localized like `SysContentFolder`)
- Response gives you `key` and `version`

### Properties must be set via PATCH version, not POST
```http
PATCH /preview3/experimental/content/{key}/versions/{version}
Content-Type: application/merge-patch+json

{
  "properties": {
    "SiteName": "OptiOTT",
    "Title": "Home Page"
  }
}
```
**CRITICAL:** `POST /content` with `"properties": {...}` in the body silently DROPS the properties. `POST /content/{key}/versions` with `"properties": {...}` ALSO drops them. The only way to set properties is the PATCH version route with `application/merge-patch+json`.

### Publish a draft version
```http
PATCH /preview3/experimental/content/{key}/versions/{version}
Content-Type: application/merge-patch+json

{ "status": "published" }
```

### Move content (change container)
```http
PATCH /preview3/experimental/content/{key}
Content-Type: application/merge-patch+json

{ "container": "<new-parent-key>" }
```
- You CANNOT change `contentType` — error: `"Changing the content type on an existing content item is not supported."`
- For a content type migration, DELETE + recreate

### Content keys: dashed vs undashed
- The CMS UI and Live Preview URL template use **dashed UUID** format: `72b8834e-e8da-4a66-8e20-8417ba45bb35`
- Content Graph stores keys **without dashes**: `72b8834ee8da4a668e208417ba45bb35`
- In the preview page, always normalize: `key.replace(/-/g, '')` before querying Content Graph

### NOT supported in preview3
- ❌ **Binary file uploads** (images, videos). `PUT /content/{key}/assets` returns 405. `POST /versions` with `Content-Type: image/jpeg` returns 415. `multipart/form-data` returns 415. Media must be uploaded via the CMS UI drag-and-drop (native OS file picker).
- ❌ Application/site/hostname management endpoints
- ❌ Webhook registration
- ❌ Content move operations (other than container PATCH)

---

## 4. Content Tree Structure — Where to Put What

### Critical folder: "For This Application"
This is a `SysContentFolder` created automatically when you check "Enable application-specific assets" in an application's settings. It's the parent of:
- **Shared Blocks** (component-type content that appears in the right-side Shared Blocks panel)
- **Media** (image/video content items application-scoped)

**Gotcha:** The Shared Blocks panel only shows content whose `container` = this folder key. Content you put directly under the experience (like under `optiott`) will NOT appear in the Shared Blocks panel even if it's a component type. You have to either:
1. Create it with `container = <application folder key>`, or
2. Create it anywhere, then PATCH its `container` to move it

**Finding the application folder key:** List the children of the application root experience (e.g. the `optiott` BlankExperience) and look for the item of type `SysContentFolder` with `displayName: "For This Application"`.

### Tree layout per application
```
Root/
├── Home/                    # opti-cinema default (legacy)
└── optiott/                 # your app — BlankExperience (start page)
    ├── For This Application/  # SysContentFolder
    │   ├── Site Settings     # SiteSettings component
    │   ├── Nav Home          # NavigationItem
    │   ├── Nav Movies        # NavigationItem
    │   ├── Social Facebook   # SocialLink
    │   ├── Hero 1            # HeroBannerBlock
    │   ├── Movie Card - Dark Knight   # MovieCardBlock
    │   ├── Pricing - Basic   # PricingCardBlock
    │   └── ... (all shared blocks live here)
    ├── Home                  # BlankExperience (home page)
    ├── About Us              # BlankExperience
    ├── Contact Us            # BlankExperience
    ├── Pricing               # BlankExperience
    ├── Our Team              # BlankExperience
    ├── Movies                # BlankExperience (listing)
    │   ├── The Dark Knight   # BlankExperience (detail)
    │   ├── Inception         # BlankExperience (detail)
    │   └── Interstellar      # BlankExperience (detail)
    ├── TV Shows              # BlankExperience (listing)
    │   ├── Stranger Things   # BlankExperience (detail)
    │   └── The Last of Us    # BlankExperience (detail)
    ├── Web Series            # BlankExperience (listing)
    ├── Blog                  # BlankExperience (listing)
    │   └── <posts>           # BlankExperience (detail)
    ├── Coming Soon           # BlankExperience
    ├── Login                 # BlankExperience
    └── 404                   # BlankExperience
```

**All pages are BlankExperience.** Details are BlankExperience children of listing experiences. Shared components live in the For This Application folder.

---

## 5. Live Preview Wiring

### Preview URL template
Configured at **Settings → Applications → [your app] → Live Preview**. The template is:
```
{host}/preview?key={key}&ver={version}&loc={locale}&ctx={context}&preview_token={token}
```
- `{host}` comes from the **Hostnames** tab for the same application
- `{key}` is a dashed UUID — normalize with `.replace(/-/g, '')` before querying Content Graph
- `{version}` is the content version number
- `{preview_token}` is a short-lived bearer for draft content

### Frame headers — MUST allow iframe embedding
The CMS embeds the preview URL in an iframe. If your Vercel project has deployment protection enabled, Vercel returns `x-frame-options: DENY` which blocks the iframe and the user sees "404 - This page could not be found" inside the CMS.

**Fix:** Either disable Vercel deployment protection OR (if you need auth) return these headers from your `/preview` route handler:
```
X-Frame-Options: ALLOWALL
Content-Security-Policy: frame-ancestors 'self' https://*.cms.optimizely.com https://*.optimizely.com
```

### The iframe uses the DEFAULT application's Live Preview URL
If multiple applications exist in the CMS, the iframe picks the one whose content owns the item. If content is under the wrong application tree, the iframe hits the wrong Vercel URL. **Fix:** move content to the correct application tree using container PATCH.

### Route handler vs page component
Use a Next.js **Route Handler** (`route.ts`) for `/preview`, not a Page Component (`page.tsx`). The route handler can return raw HTML directly with custom headers. A page component is constrained by your root layout and can't return custom `X-Frame-Options`. Example:

```ts
// src/app/preview/route.ts
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const key = (params.get('key') ?? '').replace(/-/g, '')
  // fetch content from Content Graph ...
  // read the template HTML file from /public
  // inject CMS content into the template
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors 'self' https://*.cms.optimizely.com https://*.optimizely.com",
    },
  })
}
```

### `communicationinjector.js` + auto-refresh
Load `/communicationinjector.js` from the CMS instance root (`https://<cms>/util/javascript/communicationinjector.js`) into `public/`. Inject a `<script src="/communicationinjector.js">` + a listener:
```html
<script src="/communicationinjector.js"></script>
<script>
  window.addEventListener('optimizely:cms:contentSaved', function() {
    setTimeout(function() { window.location.reload(); }, 750);
  });
</script>
```

### Template-based preview strategy
For a site that maps CMS pages to HTML template files in `/public`, use a `TEMPLATE_FOR_SLUG` map keyed by URL slug:
```ts
const TEMPLATE_FOR_SLUG: Record<string, string> = {
  '': 'index.html',
  home: 'index.html',
  about: 'about.html',
  contact: 'contact.html',
  pricing: 'pricing.html',
  // ...
}
// Detect detail pages by parent segment
const DETAIL_TEMPLATE_FOR_PARENT: Record<string, string> = {
  movies: 'movie-details.html',
  'tv-shows': 'tv-shows-details.html',
  blog: 'news-details.html',
}
// Pick template from content's URL path
const url = content._metadata?.url?.default || ''
const segments = url.replace(/^\/+|\/+$/g, '').replace(/^en\//, '').split('/').filter(Boolean)
if (segments.length >= 2) {
  // detail page — use parent segment
  const parent = segments[segments.length - 2]
  return DETAIL_TEMPLATE_FOR_PARENT[parent] || 'index.html'
}
const slug = segments[0] || ''
return TEMPLATE_FOR_SLUG[slug] || 'index.html'
```

---

## 6. Content Graph Query Patterns

### Always use undashed keys
```graphql
query PreviewContent($key: String!) {
  _Content(
    where: { _metadata: { key: { eq: $key } } }
    variation: { include: ALL }
    limit: 1
  ) { items { _metadata { key version types displayName url { default hierarchical } } } }
}
```

### Query only types that exist in the Content Graph schema
If you push a content type with an invalid property, the type MAY be created in the management DB but NOT exposed in the Content Graph schema (e.g. `ContentDetailPage` was created but missing from GraphQL because of a self-referencing array). Inline fragments against missing types will fail the entire query. Use `__schema { types { name } }` to verify.

### Single key auth works for most queries
```
GET https://cg.optimizely.com/content/v2?auth=<SINGLE_KEY>&stored=false
```
- `stored=false` for live/draft content
- `stored=true` for published + persisted query caching (production)
- Single key is READ-ONLY for published content
- App key + secret (Basic auth) for draft previews

### 3-tier auth fallback in the preview route
```ts
// 1) Try single key (public, read-only)
if (singleKey) { /* try ?auth=singleKey */ }
// 2) Try preview_token from URL (bearer)
if (token && token.length > 10) { /* try Authorization: Bearer token */ }
// 3) Fall back to app key + secret basic auth
if (appKey && secret) { /* try Authorization: Basic base64(appKey:secret) */ }
```

---

## 7. Component Co-location (5 files per VB component)

```
ComponentName/
├── index.tsx                         # React Server Component w/ data-epi-edit
├── ComponentName.opti-type.json      # Content type schema
├── DefaultComponent.opti-style.json  # Display template variant(s)
├── componentName.graphql             # GraphQL fragment
└── ComponentNameStyling.ts           # Display settings → Tailwind class map
```

### `CmsComponent` type from `@remkoj/optimizely-cms-react` is strict
In SDK v5, `CmsComponent<T>` requires a `getDataQuery` property when T extends DocumentNode. For simple layout components, use `CmsLayoutComponent` or `React.FC<any>` to avoid the type error. `CmsLayoutComponent` doesn't include `displaySettings` in its props — if you need `displaySettings`, fall back to typing as `React.FC<any>`.

### `@remkoj` v5 vs v6
The v5 SDK targets preview3 API. v6-rc targets preview4 which is what most production CMS instances now run. Use `v6.0.0-rc.1` or later if the CMS reports `preview4` in `/preview3/cms:version`.

---

## 8. Package Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "codegen": "graphql-codegen --config codegen.ts",
    "type:push:all": "opti-cms type:push --all",
    "style:push:all": "opti-cms style:push --all"
  }
}
```

**Gotcha:** `@remkoj/optimizely-cms-cli` ships a binary that starts with `import` statements and no shebang line. On macOS, `npx opti-cms` or running the binary directly conflicts with ImageMagick's `import` command. **Workaround:**
```bash
node ./node_modules/.bin/opti-cms type:push --all
```

**Peer dep conflict:** the SDK requires `graphql-request@^6` but the ecosystem has moved to `^7`. Add `.npmrc` with:
```
legacy-peer-deps=true
```
Otherwise `npm install` fails with ERESOLVE on Vercel.

---

## 9. Display Template Rules

- `"editor"` only accepts `"select"` or `"checkbox"`
- All VB components: `"compositionBehaviors": ["sectionEnabled", "elementEnabled"]`
- Push content types BEFORE display templates (styles reference types)
- Choice keys must be alphanumeric + underscore (no hyphens)
- Choice values must be `{ displayName, sortOrder }` objects, not plain strings

---

## 10. Media Library Limitations

### Binary uploads require the CMS UI
The preview3 REST API has NO endpoint for binary file uploads. `PUT /content/{key}/assets` is 405 Method Not Allowed; the `/assets` endpoint is GET-only (listing). Multipart/form-data and `Content-Type: image/jpeg` both return 415.

**Workarounds:**
1. **Manual UI upload:** drag-drop files into the Media panel in the CMS admin
2. **External URLs:** if your component types use `type: "url"` for image props, you can create ImageMedia metadata entries that have no binary and just reference external URLs stored in string/url properties on other content. This keeps the asset binary hosted elsewhere (e.g. Vercel public folder) and avoids the upload problem.
3. **Future:** the non-experimental Management API (v1) may expose upload endpoints later

### Content reference to ImageMedia is NOT supported
Even though `ImageMedia` is a content type, you **cannot** use it as a `component` property's `contentType`. The CMS returns: `"The content type 'ImageMedia' cannot be used as a component property content type."` because its `baseType` is `_image`, not `_component`.

**Solution:** store image references as `type: "url"` string properties instead of `type: "component"`.

---

## 11. Performance

- ISR 60s revalidation + on-demand webhook revalidation
- `?stored=true` on all Content Graph queries (persisted query caching)
- `variation: { include: ALL }` on every query (draft + A/B variants)
- React Server Components for content-only components
- `force-no-store` + `dynamic: 'force-dynamic'` on the `/preview` route only

---

## 12. Known CMS UI Gotchas

### Tree navigation requires double-click
Single-click on a tree item in the Pages panel often doesn't load the content. Use double-click to force-navigate.

### Form inputs resist JavaScript value setting
Setting `input.value` directly via JS, even with a React native setter and dispatched events, often doesn't register as a "dirty" change in the CMS forms. Real keystrokes (type events with delay) are required. The form_input MCP tool can work but doesn't always trigger change detection.

### Content Type UI picker icons
- **Document icon** = page layout (`_page` baseType) — AVOID
- **Grid/layout icon** = experience (`_experience` baseType) — USE THIS

If you see document icons in the tree, the content was created as the wrong baseType.
