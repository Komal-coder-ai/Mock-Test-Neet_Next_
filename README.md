# Mock Test NEET JEE — Next.js Starter

Minimal Next.js + TypeScript starter with TailwindCSS and Mongoose.

Quick start (PowerShell):

```powershell
cd c:/Mock_test_Next
npm install
npm run dev
```

- Open `http://localhost:3000` and use the register form.
- API: `POST /api/register` expects JSON `{ name, phone }`.

Notes:
- Environment variables are stored in `.env.local` (do not commit secrets).
- Change `MONGODB_URI` to your cluster string for production.
