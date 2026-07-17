# ⚡ AgriExpert - Quick Start Guide

## ✅ Sudah Selesai

### 1. Knowledge Base Extraction ✓

- Ekstrak data dari 4 PDF dokumen
- **7 Penyakit** dengan deskripsi lengkap
- **10 Gejala** dengan plant part dan phase
- **17 Solusi/Pengendalian**
- **12 Relasi Disease-Symptom** dengan CF Expert
- File: `knowledge_base.json`

### 2. Database Schema ✓

- Prisma schema sudah siap di `prisma/schema.prisma`
- Models: Plant, Disease, Symptom, DiseaseSymptom, Treatment, DiagnosisHistory
- Seeder script di `prisma/seed.ts`

### 3. Certainty Factor Engine ✓

- File: `src/lib/certainty-factor.ts`
- Implementasi rumus: CFcombine = CFold + CFnew × (1 - CFold)
- Helper functions untuk perhitungan CF

### 4. API Endpoints ✓

- POST `/api/diagnose` - Diagnosa penyakit
- GET `/api/diagnose?phase=X&plant_part=Y` - Get symptoms
- GET `/api/diseases` - Daftar penyakit
- GET `/api/diseases/:id` - Detail penyakit
- GET `/api/symptoms` - Daftar gejala
- GET `/api/history` - Riwayat diagnosa
- POST `/api/history` - Simpan hasil diagnosa

### 5. Frontend Components ✓

- Diagnosis Wizard (4 steps)
- Diagnosis Results
- UI Components (Checkbox, RadioGroup, Label, Badge, Progress)

### 6. Dependencies ✓

- Updated package.json dengan semua dependencies
- Radix UI components untuk form inputs

### 7. Documentation ✓

- README.md lengkap
- API documentation
- Database schema documentation

---

## 🚀 Next Steps (Yang Harus Dilakukan)

### Step 1: Setup Database & Environment

```bash
# 1. Create PostgreSQL database
createdb agriexpert

# 2. Create .env.local file di root project
# Edit dengan koneksi PostgreSQL Anda:
# DATABASE_URL="postgresql://user:password@localhost:5432/agriexpert"
# DIRECT_URL="postgresql://user:password@localhost:5432/agriexpert"

# 3. Install dependencies
npm install

# 4. Generate Prisma client
npm run prisma:generate

# 5. Push schema ke database
npm run db:push

# 6. Seed knowledge base
npm run db:seed
```

### Step 2: Verify Installation

```bash
# Test API locally
npm run dev

# Buka http://localhost:3000
# Coba: http://localhost:3000/api/diseases
```

### Step 3: Implementasi Halaman Tambahan

```
MASIH HARUS BUAT:

1. Halaman Daftar Penyakit (/diseases)
   - Tampilkan semua penyakit
   - Detail penyakit dengan treatment
   - Search & filter

2. Halaman Riwayat Diagnosis (/history)
   - Tampilkan history diagnosis user
   - Filter by date

3. Admin Dashboard (/admin)
   - CRUD Penyakit
   - CRUD Gejala
   - CRUD Aturan (Disease-Symptom)
   - Import Knowledge Base

4. Layout & Navigation
   - Header dengan menu
   - Footer
   - Responsive design

5. Authentication (Optional)
   - Login/Register
   - User profile
```

### Step 4: Deploy ke Vercel

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit: AgriExpert system"
git push origin main

# 2. Di Vercel:
# - Connect GitHub repo
# - Setup environment variables
# - Deploy

# Production URL akan diberikan Vercel
```

---

## 📋 Checklist Sebelum Submit

- [ ] Database PostgreSQL sudah running
- [ ] `.env.local` sudah dibuat dengan DATABASE_URL yang benar
- [ ] `npm install` sudah dijalankan
- [ ] `npm run db:seed` berhasil (tAPI melihat output dengan 7 diseases, 10 symptoms, dll)
- [ ] `npm run dev` bisa dijalankan tanpa error
- [ ] Bisa akses http://localhost:3000/api/diagnose (GET)
- [ ] Halaman diagnosis di http://localhost:3000/diagnose atau http://localhost:3000/(user)/diagnose
- [ ] Bisa melakukan diagnosa dan melihat hasil

---

## 📚 File Penting yang Sudah Dibuat

```
✅ src/lib/certainty-factor.ts         - CF engine
✅ src/lib/hooks.ts                    - API hooks untuk React
✅ src/components/expert/              - Wizard & Results components
✅ src/app/api/diagnose/               - Diagnosis API
✅ src/app/api/diseases/               - Diseases API
✅ src/app/api/symptoms/               - Symptoms API
✅ src/app/api/history/                - History API
✅ prisma/seed.ts                      - Database seeder
✅ prisma/schema.prisma                - Database schema
✅ knowledge_base.json                 - Knowledge base data
✅ package.json                        - Updated dengan dependencies
✅ README.md                           - Documentation
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module @prisma/client"

```bash
npm install
npm run prisma:generate
```

### Error: "ENOENT: no such file or directory, open 'knowledge_base.json'"

- File sudah ada di root project
- Verify path di prisma/seed.ts adalah correct

### Error: "Connection error to database"

```bash
# Check .env.local
# Pastikan DATABASE_URL dan DIRECT_URL sesuai
# Test connection:
psql $DATABASE_URL
```

### Symptoms tidak muncul di wizard

```bash
# Check database
npm run prisma:studio

# Verify:
# - Symptom table ada data
# - DiseaseSymptom table ada relasi
# - Disease terhubung ke Plant "Padi"
```

---

## 📞 Support

Jika ada kendala:

1. Check README.md untuk detailed documentation
2. Check console error messages
3. Cek prisma schema di `prisma/schema.prisma`
4. Jalankan `npm run prisma:studio` untuk inspect database

---

## ✨ Features Ready

✅ Certainty Factor calculation  
✅ Forward chaining inference  
✅ Knowledge base seeding  
✅ API endpoints untuk diagnosis  
✅ React components untuk wizard  
✅ Database models dengan Prisma

## 🎯 Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 15 App Router           │
├─────────────────────────────────────────┤
│  Frontend (User & Admin Interfaces)     │
│  - Diagnosis Wizard                     │
│  - Disease Encyclopedia                 │
│  - Admin Dashboard                      │
├─────────────────────────────────────────┤
│  API Routes (Backend Logic)             │
│  - POST /api/diagnose                   │
│  - GET /api/diseases                    │
│  - GET /api/symptoms                    │
│  - GET /api/history                     │
├─────────────────────────────────────────┤
│  Certainty Factor Engine                │
│  - CF calculation & combination         │
│  - Forward chaining inference           │
├─────────────────────────────────────────┤
│  Prisma ORM                             │
│  - Database abstraction                 │
│  - Type-safe queries                    │
├─────────────────────────────────────────┤
│  PostgreSQL Database                    │
│  - Knowledge base (7 diseases, 10 symptoms)
│  - Diagnosis history                    │
│  - User data (future)                   │
└─────────────────────────────────────────┘
```

---

Good luck! 🌾 AgriExpert is ready to diagnose rice diseases!
