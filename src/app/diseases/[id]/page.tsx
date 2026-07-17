'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const TREATMENT_META: Record<string, { label: string; emoji: string; accent: string; bg: string; border: string; text: string }> = {
  pestisida:      { label: 'Obat & Pestisida',   emoji: '💊', accent: '#dc2626', bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
  pengendalian:   { label: 'Pengendalian',        emoji: '🧪', accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa', text: '#9a3412' },
  preventif:      { label: 'Pencegahan',          emoji: '🛡️', accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  varietas_tahan: { label: 'Varietas Tahan',      emoji: '🌾', accent: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  kultur_teknis:  { label: 'Teknik Budidaya',     emoji: '🌱', accent: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
}
const TREATMENT_ORDER = ['pestisida', 'pengendalian', 'preventif', 'varietas_tahan', 'kultur_teknis']

// Map sumber referensi ke URL yang relevan
const REFERENCE_URLS: Record<string, string> = {
  'BBPOPT': 'https://bbpopt.id',
  'IRRI': 'https://www.irri.org',
  'Balai Penelitian Tanaman Padi': 'https://bbpadi.litbang.pertanian.go.id',
  'Balai Besar Penelitian Tanaman Padi': 'https://bbpadi.litbang.pertanian.go.id',
  'Kementan': 'https://www.pertanian.go.id',
  'BBPOPT Jatisari': 'https://bbpopt.id',
  'IRRI & Kementan RI': 'https://www.irri.org',
  'IRRI (International Rice Research Institute)': 'https://www.irri.org',
}

function getReferenceUrl(source: string): string | null {
  for (const [key, url] of Object.entries(REFERENCE_URLS)) {
    if (source.includes(key)) return url
  }
  return null
}

export default function DiseaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [disease, setDisease] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/diseases/${id}`)
      .then(res => { if (!res.ok) throw new Error('Penyakit tidak ditemukan'); return res.json() })
      .then(data => setDisease(data.disease))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Memuat detail penyakit...</p>
      </div>
    </main>
  )

  if (error || !disease) return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-sm w-full">
        <p className="text-5xl mb-4">😔</p>
        <h2 className="text-lg font-black text-gray-800 mb-2">Data Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'Penyakit tidak ditemukan.'}</p>
        <button onClick={() => router.back()} className="w-full py-3 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
          ← Kembali
        </button>
      </div>
    </main>
  )

  const treatments: any[] = disease.treatments ?? []
  const grouped: Record<string, any[]> = {}
  for (const t of treatments) {
    const key = t.type ?? 'lainnya'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(t)
  }
  const sortedTypes = [
    ...TREATMENT_ORDER.filter(k => grouped[k]),
    ...Object.keys(grouped).filter(k => !TREATMENT_ORDER.includes(k)),
  ]

  const refUrl = disease.reference_source ? getReferenceUrl(disease.reference_source) : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors font-medium"
        >
          ← Kembali
        </button>

        {/* Header Penyakit */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-green-200">
          <div className="px-5 py-5" style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }}>
            <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-1">Detail Penyakit Padi</p>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-white text-2xl font-black leading-tight">{disease.name}</h1>
                {disease.latin_name && <p className="text-green-200 italic text-sm mt-0.5">{disease.latin_name}</p>}
                {disease.code && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.15)', color: '#bbf7d0' }}>
                    Kode: {disease.code}
                  </span>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>🌿</div>
            </div>
          </div>

          <div className="bg-white px-5 py-5 space-y-4">
            {disease.description && (
              <div>
                <h3 className="font-black text-sm text-gray-800 mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-gray-100 text-sm flex items-center justify-center">📋</span>
                  Penjelasan
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">{disease.description}</p>
              </div>
            )}

            {disease.cause && (
              <div className="rounded-xl p-3.5" style={{ background: '#fff7ed' }}>
                <h3 className="font-black text-sm mb-1.5 flex items-center gap-1.5" style={{ color: '#9a3412' }}>
                  🦠 Penyebab
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7c2d12' }}>{disease.cause}</p>
              </div>
            )}

            {disease.impact && (
              <div className="rounded-xl p-3.5" style={{ background: '#fef2f2' }}>
                <h3 className="font-black text-sm mb-1.5 flex items-center gap-1.5" style={{ color: '#991b1b' }}>
                  ⚠️ Dampak & Kerugian
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7f1d1d' }}>{disease.impact}</p>
              </div>
            )}
          </div>
        </div>

        {/* Penanganan */}
        {sortedTypes.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-black text-gray-900 text-lg px-1">💡 Cara Penanganan</h2>
            {sortedTypes.map(type => {
              const meta = TREATMENT_META[type] ?? { label: type, emoji: '💡', accent: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', text: '#374151' }
              return (
                <div key={type} className="rounded-2xl overflow-hidden border" style={{ borderColor: meta.border }}>
                  <div className="px-4 py-3 flex items-center gap-3" style={{ background: meta.bg }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: 'white', boxShadow: `0 1px 3px ${meta.accent}22` }}>
                      {meta.emoji}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: meta.text }}>{meta.label}</h4>
                      {type === 'pestisida' && (
                        <p className="text-xs mt-0.5" style={{ color: '#dc2626' }}>⚠️ Ikuti dosis. Pakai sarung tangan & masker!</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-white px-4 py-3 space-y-2">
                    {grouped[type].map((t: any, i: number) => (
                      <div key={t.id ?? i} className="rounded-xl p-3 border" style={{ borderColor: meta.border, background: meta.bg + '55' }}>
                        {t.title && <p className="font-semibold text-sm text-gray-900 mb-1">{t.title}</p>}
                        <p className="text-xs text-gray-600 leading-relaxed">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Gejala yang Dikenali */}
        {disease.disease_symptoms && disease.disease_symptoms.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                🔍 Gejala yang Dikenali Sistem
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#dcfce7', color: '#15803d' }}>{disease.disease_symptoms.length} gejala</span>
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {disease.disease_symptoms.map((ds: any) => (
                <div key={ds.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{ds.symptom?.name}</p>
                      {ds.symptom?.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{ds.symptom.description}</p>
                      )}
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        {ds.symptom?.plant_part && (
                          <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium" style={{ background: '#f0fdf4', color: '#15803d' }}>{ds.symptom.plant_part}</span>
                        )}
                        {ds.symptom?.phase && (
                          <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{ds.symptom.phase}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400 mb-1">CF Pakar</p>
                      <p className="font-black text-lg leading-none" style={{ color: '#16a34a' }}>{(ds.cf_expert * 100).toFixed(0)}%</p>
                      <div className="w-16 h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: '#e5e7eb' }}>
                        <div className="h-full rounded-full" style={{ width: `${ds.cf_expert * 100}%`, background: '#16a34a' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referensi — dengan link yang bisa diklik */}
        {(disease.reference_source || disease.reference_document) && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-blue-50">
              <h3 className="font-black text-blue-900 text-sm">📚 Sumber Referensi</h3>
              <p className="text-xs text-blue-600 mt-0.5">Informasi berdasarkan penelitian dan publikasi ilmiah terpercaya</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {disease.reference_source && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: '#eff6ff' }}>🏛️</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Lembaga / Institusi</p>
                    {refUrl ? (
                      <a
                        href={refUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold hover:underline flex items-center gap-1 group"
                        style={{ color: '#2563eb' }}
                      >
                        {disease.reference_source}
                        <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                          <path d="M5.5 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8.5M8 2h4m0 0v4m0-4L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    ) : (
                      <p className="text-sm text-gray-800 font-semibold">{disease.reference_source}</p>
                    )}
                  </div>
                </div>
              )}
              {disease.reference_document && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: '#f0fdf4' }}>📄</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Dokumen Referensi</p>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">{disease.reference_document}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <button
            onClick={() => router.back()}
            className="py-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-600 hover:bg-white transition-all"
          >
            ← Kembali
          </button>
          <button
            onClick={() => router.push('/diagnose')}
            className="py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            🔬 Diagnosa Ulang
          </button>
        </div>
      </div>
    </main>
  )
}
