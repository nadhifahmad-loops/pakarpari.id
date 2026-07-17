'use client'

import { useState } from 'react'
import { useSymptoms, useDiagnosis, useSaveHistory } from '@/lib/hooks'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import DiagnosisResults from './diagnosis-results'

type Step = 'phase' | 'plant_part' | 'symptoms' | 'results'

interface SelectedSymptom {
  symptomId: string
  cfUser: number
}

const CF_LEVELS = [
  { value: 0.2, label: 'Tidak Yakin',   short: '20%', color: '#6b7280' },
  { value: 0.4, label: 'Sedikit Yakin', short: '40%', color: '#d97706' },
  { value: 0.6, label: 'Cukup Yakin',   short: '60%', color: '#2563eb' },
  { value: 0.8, label: 'Yakin',         short: '80%', color: '#16a34a' },
  { value: 1.0, label: 'Sangat Yakin',  short: '100%', color: '#15803d' },
]

const PLANT_PARTS = [
  { value: 'daun',   label: 'Daun',   icon: '🍃', desc: 'Helai daun & pelepah' },
  { value: 'batang', label: 'Batang', icon: '🌿', desc: 'Batang & ruas' },
  { value: 'akar',   label: 'Akar',   icon: '🌱', desc: 'Akar & pangkal' },
  { value: 'malai',  label: 'Malai',  icon: '🌾', desc: 'Malai & tangkai' },
  { value: 'gabah',  label: 'Gabah',  icon: '🟡', desc: 'Butir padi' },
]

