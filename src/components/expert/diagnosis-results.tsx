'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

interface Treatment {
  id: string
  title: string
  description: string
  type: string
}

interface DiagnosisResult {
  diseaseId: string
  disease: {
    id: string
    code: string
    name: string
    latin_name: string | null
    description: string | null
    cause: string | null
    impact: string | null
    treatments?: Treatment[]
  }
  confidence: number
  confidencePercentage: number
  confidenceLevel: string
  matchingSymptoms: Array<{
    symptomId: string
    symptomName: string
    cfUser: number
    cfExpert: number
    symptomCF: number
  }>
}

interface DiagnosisResultsProps {
  results: DiagnosisResult[]
  onReset: () => void
}

const TREATMENT_META: Record<string, { label: string; emoji: string; accent: string; bg: string; border: string; text: string }> = {
  pestisida:      { label: 'Obat & Pestisida',        emoji: '💊', accent: '#dc2626', bg: '#fef2f2',   border: '#fecaca',   text: '#991b1b' },
  pengendalian:   { label: 'Pengendalian',             emoji: '🧪', accent: '#ea580c', bg: '#fff7ed',   border: '#fed7aa',   text: '#9a3412' },
  preventif:      { label: 'Pencegahan',               emoji: '🛡️', accent: '#2563eb', bg: '#eff6ff',   border: '#bfdbfe',   text: '#1d4ed8' },
  varietas_tahan: { label: 'Varietas Tahan',           emoji: '🌾', accent: '#16a34a', bg: '#f0fdf4',   border: '#bbf7d0',   text: '#15803d' },
  kultur_teknis:  { label: 'Teknik Budidaya',          emoji: '🌱', accent: '#0d9488', bg: '#f0fdfa',   border: '#99f6e4',   text: '#0f766e' },
}
const TREATMENT_ORDER = ['pestisida', 'pengendalian', 'preventif', 'varietas_tahan', 'kultur_teknis']

function ConfidenceMeter({ percentage }: { percentage: number }) {
  const getColor = (p: number) => {
    if (p >= 85) return { bar: '#16a34a', label: 'Sangat Tinggi', bg: '#f0fdf4', text: '#15803d' }
    if (p >= 70) return { bar: '#2563eb', label: 'Tinggi', bg: '#eff6ff', text: '#1d4ed8' }
    if (p >= 50) return { bar: '#d97706', label: 'Sedang', bg: '#fffbeb', text: '#92400e' }
    return { bar: '#dc2626', label: 'Rendah', bg: '#fef2f2', text: '#991b1b' }
  }
  const color = getColor(percentage)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Tingkat Keyakinan Diagnosa</span>
        <span className="text-2xl font-black" style={{ color: color.bar }}>{percentage}%</span>
      </div>
      <div className="relative h-3 w-full rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${color.bar}cc, ${color.bar})` }}
        />
      </div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: color.bg, color: color.text }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color.bar }} />
        {color.label}
      </div>
    </div>
  )
}

