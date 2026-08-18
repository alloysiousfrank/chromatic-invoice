# Chromatic Point — Invoice Generator

A standalone invoice / job-card generator for Chromatic Point Music
Instruments Service Center. Runs entirely in the browser — no backend,
no database. Generates a branded PDF invoice, keeps a local record of
every invoice generated, and exports those records to Excel on demand.

**Live app:** https://alloysiousfrank.github.io/chromatic-invoice/

## Features
- Password-gated admin form (see `src/config/authConfig.ts`)
- Brand-aware product fields (Yamaha / Casio / Roland / Korg / Other)
- On-page invoice preview + one-click PDF download (logo, tables,
  condition/diagnosis, UPI QR code, signature lines)
- Every generated invoice is saved locally and can be exported as a
  single `.xlsx` workbook — acts as a running record book without a
  database
- Mobile responsive

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
Outputs static files to `dist/`.

## Configuration
- `src/config/authConfig.ts` — change `ADMIN_PASSWORD` before deploying.
- `src/config/paymentConfig.ts` — set the real UPI ID once available;
  the QR code and PDF will pick it up automatically.

## Deployment
Currently deployed via GitHub Pages from the `gh-pages` branch. Any
static host (Vercel, Netlify, GitHub Pages) works since this is a
pure static build with no server component.
