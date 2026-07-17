"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mapping Nilai Keyakinan CF User
const CF_OPTIONS = [
  { label: "Tidak yakin", value: 0.2 },
  { label: "Sedikit yakin", value: 0.4 },
  { label: "Cukup yakin", value: 0.6 },
  { label: "Yakin", value: 0.8 },
  { label: "Sangat yakin", value: 1.0 },
];

export default function DiagnosisFlow() {
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState("");
  const [part, setPart] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [userInputs, setUserInputs] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  // Fetch Gejala berdasar fase & bagian (Step 3)
  useEffect(() => {
    if (step === 3) {
      fetch(`/api/symptoms?phase=${phase}&plant_part=${part}`)
        .then(res => res.json())
        .then(data => setSymptoms(data));
    }
  }, [step, phase, part]);

  const handleConfidenceSelect = (symptom_id: string, cf_value: number) => {
    const existing = userInputs.filter(i => i.symptom_id !== symptom_id);
    setUserInputs([...existing, { symptom_id, cf_user: cf_value }]);
  };

  const submitDiagnosis = async () => {
    const res = await fetch("/api/diagnose", {
      method: "POST",
      body: JSON.stringify({ userInputs }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setResult(data.result);
    setStep(4);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Langkah 1: Pilih Fase Tanaman</h2>
          <div className="flex gap-4">
            <Button onClick={() => { setPhase("vegetatif"); setStep(2); }}>Vegetatif</Button>
            <Button onClick={() => { setPhase("generatif"); setStep(2); }}>Generatif</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Langkah 2: Pilih Bagian Tanaman</h2>
          <div className="flex gap-4 flex-wrap">
            {["Daun", "Batang", "Akar", "Malai", "Gabah"].map(p => (
              <Button key={p} variant="outline" onClick={() => { setPart(p.toLowerCase()); setStep(3); }}>
                {p}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Langkah 3: Pilih Gejala & Keyakinan</h2>
          <div className="space-y-6">
            {symptoms.map((s: any) => (
              <div key={s.id} className="border p-4 rounded-md">
                <p className="font-semibold">{s.code} - {s.name}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {CF_OPTIONS.map(opt => (
                    <Button 
                      key={opt.value} 
                      size="sm"
                      variant={userInputs.find(u => u.symptom_id === s.id)?.cf_user === opt.value ? "default" : "outline"}
                      onClick={() => handleConfidenceSelect(s.id, opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full" onClick={submitDiagnosis} disabled={userInputs.length === 0}>
            Proses Diagnosa
          </Button>
        </Card>
      )}

      {step === 4 && result && (
        <Card className="p-6 border-primary border-2">
          <h2 className="text-2xl font-bold text-primary mb-2">Hasil Diagnosa</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{result.disease.name} 
              <span className="text-gray-500 italic text-lg ml-2">({result.disease.latin_name})</span>
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">Keyakinan: {result.percentage}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold border-b pb-1">Penyebab</h4>
              <p className="text-gray-700 mt-1">{result.disease.cause}</p>
            </div>
            <div>
              <h4 className="font-bold border-b pb-1">Solusi & Pengendalian</h4>
              <ul className="list-disc pl-5 mt-1 text-gray-700">
                {result.disease.treatments.map((t: any) => (
                  <li key={t.id}><strong>{t.type}:</strong> {t.description}</li>
                ))}
              </ul>
            </div>
          </div>
          <Button className="mt-6 outline" onClick={() => { setStep(1); setUserInputs([]); }}>Diagnosa Ulang</Button>
        </Card>
      )}
    </div>
  );
}