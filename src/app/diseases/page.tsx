'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const PART_ICONS: Record<string, string> = {
  daun: '🍃', batang: '🌿', akar: '🌱', malai: '🌾', gabah: '🟡',
}
const PHASE_STYLE: Record<string, { bg: string; text: string }> = {
  vegetatif: { bg: '#f0fdf4', text: '#15803d' },
  generatif: { bg: '#fffbeb', text: '#92400e' },
  semua:     { bg: '#eff6ff', text: '#1d4ed8' },
}

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/diseases')
      .then(res => res.json())
      .then(data => setDiseases(data.diseases ?? []))
      .catch(() => setError('Gagal memuat data penyakit'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = diseases.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.latin_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700 transition-colors font-medium flex items-center gap-1 mb-4">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-black text-gray-900">📚 Ensiklopedi Penyakit Padi</h1>
          <p className="text-gray-500 text-sm mt-1">Database penyakit padi dalam sistem pakar PakarPari.id</p>
        </div>

        {/* Statistik */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Penyakit', value: diseases.length, icon: '🦠', color: '#dc2626', bg: '#fef2f2' },
              { label: 'Gejala', value: diseases.reduce((sum, d) => sum + (d.disease_symptoms?.length ?? 0), 0), icon: '🔍', color: '#2563eb', bg: '#eff6ff' },
              { label: 'Penanganan', value: diseases.reduce((sum, d) => sum + (d.treatments?.length ?? 0), 0), icon: '💊', color: '#16a34a', bg: '#f0fdf4' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border bg-white p-3.5 text-center shadow-sm" style={{ borderColor: s.bg }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</div>
          <input
            type="text"
            placeholder="Cari nama penyakit atau nama latin..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 text-sm"
            style={{ focusRingColor: '#86efac' } as any}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Memuat data penyakit...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-200">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="font-semibold text-gray-700">{error}</p>
          </div>
        )}

        {/* Tidak ada hasil pencarian */}
        {!loading && !error && filtered.length === 0 && search && (
          <div className="text-center py-16 rounded-2xl bg-white border border-gray-200">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-gray-700">Tidak ada hasil untuk &quot;{search}&quot;</p>
            <p className="text-sm text-gray-400 mt-1">Coba kata kunci yang berbeda</p>
          </div>
        )}

        {/* Kartu Penyakit */}
        {!loading && !error && (
          <div className="space-y-3">
            {filtered.map(d => {
              const phases = [...new Set((d.disease_symptoms ?? []).map((ds: any) => ds.symptom?.phase).filter(Boolean))] as string[]
              const parts = [...new Set((d.disease_symptoms ?? []).map((ds: any) => ds.symptom?.plant_part).filter(Boolean))] as string[]
              return (
                <Link key={d.id} href={`/diseases/${d.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all p-4 cursor-pointer group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {d.code && (
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: '#f0fdf4', color: '#15803d' }}>{d.code}</span>
                          )}
                        </div>
                        <h3 className="font-black text-gray-900 group-hover:text-green-700 transition-colors">{d.name}</h3>
                        {d.latin_name && <p className="text-xs text-gray-400 italic mt-0.5">{d.latin_name}</p>}
                        {d.description && (
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{d.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {phases.map(p => {
                            const st = PHASE_STYLE[p] ?? { bg: '#f3f4f6', text: '#374151' }
                            return <span key={p} className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: st.bg, color: st.text }}>{p}</span>
                          })}
                          {parts.slice(0, 4).map(p => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                              {PART_ICONS[p] ?? '🌿'} {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl mb-1">🌾</div>
                        <p className="text-xs text-gray-400 font-medium">{d.disease_symptoms?.length ?? 0} gejala</p>
                        <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center mt-2 ml-auto transition-colors">
                          <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1L6.5 6L1.5 11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Tombol Diagnosa */}
        {!loading && (
          <div className="mt-6 pb-6">
            <Link href="/diagnose">
              <button className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:opacity-90 shadow-sm" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                🔬 Mulai Diagnosa Sekarang →
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
