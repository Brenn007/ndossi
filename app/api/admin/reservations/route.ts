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
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        timeSlot: true,
      },
    })
    return NextResponse.json(reservations)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()

  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    })

    // If cancelled, free up the time slot
    if (status === 'cancelled') {
      await prisma.timeSlot.update({
        where: { id: reservation.timeSlotId },
        data: { isAvailable: true },
      })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
