# AgriExpert - Sistem Pakar Diagnosa Penyakit Tanaman Padi

## Deskripsi Proyek

AgriExpert adalah sebuah sistem pakar berbasis web untuk diagnosis penyakit tanaman padi menggunakan metode **Forward Chaining** dan **Certainty Factor**. Aplikasi ini membantu petani dan ahli pertanian dalam mengidentifikasi penyakit padi berdasarkan gejala yang diamati.

## Fitur Utama

✅ **Sistem Pakar Forward Chaining** - Inferensi berbasis aturan dari database  
✅ **Certainty Factor (CF)** - Perhitungan tingkat kepercayaan menggunakan rumus CF = CFold + CFnew × (1 - CFold)  
✅ **Knowledge Base Dinamis** - Semua data disimpan di database, dapat diperluas tanpa mengubah kode  
✅ **Wizard Diagnosa 4 Langkah** - UX yang user-friendly untuk diagnosis penyakit  
✅ **Dashboard Admin** - CRUD untuk mengelola penyakit, gejala, aturan, dan solusi  
✅ **History Diagnosis** - Simpan hasil diagnosis untuk riwayat  
✅ **Enklopedia Penyakit** - Informasi lengkap tentang setiap penyakit  
✅ **Import Data** - Impor knowledge base dari Excel/CSV/JSON

## Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS, shadcn/ui
- **Backend:** Next.js API Routes, TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Deployment:** Vercel + PostgreSQL

## Struktur Database

### Models

```
Plant
├── id (CUID)
├── name (Padi)
├── scientific_name
└── diseases[]

Disease
├── id
├── plant_id
├── code (unique)
├── name
├── latin_name
├── description
├── cause
├── impact
├── reference_source
├── reference_document
├── disease_symptoms[]
├── treatments[]
└── diagnosis_history[]

Symptom
├── id
├── code (unique)
├── name
├── description
├── plant_part (daun, batang, akar, malai, gabah)
├── phase (vegetatif, generatif, semua)
└── disease_symptoms[]

DiseaseSymptom (Knowledge Base / Rules)
├── id
├── disease_id
├── symptom_id
├── cf_expert (0.0 - 1.0)
└── unique(disease_id, symptom_id)

Treatment
├── id
├── disease_id
├── title
├── description
└── type (preventif, pengendalian, varietas_tahan, kultur_teknis)

DiagnosisHistory
├── id
├── user_id (nullable)
├── disease_id
├── cf_result (0.0 - 1.0)
└── created_at
```

## Certainty Factor Engine

### Rumus Perhitungan

1. **Certainty Factor Gejala:**

   ```
   CF_Symptom = CF_User × CF_Expert
   ```

2. **Kombinasi CF (Mycin Formula):**

   ```
   CF_combined = CF_old + CF_new × (1 - CF_old)
   ```

3. **Final CF untuk Penyakit:**
   ```
   Iterasi untuk setiap gejala yang cocok:
   CF_disease = CF_disease + CF_symptom × (1 - CF_disease)
   ```

### Contoh Perhitungan

Penyakit: Hawar Daun Bakteri

- Symptom 1: Bercak memanjang → CF_Expert = 0.95
- Symptom 2: Hawar pada bintil jari → CF_Expert = 0.90

User input:

- Symptom 1: CF_User = 0.8 → CF_Symptom = 0.8 × 0.95 = 0.76
- Symptom 2: CF_User = 0.7 → CF_Symptom = 0.7 × 0.90 = 0.63

Kombinasi:

- CF_combined = 0.76 + 0.63 × (1 - 0.76) = 0.76 + 0.63 × 0.24 = 0.76 + 0.1512 = 0.9112 (91.12%)

## API Endpoints

### Diagnosis

- **POST** `/api/diagnose` - Perform diagnosis

  ```json
  {
    "phase": "vegetatif",
    "plant_part": "daun",
    "symptoms": [
      { "symptomId": "sym-001", "cfUser": 0.8 },
      { "symptomId": "sym-002", "cfUser": 0.6 }
    ]
  }
  ```

- **GET** `/api/diagnose?phase=vegetatif&plant_part=daun` - Get symptoms for phase & part

### Diseases

- **GET** `/api/diseases` - Get all diseases
- **GET** `/api/diseases/:id` - Get disease details

### Symptoms

- **GET** `/api/symptoms?phase=vegetatif&plant_part=daun` - Get filtered symptoms

### History

- **GET** `/api/history?user_id=xxx` - Get diagnosis history
- **POST** `/api/history` - Save diagnosis result

## Setup & Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### Installation Steps

1. **Clone repository**

   ```bash
   git clone <repository>
   cd agriexpert
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/agriexpert"
   DIRECT_URL="postgresql://user:password@localhost:5432/agriexpert"
   ```

4. **Setup Prisma**

   ```bash
   npm run prisma:generate
   npm run db:push
   ```

5. **Seed database**

   ```bash
   npm run db:seed
   ```

