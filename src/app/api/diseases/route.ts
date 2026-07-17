import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/diseases
 * Get all diseases with their details and treatments
 */
export async function GET(request: NextRequest) {
  try {
    const diseases = await prisma.disease.findMany({
      include: {
        disease_symptoms: {
          include: {
            symptom: true,
          },
        },
        treatments: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(
      {
        success: true,
        diseases,
        count: diseases.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get diseases error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
