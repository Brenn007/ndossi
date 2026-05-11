import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function unauthorized() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()

  try {
    const slots = await prisma.timeSlot.findMany({
      orderBy: { date: 'asc' },
      include: {
        reservations: {
          where: { status: 'confirmed' },
          select: { id: true, firstName: true, lastName: true, service: true },
        },
      },
    })
    return NextResponse.json(slots)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()

  try {
    const body = await req.json()
    const { date, startTime, endTime } = body

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const slot = await prisma.timeSlot.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: true,
      },
    })

    return NextResponse.json(slot, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    // Check for confirmed reservations
    const slot = await prisma.timeSlot.findUnique({
      where: { id },
      include: { reservations: { where: { status: 'confirmed' } } },
    })

    if (!slot) {
      return NextResponse.json({ error: 'Créneau introuvable' }, { status: 404 })
    }

    if (slot.reservations.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un créneau avec des réservations actives' },
        { status: 409 }
      )
    }

    await prisma.timeSlot.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
