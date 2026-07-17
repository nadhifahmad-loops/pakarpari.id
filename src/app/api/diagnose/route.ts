import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import {
  calculateDiseaseConfidence,
  cfToPercentage,
  getConfidenceLevel,
  filterByConfidenceThreshold,
} from '@/lib/certainty-factor'

const prisma = new PrismaClient()

interface DiagnosisRequest {
  phase: 'vegetatif' | 'generatif'
  plant_part: 'daun' | 'batang' | 'akar' | 'malai' | 'gabah'
  symptoms: Array<{
    symptomId: string
    cfUser: number
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: DiagnosisRequest = await request.json()
    const { phase, plant_part, symptoms } = body

    if (!phase || !plant_part || !symptoms || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Required: phase, plant_part, symptoms array' },
        { status: 400 }
      )
    }

    for (const symptom of symptoms) {
      if (typeof symptom.cfUser !== 'number' || symptom.cfUser < 0 || symptom.cfUser > 1) {
        return NextResponse.json(
          { error: `Invalid CF value for symptom ${symptom.symptomId}. Must be between 0 and 1` },
          { status: 400 }
        )
      }
    }

    const selectedSymptomIds = symptoms.map(s => s.symptomId)

    const selectedSymptomDetails = await prisma.symptom.findMany({
      where: { id: { in: selectedSymptomIds } },
    })

    if (selectedSymptomDetails.length !== selectedSymptomIds.length) {
      return NextResponse.json(
        { error: 'One or more symptoms not found' },
        { status: 404 }
      )
    }

    // Fetch diseases WITH treatments included
    const diseases = await prisma.disease.findMany({
      where: { plant: { name: 'Padi' } },
      include: {
        disease_symptoms: {
          include: { symptom: true },
        },
        treatments: true, // <-- include treatments in diagnosis result
      },
    })

    const diagnosisResults: any[] = []

    for (const disease of diseases) {
      const matchingSymptoms = disease.disease_symptoms.filter(ds =>
        selectedSymptomIds.includes(ds.symptom_id)
      )

      if (matchingSymptoms.length === 0) continue

      const symptomEvidence = matchingSymptoms.map(ds => {
        const userSymptom = symptoms.find(s => s.symptomId === ds.symptom_id)!
        return { cfUser: userSymptom.cfUser, cfExpert: ds.cf_expert }
      })

      const confidence = calculateDiseaseConfidence(symptomEvidence)
      const confidencePercentage = cfToPercentage(confidence)
      const confidenceLevel = getConfidenceLevel(confidencePercentage)

      diagnosisResults.push({
        diseaseId: disease.id,
        disease: {
          id: disease.id,
          code: disease.code,
          name: disease.name,
          latin_name: disease.latin_name,
          description: disease.description,
          cause: disease.cause,
          impact: disease.impact,
          treatments: disease.treatments, // <-- pass treatments to frontend
        },
        confidence,
        confidencePercentage,
        confidenceLevel,
        matchingSymptoms: matchingSymptoms.map(ds => ({
          symptomId: ds.symptom_id,
          symptomName: ds.symptom.name,
          cfUser: symptoms.find(s => s.symptomId === ds.symptom_id)!.cfUser,
          cfExpert: ds.cf_expert,
          symptomCF: symptoms.find(s => s.symptomId === ds.symptom_id)!.cfUser * ds.cf_expert,
        })),
      })
    }

    const filteredResults = filterByConfidenceThreshold(diagnosisResults, 0.3)

    return NextResponse.json(
      { success: true, results: filteredResults, totalMatches: filteredResults.length },
      { status: 200 }
    )
  } catch (error) {
    console.error('Diagnosis error:', error)
    return NextResponse.json(
      { error: 'Internal server error during diagnosis' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
