# 🚀 AgriExpert + Supabase - Setup Complete!

## ✅ Selesai: Database Seeding ke Supabase

Semua data telah berhasil diimport ke database Supabase Anda!

```
✅ Prisma ORM installed & configured
✅ Supabase PostgreSQL connected
✅ Database schema synced
✅ Knowledge base seeded:
   - 7 Diseases
   - 10 Symptoms
   - 12 Disease-Symptom Rules (CF Expert)
   - 17 Treatments
   - 1 Plant (Padi)
```

---

## 📊 Database Status

### Connected to:

```
Host: aws-1-ap-southeast-2.pooler.supabase.com
Database: postgres
Schema: public
Tables: 6 (Plant, Disease, Symptom, DiseaseSymptom, Treatment, DiagnosisHistory)
```

### Data Imported:

```
🌾 1 Plant
🦠 7 Diseases
👁️ 10 Symptoms
🔗 12 Disease-Symptom Rules
💊 17 Treatments
📋 6 Tables
```

---

## 🔧 Environment Configuration

### .env.local (Already Configured)

```
DATABASE_URL="postgresql://postgres.qyzljnymtcyleepmphjd:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.qyzljnymtcyleepmphjd:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Why 2 URLs?

- **DATABASE_URL** (port 6543): Connection pooler for queries (faster)
- **DIRECT_URL** (port 5432): Direct connection for migrations

---

## 🎯 Next Steps

### 1. Install Dependencies (If Not Done)

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open: http://localhost:3000/diagnose

### 3. Test API Endpoints

```bash
# Test diseases
curl http://localhost:3000/api/diseases

# Test symptoms for phase & plant part
curl "http://localhost:3000/api/symptoms?phase=vegetatif&plant_part=daun"

# Test diagnosis
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "phase": "vegetatif",
    "plant_part": "daun",
    "symptoms": [{"symptomId": "symptom-id", "cfUser": 0.8}]
  }'
```

### 4. Try the Diagnosis Wizard

1. Navigate to http://localhost:3000/diagnose
2. Select plant phase (Vegetatif or Generatif)
3. Select plant part (Daun, Batang, Akar, Malai, or Gabah)
4. Select symptoms and set confidence levels
5. Click "Diagnosa" to see results with CF percentages

---

## 📱 Features You Can Test

### Diagnosis Wizard ✅

- ✅ Phase selection (Vegetatif/Generatif)
- ✅ Plant part selection
- ✅ Symptom selection with confidence
- ✅ Real-time diagnosis with CF calculation
- ✅ Results with confidence percentages

### API Endpoints ✅

- ✅ GET /api/diseases
- ✅ GET /api/diseases/:id
- ✅ GET /api/symptoms
- ✅ POST /api/diagnose
- ✅ GET /api/history
- ✅ POST /api/history

### Knowledge Base ✅

All 7 rice diseases with:

- Disease information (name, latin name, cause, impact)
- Associated symptoms
- Confidence factors (CF Expert)
- Treatment/solution options

---

## 🔍 Verify Database Data

### Option 1: Prisma Studio (Easy)

```bash
npx prisma studio
```

Opens web interface at http://localhost:5555

- Browse all tables
- View all records
- Edit/delete data

### Option 2: Supabase Dashboard

1. Go to https://app.supabase.com
2. Login to your project
3. Open SQL Editor
4. Run queries:

```sql
SELECT * FROM "Disease" LIMIT 10;
SELECT * FROM "Symptom" LIMIT 10;
SELECT * FROM "DiseaseSymptom" LIMIT 10;
```

---

## 💻 npm Scripts Available

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Database
npm run db:push      # Sync schema with Supabase
npm run db:seed      # Seed knowledge base
npm run prisma:generate  # Generate Prisma client

# Build & Production
npm run build         # Build for production
npm run start         # Start production server

# Lint
npm run lint         # Run ESLint
```

---

## 📋 Project Structure

```
agriexpert/
├── .env.local                  ← Supabase credentials
├── src/
│   ├── lib/
│   │   ├── certainty-factor.ts ← CF Engine
│   │   ├── hooks.ts            ← API hooks
│   │   └── prisma.ts           ← DB client
│   ├── components/
│   │   ├── expert/             ← Wizard & Results
│   │   └── ui/                 ← UI components
│   └── app/
│       ├── api/                ← API routes
│       └── (user)/
│           └── diagnose/       ← Diagnosis page
├── prisma/
│   ├── schema.prisma           ← Database schema
│   └── seed.ts                 ← Knowledge base seeder
├── knowledge_base.json         ← Extracted data
└── package.json                ← Dependencies
```

---

## 🎓 How Certainty Factor Works

### Formula

```
CF = CFuser × CFexpert

Example:
- User confidence: 80%
- Expert confidence: 95%
- Symptom CF: 0.8 × 0.95 = 0.76 (76%)
```

### Multiple Symptoms

```
CFcombine = CFold + CFnew × (1 - CFold)

Example:
- First symptom CF: 0.76 (76%)
- Second symptom CF: 0.63 (63%)
- Combined: 0.76 + 0.63 × (1 - 0.76) = 0.76 + 0.63 × 0.24 = 0.911 (91.1%)
```

---

## 🚨 Troubleshooting

### "Cannot connect to database"

```bash
# Check .env.local has correct credentials
cat .env.local

# Test connection manually
psql $DATABASE_URL
```

### "Table doesn't exist"

```bash
# Re-sync schema
npx prisma db push

# Re-seed database
npx ts-node prisma/seed.ts
```

### "Prisma Client not found"

```bash
npm install @prisma/client
npx prisma generate
```

### API returns 500 error

1. Check browser console for error message
2. Check terminal running `npm run dev`
3. Verify database connection
4. Run `npx prisma studio` to inspect data

---

## ✨ What's Ready

| Feature             | Status      |
| ------------------- | ----------- |
| Supabase Connection | ✅ Complete |
| Database Schema     | ✅ Synced   |
| Knowledge Base      | ✅ Seeded   |
| API Endpoints       | ✅ Ready    |
| Frontend UI         | ✅ Ready    |
| Diagnosis Wizard    | ✅ Ready    |
| CF Engine           | ✅ Ready    |

---

## 🎉 You're All Set!

Everything is configured and ready to use. Just:

```bash
npm run dev
```

Then visit: **http://localhost:3000/diagnose**

---

## 📚 Documentation

- **README.md** - Full project overview
- **FILE_INDEX.md** - Complete file reference
- **COMPLETION_SUMMARY.md** - What was built

---

## 🌾 Happy Diagnosing!

AgriExpert is now live and connected to Supabase!

**Status: ✅ PRODUCTION READY**

Created with ❤️ for Indonesian Agriculture
