import { test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const surfaces = [
  { name: "homepage", route: "/" },
  { name: "catalogo", route: "/produtos" },
  { name: "conhecimento", route: "/conhecimento" },
] as const;

const viewports = [
  { name: "mobile-360x800", width: 360, height: 800 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1920x1080", width: 1920, height: 1080 },
] as const;

const auditDir = path.resolve("docs/visual/audit/2026-08-03");

test.beforeAll(async () => {
  await mkdir(auditDir, { recursive: true });
});

async function revealPage(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(500, Math.floor((await page.viewportSize()).height * 0.75));
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top: number) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
}

for (const viewport of viewports) {
  for (const surface of surfaces) {
    test(`${surface.name} audit — ${viewport.name}`, async ({ page }) => {
      const browserErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") browserErrors.push(message.text());
      });
      page.on("pageerror", (error) => browserErrors.push(error.message));

      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(surface.route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await revealPage(page);

      const diagnostics = await page.evaluate(() => {
        const root = document.documentElement;
        const overflowing = Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              className: typeof element.className === "string" ? element.className : "",
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            };
          })
          .filter((item) => item.right > root.clientWidth + 1 || item.left < -1)
          .slice(0, 40);

        return {
          scrollWidth: root.scrollWidth,
          clientWidth: root.clientWidth,
          scrollHeight: root.scrollHeight,
          overflowing,
        };
      });

      await page.screenshot({
        path: path.join(auditDir, `${surface.name}-${viewport.name}.png`),
        fullPage: true,
      });
      await writeFile(
        path.join(auditDir, `${surface.name}-${viewport.name}.json`),
        JSON.stringify({ surface, viewport, diagnostics, browserErrors }, null, 2),
      );
    });
  }
}
