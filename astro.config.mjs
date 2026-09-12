// @ts-check
import { defineConfig } from 'astro/config';

// Static marketing site. No adapter: `vercel.json` sets `"framework": "astro"` and Vercel
// serves `dist/` as static files.
//
// build.format 'file' emits /about.html (not /about/index.html) so that the relative asset
// URLs carried over from the old export (e.g. src="assets/logo-lockup-navy.png") keep
// resolving to /assets/..., exactly as they do today. The `rewrites` in vercel.json map
// /about to /about.html (the same mechanism production uses today; `cleanUrls` is not an
// option because Vercel puts its own `*.html -> /*` redirect ahead of the legacy
// `*.dc.html` redirects, which would then land on 404s).
//
// compressHTML MUST stay false: the parity gate compares the rendered DOM against the live
// site, and collapsing/removing whitespace text nodes would change it.
export default defineConfig({
  site: 'https://www.clairo.care',
  output: 'static',
  build: { format: 'file' },
  compressHTML: false,
});
