import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
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

const auditDir = path.resolve("docs/visual/baseline/2026-08-03");

test.beforeAll(async () => {
  await mkdir(auditDir, { recursive: true });
});

for (const viewport of viewports) {
  for (const surface of surfaces) {
    test(`${surface.name} — ${viewport.name}`, async ({ page }) => {
      const browserErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") browserErrors.push(message.text());
      });
      page.on("pageerror", (error) => browserErrors.push(error.message));

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(surface.route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      await page.screenshot({
        path: path.join(auditDir, `${surface.name}-${viewport.name}.png`),
        fullPage: true,
        animations: "disabled",
      });

      await test.info().attach("diagnostico", {
        body: JSON.stringify({ surface, viewport, overflow, browserErrors }, null, 2),
        contentType: "application/json",
      });

      expect(overflow.scrollWidth, "a página não deve criar scroll horizontal").toBeLessThanOrEqual(
        overflow.clientWidth + 1,
      );
      expect(browserErrors, "a página não deve gerar erros de console").toEqual([]);
    });
  }
}
