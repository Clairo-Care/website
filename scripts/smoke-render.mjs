#!/usr/bin/env node
// Render smoke test: load the BUILT site in a real browser and fail on script errors or a blank page.
// Same idea as clairo-web/scripts/smoke-render.mjs (added after the 2026-09-24 staff app white screen).
//
// Usage:
//   npm run build && node scripts/smoke-render.mjs          # serves dist/ with `astro preview`
//   node scripts/smoke-render.mjs https://www.clairo.care   # checks the live site
//
// Needs Chromium once per machine: `npx playwright install chromium`
// (CI: `npx playwright install --with-deps chromium`).
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { chromium } from 'playwright';
const TIMEOUT_MS = 20_000;
const PATHS = ['/', '/contact'];

// `astro preview` silently moves to the next port when one is taken, which would point this check
// at some other local server. Ask the OS for a free port instead.
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer().once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServer(url, ms) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`preview server did not answer at ${url} within ${ms}ms`);
}

let preview = null;
let base = process.argv[2];
if (!base) {
  const port = Number(process.env.SMOKE_PORT) || (await freePort());
  base = `http://localhost:${port}`;
  preview = spawn('npx', ['astro', 'preview', '--port', String(port)], {
    stdio: ['ignore', 'inherit', 'inherit'],
    detached: process.platform !== 'win32',
  });
}
base = base.replace(/\/$/, '');

function stopPreview() {
  if (!preview || preview.exitCode !== null) return;
  try { process.kill(-preview.pid, 'SIGTERM'); } catch { preview.kill('SIGTERM'); }
}

let failed = false;
let browser;
try {
  if (preview) await waitForServer(`${base}/`, 30_000);
  browser = await chromium.launch();

  for (const path of PATHS) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`${e.message}\n${(e.stack || '').split('\n').slice(0, 6).join('\n')}`));
    if (preview) {
      // Hermetic: no analytics, tag manager or API calls from CI. Only our own origin loads.
      const origin = new URL(base).origin;
      await page.route('**/*', (route) =>
        new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    }

    let problem = null;
    try {
      const res = await page.goto(`${base}${path}`, { waitUntil: 'load', timeout: TIMEOUT_MS });
      if (!res || !res.ok()) problem = `HTTP ${res?.status() ?? 'no response'}`;
      await page
        .waitForFunction(() => (document.querySelector('h1')?.innerText.trim().length ?? 0) > 0, null, { timeout: TIMEOUT_MS })
        .catch(() => { problem = problem || 'no visible h1 (blank page)'; });
      await page.waitForTimeout(500);
    } catch (e) {
      problem = `navigation failed: ${e.message}`;
    }
    if (errors.length) problem = [problem, `${errors.length} page error(s)`].filter(Boolean).join('; ');

    const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText.trim().slice(0, 60) ?? '').catch(() => '');
    if (problem) {
      failed = true;
      console.log(`FAIL ${path}: ${problem}`);
      for (const e of errors) console.log(`  PAGEERROR: ${e}`);
    } else {
      console.log(`ok   ${path} (h1: ${JSON.stringify(h1)})`);
    }
    await page.close();
  }
} catch (e) {
  failed = true;
  console.log(`FAIL smoke harness: ${e.message}`);
} finally {
  await browser?.close();
  stopPreview();
}

process.exit(failed ? 1 : 0);
