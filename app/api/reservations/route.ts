import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, phone, service, message, timeSlotId } = body

    // Validate required fields
    if (!firstName || !lastName || !phone || !service || !timeSlotId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Check if slot exists and is available
    const slot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
      include: {
        reservations: { where: { status: 'confirmed' } },
      },
    })

    if (!slot) {
      return NextResponse.json({ error: 'Créneau introuvable' }, { status: 404 })
    }

    if (!slot.isAvailable || slot.reservations.length > 0) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est plus disponible' },
        { status: 409 }
      )
    }

    // Create reservation and mark slot as unavailable
    const [reservation] = await prisma.$transaction([
      prisma.reservation.create({
        data: {
          firstName,
          lastName,
          phone,
          service,
          message: message || '',
          timeSlotId,
          status: 'confirmed',
        },
      }),
      prisma.timeSlot.update({
        where: { id: timeSlotId },
        data: { isAvailable: false },
      }),
    ])

    return NextResponse.json({ success: true, reservationId: reservation.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