export default function DiagnosisResults({ results, onReset }: DiagnosisResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto p-4">
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center bg-white">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Tidak Ada Hasil Ditemukan</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Gejala yang dipilih tidak cocok dengan penyakit mana pun dalam database kami.
            Coba pilih lebih banyak gejala atau gejala yang berbeda.
          </p>
          <button
            onClick={onReset}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            🔄 Coba Diagnosa Ulang
          </button>
        </div>
      </div>
    )
  }

  const main = results[0]
  const treatments = main.disease.treatments ?? []
  const grouped: Record<string, Treatment[]> = {}
  for (const t of treatments) {
    if (!grouped[t.type]) grouped[t.type] = []
    grouped[t.type].push(t)
  }
  const sortedTypes = [
    ...TREATMENT_ORDER.filter(k => grouped[k]),
    ...Object.keys(grouped).filter(k => !TREATMENT_ORDER.includes(k)),
  ]

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-8 space-y-5">

      {/* ── Judul Hasil ── */}
      <div className="pt-4 pb-1">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          ✅ Diagnosa Selesai
        </div>
        <h2 className="text-2xl font-black text-gray-900">Hasil Diagnosa Penyakit Padi</h2>
        <p className="text-gray-500 text-sm mt-1">Berdasarkan {main.matchingSymptoms.length} gejala yang Anda laporkan</p>
      </div>

      {/* ── Kartu Penyakit Utama ── */}
      <div className="rounded-2xl border border-green-200 bg-white shadow-sm overflow-hidden">
        {/* Header hijau */}
        <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-1">Penyakit Terdeteksi</p>
              <h3 className="text-white text-xl font-black leading-tight">{main.disease.name}</h3>
              {main.disease.latin_name && (
                <p className="text-green-200 text-sm italic mt-0.5">{main.disease.latin_name}</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
              🌿
            </div>
          </div>
        </div>

        {/* Confidence meter */}
        <div className="px-5 py-4 border-b border-gray-100">
          <ConfidenceMeter percentage={main.confidencePercentage} />
        </div>

        {/* Info penyakit */}
        <div className="px-5 py-4 space-y-4">
          {main.disease.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm" style={{ background: '#f0fdf4' }}>📋</div>
                <h4 className="font-bold text-gray-800 text-sm">Apa itu {main.disease.name}?</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-8">{main.disease.description}</p>
            </div>
          )}

          {main.disease.cause && (
            <div className="rounded-xl p-3" style={{ background: '#fff7ed' }}>
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">🦠</span>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: '#9a3412' }}>Penyebabnya Apa?</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#7c2d12' }}>{main.disease.cause}</p>
                </div>
              </div>
            </div>
          )}

          {main.disease.impact && (
            <div className="rounded-xl p-3" style={{ background: '#fef2f2' }}>
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">⚠️</span>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: '#991b1b' }}>Apa Dampaknya?</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#7f1d1d' }}>{main.disease.impact}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gejala yang cocok */}
        <div className="px-5 pb-5">
          <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-green-100 text-green-700 text-xs flex items-center justify-center font-black">{main.matchingSymptoms.length}</span>
            Gejala yang Cocok dengan Penyakit Ini
          </h4>
          <div className="space-y-2">
            {main.matchingSymptoms.map(s => (
              <div key={s.symptomId} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: '#f0fdf4' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#16a34a' }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-sm text-gray-800 font-medium flex-1">{s.symptomName}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#15803d' }}>
                  {(s.symptomCF * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Rekomendasi Penanganan ── */}
      {sortedTypes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-black text-gray-900 text-lg">💡 Cara Menangani Penyakit Ini</h3>
          {sortedTypes.map(type => {
            const meta = TREATMENT_META[type] ?? { label: type, emoji: '💡', accent: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', text: '#374151' }
            return (
              <div key={type} className="rounded-2xl overflow-hidden border" style={{ borderColor: meta.border }}>
                {/* Header kategori */}
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: meta.bg }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: 'white', boxShadow: `0 1px 3px ${meta.accent}22` }}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm" style={{ color: meta.text }}>{meta.label}</h4>
                    {type === 'pestisida' && (
                      <p className="text-xs mt-0.5" style={{ color: '#dc2626' }}>⚠️ Ikuti dosis anjuran. Pakai sarung tangan & masker!</p>
                    )}
                  </div>
                </div>
                {/* Isi */}
                <div className="bg-white px-4 py-3 space-y-2">
                  {grouped[type].map((t, i) => (
                    <div key={t.id ?? i} className="rounded-xl p-3 border" style={{ borderColor: meta.border, background: meta.bg + '55' }}>
                      <p className="font-semibold text-sm text-gray-900 mb-1">{t.title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Kemungkinan Lain ── */}
      {results.length > 1 && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              🔎 Kemungkinan Penyakit Lain yang Mirip
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">Penyakit berikut juga memiliki gejala serupa dengan yang Anda pilih</p>
          </div>
          <div className="divide-y divide-gray-100">
            {results.slice(1).map(r => (
              <div key={r.diseaseId} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{r.disease.name}</p>
                  {r.disease.latin_name && <p className="text-xs text-gray-400 italic">{r.disease.latin_name}</p>}
                </div>
                <div className="text-right">
                  <p className="font-black text-sm" style={{ color: r.confidencePercentage >= 70 ? '#2563eb' : '#d97706' }}>{r.confidencePercentage}%</p>
                  <p className="text-xs text-gray-400">{r.confidenceLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tombol Aksi ── */}
      <div className="grid grid-cols-1 gap-3 pt-1">
        <Link href={`/diseases/${main.diseaseId}`} className="w-full">
          <button className="w-full py-3 px-5 rounded-xl border-2 border-green-500 text-green-700 font-semibold text-sm hover:bg-green-50 transition-all flex items-center justify-center gap-2">
            📖 Lihat Detail Lengkap Penyakit
          </button>
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/diseases" className="w-full">
            <button className="w-full py-3 px-5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
              📚 Ensiklopedi
            </button>
          </Link>
          <button
            onClick={onReset}
            className="w-full py-3 px-5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-1"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            🔄 Diagnosa Ulang
          </button>
        </div>
      </div>

    </div>
  )
}
