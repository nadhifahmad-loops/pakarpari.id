import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/symptoms
 * Get all symptoms or filtered by phase and plant_part
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phase = searchParams.get('phase')
    const plant_part = searchParams.get('plant_part')

    let where: any = {}

    if (phase) {
      where.phase = {
        in: [phase, 'semua'],
      }
    }

    if (plant_part) {
      where.plant_part = plant_part
    }

    const symptoms = await prisma.symptom.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        plant_part: true,
        phase: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(
      {
        success: true,
        symptoms,
        count: symptoms.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get symptoms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
