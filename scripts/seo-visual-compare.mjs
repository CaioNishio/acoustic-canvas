import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const directory = 'seo-intelligence/07_PERFORMANCE';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [390, 1440]) {
    for (const [label, origin] of [['current', 'https://sonaracusticos.com'], ['candidate', 'http://127.0.0.1:4173']]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await page.goto(origin, { waitUntil: 'domcontentloaded' });
      await page.locator('.ref-home').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        await Promise.all(Array.from(document.images).map(img => img.decode().catch(() => undefined)));
        scrollTo(0, 0);
      });
      await page.evaluate(() => Promise.all(Array.from(document.images).filter(img => img.getBoundingClientRect().top < innerHeight).map(img => img.decode().catch(() => undefined))));
      await page.screenshot({ path: `${directory}/${label}-${width}-hero.png` });
      const catalog = page.locator('.snr-catalog-art');
      await catalog.scrollIntoViewIfNeeded();
      await catalog.locator('img').evaluate(img => img.decode());
      await catalog.screenshot({ path: `${directory}/${label}-${width}-catalog.png` });
      results.push({label,width,geometry:await page.evaluate(()=>Array.from(document.querySelectorAll('.ref-home > section')).map(el=>({class:el.className,height:Math.round(el.getBoundingClientRect().height),width:Math.round(el.getBoundingClientRect().width)})))});
      await page.close();
    }
  }
} finally { await browser.close(); }
await writeFile(`${directory}/visual-geometry.json`, JSON.stringify(results,null,2));
console.log('Production/candidate screenshots and section geometry saved.');
