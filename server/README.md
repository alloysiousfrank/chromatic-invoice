# Chromatic Invoice — Backend

Small Express + MongoDB API so every device sees the same invoice list.

## 1. Create a free MongoDB Atlas cluster
1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (free).
2. Create a free **M0 cluster** (any region close to you).
3. Under **Database Access**, add a database user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) — fine for this scale.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
   Add a database name before the `?`, e.g. `.../chromatic-invoice?retryWrites=...`

## 2. Deploy this folder to Render
1. Go to https://render.com and sign up (free).
2. **New → Web Service** → connect the `chromatic-invoice` GitHub repo.
3. Set **Root Directory** to `server`.
4. Build command: `npm install`. Start command: `npm start`.
5. Add environment variables (Render dashboard → Environment):
   - `MONGODB_URI` — the connection string from step 1
   - `ADMIN_API_KEY` — must match `ADMIN_PASSWORD` in the frontend's `src/config/authConfig.ts`
   - `ALLOWED_ORIGIN` — your Vercel frontend URL, e.g. `https://chromatic-invoice.vercel.app`
6. Deploy. Render gives you a URL like `https://chromatic-invoice-api.onrender.com`.

## 3. Point the frontend at it
In Vercel → Project Settings → Environment Variables, add:
- `VITE_API_URL` = your Render URL from step 2 (no trailing slash)

Redeploy the frontend after adding it.

## Notes
- Free Render web services sleep after inactivity — the first request after
  idle can take ~30-50 seconds to wake up. Fine for a small shop's usage
  pattern; upgrade to a paid instance later if that delay becomes annoying.
- Invoice numbers (`CP-0001`, ...) are assigned by the server, atomically,
  so two devices generating invoices at the same moment never collide.