6. **Run development server**

   ```bash
   npm run dev
   ```

   Buka http://localhost:3000

## User Flow

### Diagnosa Penyakit (User)

```
Home Page
    ↓
[Mulai Diagnosa]
    ↓
Step 1: Pilih Fase Tanaman
  - Vegetatif / Generatif
    ↓
Step 2: Pilih Bagian Tanaman
  - Daun / Batang / Akar / Malai / Gabah
    ↓
Step 3: Pilih Gejala & CF
  - Checkbox untuk setiap gejala
  - RadioGroup untuk tingkat keyakinan (0.2 - 1.0)
    ↓
[Diagnosa]
    ↓
Step 4: Hasil Diagnosis
  - Penyakit utama dengan CF tertinggi
  - Alternatif penyakit
  - Detail penyakit
  - Solusi & Pencegahan
    ↓
[Lihat Detail Lengkap] / [Diagnosa Ulang]
```

### Admin Panel

```
Admin Dashboard
  ├── Penyakit
  │   ├── CRUD Penyakit
  │   ├── Edit Gejala Terkait
  │   └── Edit Solusi
  ├── Gejala
  │   ├── CRUD Gejala
  │   └── Kelola Plant Part & Phase
  ├── Aturan (Disease-Symptom)
  │   ├── CRUD Aturan
  │   └── Edit CF Expert
  ├── Solusi
  │   ├── CRUD Solusi
  │   └── Kelola Tipe Solusi
  └── Import Knowledge Base
      ├── Upload Excel
      ├── Upload CSV
      └── Upload JSON
```

## Knowledge Base

### Data yang Diimport

Dari 4 PDF dokumen, ekstrak:

1. **7 Penyakit (Diseases)**
   - Hawar Daun Bakteri
   - Blas
   - Busuk Batang
   - Tungro
   - Layu Bibit
   - Kerdil Rumput
   - Hawar Daun Cokelat

2. **10 Gejala (Symptoms)**
   - Bercak memanjang kuning keabu-abuan
   - Daun menggulung
   - Daun menguning
   - Bercak bulat cokelat
   - Batang busuk dan patah
   - Malai tidak berkembang
   - Bibit layu di persemaian
   - Tanaman kerdil
   - Gabah berisi kosong
   - Hawar pada bintil jari

3. **12 Disease-Symptom Relations (Rules)**
   - Setiap relasi memiliki CF Expert (0.7 - 0.95)

4. **17 Treatments (Solusi)**
   - Terbagi dalam 4 tipe:
     - Preventif
     - Pengendalian
     - Varietas Tahan
     - Kultur Teknis

## File Penting

```
agriexpert/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── diagnose/
│   │   │   ├── diseases/
│   │   │   ├── symptoms/
│   │   │   └── history/
│   │   ├── (user)/
│   │   │   ├── diagnose/
│   │   │   ├── diseases/
│   │   │   └── history/
│   │   └── (admin)/
│   │       ├── admin/
│   │       │   ├── dashboard/
│   │       │   ├── diseases/
│   │       │   ├── symptoms/
│   │       │   └── import/
│   │       └── page.tsx
│   ├── components/
│   │   ├── expert/
│   │   │   ├── diagnosis-wizard.tsx
│   │   │   └── diagnosis-results.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── radio-group.tsx
│   │       ├── label.tsx
│   │       ├── badge.tsx
│   │       └── progress.tsx
│   └── lib/
│       ├── certainty-factor.ts
│       ├── hooks.ts
│       ├── prisma.ts
│       └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── knowledge_base.json
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Testing

### Test Diagnosis dengan Contoh Data

```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "phase": "vegetatif",
    "plant_part": "daun",
    "symptoms": [
      {
        "symptomId": "sym-001",
        "cfUser": 0.8
      },
      {
        "symptomId": "sym-010",
        "cfUser": 0.7
      }
    ]
  }'
```

## Deployment ke Vercel

1. **Push ke GitHub**

   ```bash
   git push origin main
   ```

2. **Connect ke Vercel**
   - Buka https://vercel.com
   - Import repository
   - Setup environment variables

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

## Troubleshooting

### Database Connection Error

```bash
# Check .env.local
# DATABASE_URL harus sesuai dengan PostgreSQL Anda
npm run db:push
```

### Seed Gagal

```bash
# Hapus data lama
npm run prisma:migrate reset

# Seed ulang
npm run db:seed
```

### Symptoms tidak muncul

```bash
# Verifikasi symptoms ada di database
npm run prisma:studio

# Check table: Symptom
```

## Kontribusi

Untuk menambah penyakit atau gejala baru:

1. **Melalui Admin Panel** - Paling mudah dan tidak perlu coding
2. **Melalui Import Excel** - Bulk import data
3. **Update knowledge_base.json** - Manual edit

## Lisensi

MIT License

## Kontak & Support

Untuk pertanyaan atau masalah, hubungi tim development.

---

**Made with ❤️ for Indonesian Agriculture**
