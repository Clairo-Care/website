// The sitemap, built by hand because there are eleven pages and they change rarely.
//
// The URLs here are the clean ones the public sees (/about), not the files Astro writes
// (/about.html); vercel.json rewrites one to the other. No lastmod: a wrong date is worse than
// none, and nothing here generates a real one.
//
// Add a page to src/pages and add it here.
import type { APIRoute } from 'astro';

const SITE = 'https://www.clairo.care';

const PAGES = [
  '/',
  '/about',
  '/how-it-works',
  '/traditional-services',
  '/self-directed-services',
  '/waiver-services',
  '/caregivers',
  '/wages-and-benefits',
  '/faq',
  '/contact',
  '/privacy',
];

export const GET: APIRoute = () => {
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    PAGES.map((p) => '  <url><loc>' + SITE + p + '</loc></url>').join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
