// One-time static snapshot: renders every React route in headless
// Chromium and saves fully-rendered plain .html files (+ assets) into
// the sibling ICETET2027-HTML folder. No npm needed to view them.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = '/Users/unnativishnoi/Downloads/ICETET2027-HTML';
const BASE = process.env.SNAP_BASE || 'http://localhost:4174';

const PAGES = [
  { route: '/', file: 'index.html', title: 'ICETET-2027 | International Conference on Emerging Trends in Engineering and Technology' },
  { route: '/about.html', file: 'about.html', title: 'About ICETET-2027 | Conference, SRMS CET and Departments' },
  { route: '/call-for-papers.html', file: 'call-for-papers.html', title: 'Call for Papers | ICETET-2027' },
  { route: '/important-dates.html', file: 'important-dates.html', title: 'Important Dates | ICETET-2027' },
  { route: '/committee.html', file: 'committee.html', title: 'Committee | ICETET-2027' },
  { route: '/registration.html', file: 'registration.html', title: 'Registration | ICETET-2027' },
  { route: '/contact.html', file: 'contact.html', title: 'Contact ICETET-2027 | Venue, Email and Enquiries' },
];

const { chromium } = await import('@playwright/test');
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

await fs.mkdir(OUT, { recursive: true });

for (const p of PAGES) {
  await page.goto(BASE + p.route, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  // Reveal everything so the static copy shows full content without JS.
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.title = '__TITLE__';
  });
  let html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
  html = html.replace('__TITLE__', p.title);
  // Rewrite SPA hrefs to static file hrefs so nav works without a router.
  html = html
    .replaceAll('href="/call-for-papers"', 'href="call-for-papers.html"')
    .replaceAll('href="/important-dates"', 'href="important-dates.html"')
    .replaceAll('href="/committee"', 'href="committee.html"')
    .replaceAll('href="/registration"', 'href="registration.html"')
    .replaceAll('href="/contact"', 'href="contact.html"')
    .replaceAll('href="/about"', 'href="about.html"')
    .replaceAll('href="/"', 'href="index.html"');
  await fs.writeFile(path.join(OUT, p.file), html);
  console.log('wrote', p.file, html.length, 'bytes');
}
await browser.close();

// Mirror built assets (css, js bundle, images) alongside the html files.
await fs.rm(path.join(OUT, 'assets'), { recursive: true, force: true });
await fs.cp(path.join(PROJECT, 'dist', 'assets'), path.join(OUT, 'assets'), { recursive: true });
await fs.copyFile(path.join(OUT, 'index.html'), path.join(OUT, '404.html'));
console.log('assets mirrored. DONE');
