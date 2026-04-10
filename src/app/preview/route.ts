/**
 * Visual Builder live-preview route.
 *
 * Fetches the experience composition from Content Graph and renders it into
 * the WowTube template shell. Every editable field carries a data-epi-edit
 * attribute so Optimizely's on-page editor can target it, and the page reloads
 * on `optimizely:cms:contentSaved` so authors see changes immediately.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { NextRequest } from 'next/server'
import {
  fetchExperienceByKey,
  type ExperienceData,
  type FetchExperienceResult,
} from '@/lib/composition-query'
import { renderComposition } from '@/lib/composition-renderer'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

// Markers in public/index.html that delimit the authorable main-content region.
// Everything before MAIN_START (head, offcanvas, header, search bar) is preserved
// as the "shell top". Everything from MAIN_END onward (footer, scripts) is
// preserved as the "shell bottom". The composition is injected in between.
const MAIN_START = '<!-- Hero Section Start -->'
const MAIN_END = '<!-- Footer Section Start -->'

type Shell = { top: string; bottom: string }
let cachedShell: Shell | null = null

async function loadShell(): Promise<Shell> {
  if (cachedShell) return cachedShell
  const templatePath = path.join(process.cwd(), 'public', 'index.html')
  const html = await readFile(templatePath, 'utf-8')
  const startIdx = html.indexOf(MAIN_START)
  const endIdx = html.indexOf(MAIN_END)
  if (startIdx === -1 || endIdx === -1) {
    // Fallback: split at </header> … <footer
    const headerEnd = html.indexOf('</header>')
    const footerStart = html.indexOf('<footer')
    cachedShell = {
      top: html.slice(0, headerEnd === -1 ? 0 : headerEnd + '</header>'.length),
      bottom: html.slice(footerStart === -1 ? html.length : footerStart),
    }
    return cachedShell
  }
  cachedShell = {
    top: html.slice(0, startIdx),
    bottom: html.slice(endIdx),
  }
  return cachedShell
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function updateTitle(top: string, experience: ExperienceData | null): string {
  const displayName = experience?._metadata?.displayName
  if (!displayName) return top
  return top.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeHtml(displayName)} — OptiOTT</title>`
  )
}

function renderHeader(
  experience: ExperienceData | null,
  key: string,
  diagnostic: FetchExperienceResult['diagnostic']
): string {
  const displayName = experience?._metadata?.displayName || '(no experience)'
  const primaryType = experience?._metadata?.types?.[0] || diagnostic.source
  const nodeCount = experience?.composition?.nodes?.length ?? 0
  const errCount = diagnostic.errors?.length ?? 0
  const line2 = `${nodeCount} sections · ${primaryType}${errCount ? ` · ${errCount} GQL error${errCount === 1 ? '' : 's'}` : ''}`
  return `
  <div id="optiott-live-preview-badge" style="position:fixed;top:20px;right:20px;z-index:99999;background:#e50914;color:#fff;padding:10px 18px;border-radius:6px;font-size:12px;font-weight:700;letter-spacing:1px;font-family:Arial,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.6);display:flex;align-items:center;gap:10px;max-width:420px;">
    <span style="width:8px;height:8px;background:#fff;border-radius:50%;animation:optiott-pulse 1.5s infinite;flex-shrink:0;"></span>
    <div style="line-height:1.4;">
      <div>LIVE PREVIEW</div>
      <div style="font-weight:400;font-size:10px;opacity:.85;">${escapeHtml(displayName)} · ${escapeHtml(line2)}</div>
    </div>
  </div>
  <style>@keyframes optiott-pulse{0%,100%{opacity:1}50%{opacity:.3}}</style>
  <script>
    window.__optiottExperienceKey = ${JSON.stringify(key)};
    window.__optiottDiagnostic = ${JSON.stringify(diagnostic)};
  </script>`
}

const CMS_BRIDGE = `
  <script src="/communicationinjector.js"></script>
  <script>
    (function () {
      var lastReload = 0;
      var reload = function (reason) {
        var now = Date.now();
        // Debounce: the CMS often fires multiple events for a single save.
        if (now - lastReload < 400) return;
        lastReload = now;
        var url = new URL(window.location.href);
        url.searchParams.set('_t', String(now));
        console.log('[optiott-preview] reload:', reason || 'unknown');
        window.location.replace(url.toString());
      };
      // DOM events dispatched by communicationinjector.js
      var domEvents = [
        'optimizely:cms:contentSaved',
        'contentSaved',
        'epi:contentSaved',
        'optimizely:cms:contentUpdated',
        'contentUpdated',
      ];
      domEvents.forEach(function (name) {
        window.addEventListener(name, function () { setTimeout(function () { reload(name); }, 350); });
      });
      // postMessage events from the CMS parent (Visual Builder edit iframe protocol)
      window.addEventListener('message', function (ev) {
        var d = ev && ev.data;
        if (!d || typeof d !== 'object') return;
        var t = d.type || d.eventName || d.event || '';
        if (typeof t !== 'string') return;
        if (
          t.indexOf('contentSaved') !== -1 ||
          t.indexOf('contentUpdated') !== -1 ||
          t === 'optimizely:cms:contentSaved' ||
          t === 'cms:contentSaved'
        ) {
          setTimeout(function () { reload('postMessage:' + t); }, 350);
        }
      });
    })();
  </script>`

function errorPage(message: string, detail: string): Response {
  const html = `<!DOCTYPE html>
<html><head><title>Preview Error</title><meta charset="utf-8"></head>
<body style="background:#0e0e0e;color:#fff;font-family:Arial,sans-serif;padding:40px;">
  <h1 style="color:#e50914;">Preview Error</h1>
  <p>${escapeHtml(message)}</p>
  <pre style="background:#1a1a1a;padding:16px;border-radius:6px;overflow:auto;font-size:12px;">${escapeHtml(detail)}</pre>
</body></html>`
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy':
        "frame-ancestors 'self' https://*.cms.optimizely.com https://*.optimizely.com",
    },
  })
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const rawKey = params.get('key') ?? ''
  const key = rawKey.replace(/-/g, '')
  const token = params.get('preview_token') ?? ''

  if (!key) {
    return errorPage('Missing key parameter', 'Expected ?key=<experienceKey>')
  }

  let shell: Shell
  try {
    shell = await loadShell()
  } catch (err) {
    return errorPage('Could not load template shell (public/index.html)', String(err))
  }

  let experience: ExperienceData | null = null
  let diagnostic: FetchExperienceResult['diagnostic'] = { source: 'none', itemsCount: 0 }
  try {
    const result = await fetchExperienceByKey(key, token)
    experience = result.experience
    diagnostic = result.diagnostic
  } catch (err) {
    return errorPage('Content Graph request failed', String(err))
  }

  const top = updateTitle(shell.top, experience)
  const main = renderComposition(experience)
  const badge = renderHeader(experience, key, diagnostic)

  // Assemble: shell top (head + header) + composition + shell bottom (footer + scripts)
  // Inject bridge + badge right before </body> (which lives in shell bottom).
  let bottom = shell.bottom
  const bodyClose = bottom.lastIndexOf('</body>')
  if (bodyClose !== -1) {
    bottom =
      bottom.slice(0, bodyClose) +
      badge +
      CMS_BRIDGE +
      bottom.slice(bodyClose)
  } else {
    bottom += badge + CMS_BRIDGE
  }

  const html = top + main + bottom

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy':
        "frame-ancestors 'self' https://*.cms.optimizely.com https://*.optimizely.com",
    },
  })
}
