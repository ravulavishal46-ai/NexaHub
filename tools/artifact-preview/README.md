# Single-file preview build

Packs the NexaHub frontend into **one self-contained HTML file** (all JavaScript and CSS
inlined) so it can be opened without a server — for example as a Claude artifact.

```bash
npm run preview:single            # writes ./nexahub-preview.html
```

How it works:
- Reuses the real app source in `src/` — nothing is duplicated.
- Swaps `next/link` and `next/navigation` for a tiny in-page router (`shims/`).
- Compiles Tailwind from `src/app/globals.css` and inlines it.

Limits compared with the real Next.js app: no server rendering or SEO metadata, and
the Activity Logs "Export CSV" download is blocked inside the Claude viewer.
This tool is not used by the Next.js build or by Vercel.
