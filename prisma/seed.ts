import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface KnowledgeBase {
  diseases: Array<{
    code: string
    name: string
    latin_name: string
    description: string
    cause: string
    impact: string
    reference_source: string
    reference_document: string
  }>
  symptoms: Array<{
    code: string
    name: string
    description: string
    plant_part: string
    phase: string
  }>
  disease_symptoms: Array<{
    disease_code: string
    symptom_code: string
    cf_expert: number
  }>
  treatments: Array<{
    disease_code: string
    title: string
    description: string
    type: string
  }>
}

async function main() {
  try {
    console.log('🌾 Starting PakarPari.id Knowledge Base Seeding...')

    // Read knowledge base
    const knowledgeBasePath = path.join(
      process.cwd(),
      'knowledge_base.json'
    )
    
    if (!fs.existsSync(knowledgeBasePath)) {
      throw new Error(`Knowledge base file not found at ${knowledgeBasePath}`)
    }

    const knowledgeBase: KnowledgeBase = JSON.parse(
      fs.readFileSync(knowledgeBasePath, 'utf-8')
    )

    console.log(`📖 Loaded knowledge base with ${knowledgeBase.diseases.length} diseases`)

    // Ensure Plant exists
    const plant = await prisma.plant.upsert({
      where: { id: 'rice' },
      update: {},
      create: {
        id: 'rice',
        name: 'Padi',
        scientific_name: 'Oryza sativa L.',
        description: 'Tanaman padi adalah tanaman pangan utama di Asia Tenggara',
      },
    })

    console.log(`✅ Plant created/updated: ${plant.name}`)

    // Map to store disease codes to IDs for relation
    const diseaseCodeToId: Record<string, string> = {}
    const symptomCodeToId: Record<string, string> = {}

    // Seed Diseases
    console.log('🦠 Seeding Diseases...')
    for (const diseaseData of knowledgeBase.diseases) {
      const disease = await prisma.disease.upsert({
        where: { code: diseaseData.code },
        update: {
          name: diseaseData.name,
          latin_name: diseaseData.latin_name,
          description: diseaseData.description,
          cause: diseaseData.cause,
          impact: diseaseData.impact,
          reference_source: diseaseData.reference_source,
          reference_document: diseaseData.reference_document,
        },
        create: {
          code: diseaseData.code,
          name: diseaseData.name,
          latin_name: diseaseData.latin_name,
          description: diseaseData.description,
          cause: diseaseData.cause,
          impact: diseaseData.impact,
          reference_source: diseaseData.reference_source,
          reference_document: diseaseData.reference_document,
          plant_id: plant.id,
        },
      })
      diseaseCodeToId[diseaseData.code] = disease.id
      console.log(`  ✓ ${disease.name} (${disease.code})`)
    }

    // Seed Symptoms
    console.log('👁️ Seeding Symptoms...')
    for (const symptomData of knowledgeBase.symptoms) {
      const symptom = await prisma.symptom.upsert({
        where: { code: symptomData.code },
        update: {
          name: symptomData.name,
          description: symptomData.description,
          plant_part: symptomData.plant_part,
          phase: symptomData.phase,
        },
        create: {
          code: symptomData.code,
          name: symptomData.name,
          description: symptomData.description,
          plant_part: symptomData.plant_part,
          phase: symptomData.phase,
        },
      })
      symptomCodeToId[symptomData.code] = symptom.id
      console.log(`  ✓ ${symptom.name}`)
    }

    // Seed Disease-Symptom Relations (Knowledge Base Rules)
    console.log('🔗 Seeding Disease-Symptom Relations...')
    for (const dsData of knowledgeBase.disease_symptoms) {
      const diseaseId = diseaseCodeToId[dsData.disease_code]
      const symptomId = symptomCodeToId[dsData.symptom_code]

      if (!diseaseId || !symptomId) {
        console.warn(`⚠️ Skipping: Disease ${dsData.disease_code} or Symptom ${dsData.symptom_code} not found`)
        continue
      }

      const diseaseSymptom = await prisma.diseaseSymptom.upsert({
        where: {
          disease_id_symptom_id: {
            disease_id: diseaseId,
            symptom_id: symptomId,
          },
        },
        update: {
          cf_expert: dsData.cf_expert,
        },
        create: {
          disease_id: diseaseId,
          symptom_id: symptomId,
          cf_expert: dsData.cf_expert,
        },
      })
      console.log(`  ✓ ${dsData.disease_code} → ${dsData.symptom_code} (CF: ${dsData.cf_expert})`)
    }

    // Seed Treatments (batch sekaligus)
    console.log('💊 Seeding Treatments...')

    // Hapus dulu treatments lama agar tidak duplikat
    await prisma.treatment.deleteMany({})

    const treatmentsData = knowledgeBase.treatments
      .filter(t => diseaseCodeToId[t.disease_code])
      .map(t => ({
        disease_id: diseaseCodeToId[t.disease_code],
        title: t.title,
        description: t.description,
        type: t.type,
      }))

    await prisma.treatment.createMany({ data: treatmentsData })
    console.log(`  ✓ ${treatmentsData.length} treatments berhasil ditambahkan`)

    console.log('\n✨ Knowledge Base Seeding Completed Successfully!')
    console.log(`
📊 Summary:
  - Plants: 1
  - Diseases: ${knowledgeBase.diseases.length}
  - Symptoms: ${knowledgeBase.symptoms.length}
  - Disease-Symptom Rules: ${knowledgeBase.disease_symptoms.length}
  - Treatments: ${knowledgeBase.treatments.length}
    `)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