const STEPS = [
  { key: 'phase' as Step,      label: 'Fase',    icon: '🌱' },
  { key: 'plant_part' as Step, label: 'Bagian',  icon: '🌿' },
  { key: 'symptoms' as Step,   label: 'Gejala',  icon: '🔍' },
  { key: 'results' as Step,    label: 'Hasil',   icon: '📋' },
]

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300"
              style={{
                background: i < idx ? '#16a34a' : i === idx ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#e5e7eb',
                color: i <= idx ? 'white' : '#9ca3af',
                boxShadow: i === idx ? '0 0 0 4px #bbf7d080' : 'none',
              }}
            >
              {i < idx ? '✓' : i + 1}
            </div>
            <span className="text-xs mt-1 font-semibold hidden sm:block" style={{ color: i === idx ? '#15803d' : i < idx ? '#16a34a' : '#9ca3af' }}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mt-[-12px] sm:mt-[-24px] rounded-full transition-all duration-500" style={{ background: i < idx ? '#16a34a' : '#e5e7eb' }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function DiagnosisWizard() {
  const [step, setStep] = useState<Step>('phase')
  const [phase, setPhase] = useState<'vegetatif' | 'generatif' | ''>('')
  const [plant_part, setPlantPart] = useState<string>('')
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([])
  const [results, setResults] = useState<any>(null)
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null)

  const { data: symptoms, loading: symptomsLoading, error: symptomsError } = useSymptoms(
    step === 'symptoms' ? phase : undefined,
    step === 'symptoms' ? plant_part : undefined
  )
  const { execute: diagnose, loading: diagnosing } = useDiagnosis()
  const { execute: saveHistory } = useSaveHistory()

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.symptomId === symptomId)
      return exists ? prev.filter(s => s.symptomId !== symptomId) : [...prev, { symptomId, cfUser: 0.6 }]
    })
  }

  const handleCFChange = (symptomId: string, cfUser: number) => {
    setSelectedSymptoms(prev => prev.map(s => s.symptomId === symptomId ? { ...s, cfUser } : s))
  }

  const handleDiagnose = async () => {
    if (selectedSymptoms.length === 0) return
    setDiagnosisError(null)
    try {
      const r = await diagnose({ phase: phase as any, plant_part: plant_part as any, symptoms: selectedSymptoms })
      if (r && r.length > 0) {
        setResults(r)
        setStep('results')
        saveHistory(r[0].diseaseId, r[0].confidence).catch(() => {})
      } else {
        setDiagnosisError('Tidak ditemukan penyakit yang cocok. Coba tambahkan lebih banyak gejala.')
      }
    } catch {
      setDiagnosisError('Terjadi kesalahan pada proses diagnosa. Silakan coba lagi.')
    }
  }

  const handleReset = () => {
    setStep('phase'); setPhase(''); setPlantPart(''); setSelectedSymptoms([]); setResults(null); setDiagnosisError(null)
  }

  if (step === 'results' && results) return <DiagnosisResults results={results} onReset={handleReset} />

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2">
      <StepBar current={step} />

      {/* ─── STEP 1: Fase ─── */}
      {step === 'phase' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Fase Pertumbuhan Tanaman</h2>
            <p className="text-sm text-gray-500 mt-0.5">Sedang di fase mana tanaman padi Anda sekarang?</p>
          </div>
          <div className="p-5 space-y-3">
            {[
              { value: 'vegetatif', label: 'Vegetatif', desc: 'Tanaman masih muda, sedang tumbuh daun dan batang (0–45 hari setelah tanam)', icon: '🌱', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
              { value: 'generatif', label: 'Generatif', desc: 'Tanaman sudah dewasa, mulai keluar malai dan bunga (45 hari ke atas)', icon: '🌾', color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setPhase(opt.value as any)}
                className="w-full text-left rounded-xl border-2 p-4 transition-all hover:shadow-md"
                style={{
                  borderColor: phase === opt.value ? opt.border : '#e5e7eb',
                  background: phase === opt.value ? opt.bg : 'white',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: phase === opt.value ? opt.bg : '#f9fafb', border: `1.5px solid ${phase === opt.value ? opt.border : '#e5e7eb'}` }}>
                    {opt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900">{opt.label}</p>
                      {phase === opt.value && <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: opt.color }}><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={() => setStep('plant_part')}
              disabled={!phase}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: phase ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#e5e7eb' }}
            >
              Lanjut ke Bagian Tanaman →
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: Bagian Tanaman ─── */}
      {step === 'plant_part' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Bagian Tanaman yang Sakit</h2>
            <p className="text-sm text-gray-500 mt-0.5">Pilih bagian tanaman yang menunjukkan gejala penyakit</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {PLANT_PARTS.map(part => (
                <button
                  key={part.value}
                  onClick={() => setPlantPart(part.value)}
                  className="rounded-xl border-2 p-4 text-center transition-all hover:shadow-md"
                  style={{
                    borderColor: plant_part === part.value ? '#16a34a' : '#e5e7eb',
                    background: plant_part === part.value ? '#f0fdf4' : 'white',
                  }}
                >
                  <div className="text-3xl mb-2">{part.icon}</div>
                  <p className="font-bold text-sm text-gray-900">{part.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{part.desc}</p>
                  {plant_part === part.value && (
                    <div className="mt-2 text-xs font-semibold" style={{ color: '#16a34a' }}>✓ Dipilih</div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep('phase')} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                ← Kembali
              </button>
              <button
                onClick={() => { setSelectedSymptoms([]); setStep('symptoms') }}
                disabled={!plant_part}
                className="flex-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
                style={{ background: plant_part ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#e5e7eb', flex: 2 }}
              >
                Pilih Gejala →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 3: Gejala ─── */}
      {step === 'symptoms' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Pilih Gejala yang Terlihat</h2>
            <p className="text-sm text-gray-500 mt-0.5">Centang semua gejala yang Anda lihat pada tanaman, lalu atur seberapa yakin Anda</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize" style={{ background: '#f0fdf4', color: '#15803d' }}>🌱 {phase}</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize" style={{ background: '#eff6ff', color: '#1d4ed8' }}>🌿 {plant_part}</span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {symptomsLoading && (
              <div className="flex flex-col items-center py-14 gap-3">
                <div className="w-10 h-10 rounded-full border-3 border-green-500 border-t-transparent animate-spin" style={{ borderWidth: 3 }} />
                <p className="text-gray-500 text-sm">Memuat daftar gejala...</p>
              </div>
            )}

            {symptomsError && (
              <div className="text-center py-10 rounded-xl" style={{ background: '#fef2f2' }}>
                <p className="text-3xl mb-2">⚠️</p>
                <p className="font-semibold text-sm" style={{ color: '#991b1b' }}>Gagal memuat gejala</p>
                <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>{symptomsError.message}</p>
              </div>
            )}

            {!symptomsLoading && !symptomsError && symptoms && symptoms.length === 0 && (
              <div className="text-center py-12 rounded-xl bg-gray-50">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-semibold text-gray-700">Tidak ada gejala ditemukan</p>
                <p className="text-sm text-gray-500 mt-1">untuk <strong className="capitalize">{phase} – {plant_part}</strong></p>
                <p className="text-xs text-gray-400 mt-2">Coba pilih bagian tanaman yang lain</p>
              </div>
            )}

            {!symptomsLoading && symptoms && symptoms.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium">{symptoms.length} gejala tersedia — pilih minimal 1</p>
                {symptoms.map((symptom: any) => {
                  const sel = selectedSymptoms.find(s => s.symptomId === symptom.id)
                  return (
                    <div
                      key={symptom.id}
                      className="rounded-xl border transition-all overflow-hidden"
                      style={{ borderColor: sel ? '#86efac' : '#e5e7eb', background: sel ? '#f0fdf4' : 'white' }}
                    >
                      <div
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                        onClick={() => handleSymptomToggle(symptom.id)}
                      >
                        <div className="mt-0.5 shrink-0">
                          <Checkbox
                            id={symptom.id}
                            checked={!!sel}
                            onCheckedChange={() => handleSymptomToggle(symptom.id)}
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={symptom.id} className="cursor-pointer font-semibold text-sm text-gray-900">
                            {symptom.name}
                          </Label>
                          {symptom.description && (
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{symptom.description}</p>
                          )}
                        </div>
                      </div>

                      {sel && (
                        <div className="px-4 pb-3 pt-0 border-t" style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                          <p className="text-xs font-bold text-gray-600 mb-2">Seberapa yakin Anda melihat gejala ini?</p>
                          <div className="flex flex-wrap gap-1.5">
                            {CF_LEVELS.map(opt => (
                              <button
                                key={opt.value}
                                onClick={(e) => { e.stopPropagation(); handleCFChange(symptom.id, opt.value) }}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                                style={{
                                  background: sel.cfUser === opt.value ? opt.color : 'white',
                                  color: sel.cfUser === opt.value ? 'white' : '#6b7280',
                                  borderColor: sel.cfUser === opt.value ? opt.color : '#e5e7eb',
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {diagnosisError && (
              <div className="p-3 rounded-xl flex items-start gap-2 text-sm" style={{ background: '#fef2f2', color: '#991b1b' }}>
                <span>⚠️</span><span>{diagnosisError}</span>
              </div>
            )}

            {selectedSymptoms.length > 0 && (
              <div className="py-2 px-3 rounded-xl text-center text-xs font-semibold" style={{ background: '#dcfce7', color: '#15803d' }}>
                ✅ {selectedSymptoms.length} gejala dipilih — siap untuk didiagnosa
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep('plant_part')} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                ← Kembali
              </button>
              <button
                onClick={handleDiagnose}
                disabled={selectedSymptoms.length === 0 || diagnosing || symptomsLoading}
                className="flex-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: selectedSymptoms.length > 0 ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#e5e7eb', flex: 2 }}
              >
                {diagnosing ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Memproses...
                  </>
                ) : '🔬 Diagnosa Sekarang →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
