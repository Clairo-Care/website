// @ts-check
import { defineConfig } from 'astro/config';

// Static marketing site. No adapter: `vercel.json` sets `"framework": "astro"` and Vercel
// serves `dist/` as static files.
//
// build.format 'file' emits /about.html (not /about/index.html) so that the relative asset
// URLs carried over from the old export (e.g. src="assets/logo-lockup-navy.png") keep
// resolving to /assets/..., exactly as they do today. `"cleanUrls": true` in vercel.json
// serves /about from about.html.
//
// compressHTML MUST stay false: the parity gate compares the rendered DOM against the live
// site, and collapsing/removing whitespace text nodes would change it.
export default defineConfig({
  site: 'https://www.clairo.care',
  output: 'static',
  build: { format: 'file' },
  compressHTML: false,
});
