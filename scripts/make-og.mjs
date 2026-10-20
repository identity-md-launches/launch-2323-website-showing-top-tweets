// Renders public/og.png (1200x630 share card) from public/pepe-armed.svg with Playwright.
// Usage: IMD_PLAYWRIGHT=/path/to/playwright/index.mjs node scripts/make-og.mjs
// (or plain `node scripts/make-og.mjs` when `playwright` can be imported).
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { chromium } = process.env.IMD_PLAYWRIGHT
  ? await import(pathToFileURL(process.env.IMD_PLAYWRIGHT).href)
  : await import("playwright");

const art = await readFile(join(root, "public", "pepe-armed.svg"), "utf8");
const html = `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;display:flex;align-items:center;gap:56px;padding:0 80px;box-sizing:border-box;
  background:#06130c;color:#e3f2e6;font-family:system-ui,sans-serif">
  <div style="flex:1">
    <div style="font-size:36px;font-weight:700;color:#8be36a">Pepe Wire</div>
    <div style="font-size:76px;font-weight:700;line-height:1.05;letter-spacing:-0.02em;margin-top:20px">Top posts about IdentityMD</div>
    <div style="font-size:30px;color:#a3c7ac;margin-top:24px">The most liked and viewed X posts about the IMD agent network.</div>
  </div>
  <div style="width:420px;flex:none">${art.replace("<svg ", '<svg width="420" ')}</div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: join(root, "public", "og.png") });
await browser.close();
console.log("Wrote public/og.png");
