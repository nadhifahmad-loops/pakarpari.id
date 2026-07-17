import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SaveHistoryRequest {
  disease_id: string
  cf_result: number
  user_id?: string
}

/**
 * GET /api/history
 * Get diagnosis history (optionally filtered by user_id)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const user_id = searchParams.get('user_id')
    const limit = searchParams.get('limit') || '50'

    const where: any = {}
    if (user_id) {
      where.user_id = user_id
    }

    const history = await prisma.diagnosisHistory.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        disease: {
          select: {
            id: true,
            code: true,
            name: true,
            latin_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: parseInt(limit),
    })

    return NextResponse.json(
      {
        success: true,
        history,
        count: history.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * POST /api/history
 * Save diagnosis result to history
 */
export async function POST(request: NextRequest) {
  try {
    const body: SaveHistoryRequest = await request.json()
    const { disease_id, cf_result, user_id } = body

    if (!disease_id || cf_result === undefined) {
      return NextResponse.json(
        {
          error: 'Required fields: disease_id, cf_result',
        },
        { status: 400 }
      )
    }

    // Verify disease exists
    const disease = await prisma.disease.findUnique({
      where: { id: disease_id },
    })

    if (!disease) {
      return NextResponse.json(
        { error: 'Disease not found' },
        { status: 404 }
      )
    }

    const historyEntry = await prisma.diagnosisHistory.create({
      data: {
        disease_id,
        cf_result,
        user_id: user_id || null,
      },
      include: {
        disease: {
          select: {
            id: true,
            code: true,
            name: true,
            latin_name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        history: historyEntry,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Save history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
