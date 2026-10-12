/**
 * Builds NexaHub as ONE self-contained HTML file (JS + CSS inlined) so it can be
 * opened without a server — e.g. published as a Claude artifact.
 *
 *   node tools/artifact-preview/build.mjs [output.html]
 *
 * It reuses the real app source; only next/link and next/navigation are swapped
 * for a small in-page router (see ./shims). Not used by the Next.js app itself.
 */
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const out = path.resolve(process.argv[2] ?? path.join(root, "nexahub-preview.html"));
const tmp = mkdtempSync(path.join(tmpdir(), "nexahub-preview-"));

// 1) CSS: compile Tailwind from the app's own globals.css (scans the project's classes).
const cssFile = path.join(tmp, "app.css");
execFileSync(
  path.join(root, "node_modules/.bin/tailwindcss"),
  ["--input", path.join(root, "src/app/globals.css"), "--output", cssFile, "--minify", "--cwd", root],
  { stdio: "inherit", cwd: root },
);

// 2) JS: bundle the app with the router shims.
const result = await build({
  entryPoints: [path.join(here, "entry.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  write: false,
  tsconfig: path.join(root, "tsconfig.json"),
  alias: {
    "next/link": path.join(here, "shims/next-link.tsx"),
    "next/navigation": path.join(here, "shims/next-navigation.ts"),
  },
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_SITE_URL": '"https://nexahub.example"',
  },
  logOverride: { "unsupported-directive": "silent" },
  legalComments: "none",
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync(cssFile, "utf8").replace(/<\/style/gi, "<\\/style");

const html = `<title>NexaHub Preview</title>
<meta name="description" content="Interactive NexaHub frontend prototype with fictional demo data.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<style>
:root { --font-geist-sans: "Geist"; --font-geist-mono: "Geist Mono"; }
html, body { min-height: 100%; }
/* Dark is the default theme: avoid a white flash before the app loads. */
body { background: #0b1120; }
html.light body { background: #f8fafc; }
</style>
<style>${css}</style>
<div id="nexahub-root"></div>
<script>${js}</script>
`;

writeFileSync(out, html);
console.log(`Wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
