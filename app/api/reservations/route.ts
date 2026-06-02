import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendConfirmationEmail } from '@/lib/email'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, service, message, timeSlotId } = body

    if (!firstName || !lastName || !email || !service || !timeSlotId) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
    }

    const slot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
      include: { reservations: { where: { status: 'confirmed' } } },
    })

    if (!slot) {
      return NextResponse.json({ error: 'Créneau introuvable' }, { status: 404 })
    }

    if (!slot.isAvailable || slot.reservations.length > 0) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 })
    }

    const [reservation] = await prisma.$transaction([
      prisma.reservation.create({
        data: { firstName, lastName, email, service, message: message || '', timeSlotId, status: 'confirmed' },
      }),
      prisma.timeSlot.update({
        where: { id: timeSlotId },
        data: { isAvailable: false },
      }),
    ])

    // Send confirmation email (non-blocking)
    const dateLabel = format(new Date(slot.date), 'EEEE d MMMM yyyy', { locale: fr })
    sendConfirmationEmail({
      to: email,
      firstName,
      date: dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1),
      startTime: slot.startTime,
      endTime: slot.endTime,
      service,
    }).catch(err => console.error('Email send error:', err))

    return NextResponse.json({ success: true, reservationId: reservation.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
