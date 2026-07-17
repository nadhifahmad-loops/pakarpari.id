export interface UserSymptomInput {
  symptom_id: string;
  cf_user: number; // 0.2, 0.4, 0.6, 0.8, 1.0
}

export interface DiseaseRule {
  disease_id: string;
  symptom_id: string;
  cf_expert: number;
}

export function calculateCertaintyFactor(
  userInputs: UserSymptomInput[],
  rules: DiseaseRule[]
) {
  const diseaseScores: Record<string, number> = {};

  // Kelompokkan rule berdasarkan penyakit
  const diseaseGroupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.disease_id]) acc[rule.disease_id] = [];
    acc[rule.disease_id].push(rule);
    return acc;
  }, {} as Record<string, DiseaseRule[]>);

  // Proses perhitungan untuk setiap penyakit
  for (const [diseaseId, diseaseRules] of Object.entries(diseaseGroupedRules)) {
    let cfCombined = 0;

    for (const rule of diseaseRules) {
      // Cari apakah user menginputkan gejala ini
      const userInput = userInputs.find((u) => u.symptom_id === rule.symptom_id);
      
      if (userInput && userInput.cf_user > 0) {
        // Hitung CF Rule (CF Pakar x CF User)
        const cfRule = rule.cf_expert * userInput.cf_user;

        // Implementasi Rumus CF Combine
        if (cfCombined === 0) {
          cfCombined = cfRule; // Iterasi pertama
        } else {
          cfCombined = cfCombined + cfRule * (1 - cfCombined);
        }
      }
    }

    if (cfCombined > 0) {
      diseaseScores[diseaseId] = cfCombined;
    }
  }

  // Urutkan dari persentase keyakinan tertinggi
  const sortedResults = Object.entries(diseaseScores)
    .map(([disease_id, cf_result]) => ({
      disease_id,
      cf_result,
      percentage: (cf_result * 100).toFixed(2) + "%",
    }))
    .sort((a, b) => b.cf_result - a.cf_result);

  return sortedResults;
}