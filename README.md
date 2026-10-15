# Claims Backend

A NestJS backend for AI-assisted claims evaluation using Gemini and Supabase PostgreSQL.

## Live Deployment

**Base URL:** https://loreal-assignment-backend.onrender.com

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/claims` | Fetch all claims |
| POST | `/claims/assess` | Submit and assess a claim |

## Features
- NestJS API with validation
- Prisma ORM with PostgreSQL
- Claim and assessment persistence
- Gemini-based claim evaluation
- CORS enabled for frontend access

## Local setup

1. Install dependencies:
   npm install

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` and `GEMINI_API_KEY`

3. Push Prisma schema:
   npx prisma db push

4. Run in development mode:
   npm run start:dev

5. Production build:
   npm run build

6. Production start:
   npm run start:prod

## Environment variables

```env
DATABASE_URL="postgresql://postgres:your_password@db.your-project-id.supabase.co:5432/postgres"
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3001
```

## curls
```
  curl --request POST \
  --url https://loreal-assignment-backend.onrender.com/claims/assess \
  --header 'Content-Type: application/json' \
  --data '{
  "productName": "Radiant Glow Serum",
  "claimText": "Reduces wrinkles by 20% in 4 weeks",
  "evidenceText": "A 12-week clinical study on 120 participants reported a 18% improvement in wrinkle depth compared with baseline. The 20% threshold was not reached with statistical significance (p=0.08).",
  "studyType": "Clinical Trial"
}'
```

```
curl --request post \
  --url https://loreal-assignment-backend.onrender.com/claims/assess \
  --header 'Content-Type: application/json' \
  --data '{
  "productName": "HydraLift Pro Moisturizer",
  "claimText": "Improves skin hydration by 30% within 2 hours of application",
  "evidenceText": "A double-blind, placebo-controlled clinical study conducted on 150 participants over 8 weeks. Corneometer measurements recorded a statistically significant 34% increase in stratum corneum hydration at the 2-hour post-application mark (p<0.001). Results were consistent across all skin types.",
  "studyType": "Double-Blind RCT"
}'
```

## Deployment notes
- The backend is deployed on [Render](https://render.com).
- Production environment variables such as `DATABASE_URL`, `GEMINI_API_KEY`, and `PORT` are configured in the Render dashboard, not stored in the repo.
- The app binds to `0.0.0.0` and reads the `PORT` environment variable for hosting compatibility.
- Prisma is generated automatically after install via `postinstall`.
- **Important:** Use the Supabase **Transaction Pooler** URL (port `6543`) for `DATABASE_URL` in cloud deployments — the direct connection (port `5432`) may be unreachable from Render's servers.
  ```
  postgresql://postgres.your-project-id:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require
  ```
