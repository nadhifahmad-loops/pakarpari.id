import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/diseases/:id
 * Get single disease details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const disease = await prisma.disease.findUnique({
      where: { id },
      include: {
        disease_symptoms: {
          include: {
            symptom: true,
          },
        },
        treatments: true,
        diagnosis_history: {
          take: 10,
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    if (!disease) {
      return NextResponse.json(
        { error: 'Disease not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        disease,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get disease error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
