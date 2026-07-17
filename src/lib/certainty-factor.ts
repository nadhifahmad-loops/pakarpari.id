/**
 * Certainty Factor Engine for AgriExpert
 * 
 * Implements the Certainty Factor model for calculating confidence
 * in disease diagnosis based on symptom evidence and expert knowledge.
 */

interface SymptomEvidence {
  symptomId: string
  cfUser: number // User confidence: 0.0 - 1.0
}

interface RuleEvidence {
  cfExpert: number // Expert confidence: 0.0 - 1.0
}

/**
 * Calculate combined certainty factor using Mycin formula
 * CFcombine = CFold + CFnew × (1 − CFold)
 * 
 * This is used when multiple pieces of evidence support the same conclusion
 */
export function combineCertaintyFactors(
  cfOld: number,
  cfNew: number
): number {
  if (cfOld === 0 && cfNew === 0) return 0
  return cfOld + cfNew * (1 - cfOld)
}

/**
 * Calculate final CF for a symptom
 * Final CF = CF User × CF Expert
 */
export function calculateSymptomCF(
  cfUser: number,
  cfExpert: number
): number {
  return cfUser * cfExpert
}

/**
 * Calculate disease confidence based on multiple symptoms
 * Uses forward chaining inference
 */
export function calculateDiseaseConfidence(
  symptoms: Array<{
    cfUser: number
    cfExpert: number
  }>
): number {
  if (symptoms.length === 0) return 0

  let combinedCF = 0

  for (const symptom of symptoms) {
    const symptomCF = calculateSymptomCF(symptom.cfUser, symptom.cfExpert)
    combinedCF = combineCertaintyFactors(combinedCF, symptomCF)
  }

  // Ensure result is between 0 and 1
  return Math.max(0, Math.min(1, combinedCF))
}

/**
 * Calculate confidence percentage (0-100%)
 */
export function cfToPercentage(cf: number): number {
  return Math.round(cf * 100)
}

/**
 * Get confidence level description in Indonesian
 */
export function getConfidenceLevel(cfPercentage: number): string {
  if (cfPercentage >= 90) return 'Sangat Tinggi'
  if (cfPercentage >= 70) return 'Tinggi'
  if (cfPercentage >= 50) return 'Sedang'
  if (cfPercentage >= 30) return 'Rendah'
  return 'Sangat Rendah'
}

/**
 * Filter diseases by minimum confidence threshold
 * Default threshold: 30% (Rendah)
 */
export function filterByConfidenceThreshold(
  diseaseResults: Array<{
    diseaseId: string
    disease: {
      id: string
      name: string
      latin_name: string | null
    }
    confidence: number
  }>,
  threshold: number = 0.3
): typeof diseaseResults {
  return diseaseResults
    .filter(result => result.confidence >= threshold)
    .sort((a, b) => b.confidence - a.confidence)
}

/**
 * Validate CF values are within valid range [0.0, 1.0]
 */
export function isValidCF(value: number): boolean {
  return typeof value === 'number' && value >= 0 && value <= 1
}

/**
 * Calculate weighted average of symptom CFs
 * Useful for diseases with many symptoms
 */
export function calculateWeightedAverage(
  symptoms: Array<{
    cfUser: number
    cfExpert: number
    weight?: number
  }>
): number {
  if (symptoms.length === 0) return 0

  const defaultWeight = 1 / symptoms.length
  let totalWeight = 0
  let weightedSum = 0

  for (const symptom of symptoms) {
    const weight = symptom.weight ?? defaultWeight
    const symptomCF = calculateSymptomCF(symptom.cfUser, symptom.cfExpert)
    weightedSum += symptomCF * weight
    totalWeight += weight
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}
