import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date()
    const slots = await prisma.timeSlot.findMany({
      where: {
        date: { gte: now },
      },
      orderBy: { date: 'asc' },
      include: {
        reservations: {
          where: { status: 'confirmed' },
          select: { id: true },
        },
      },
    })

    const formatted = slots.map((slot: typeof slots[number]) => ({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable && slot.reservations.length === 0,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
