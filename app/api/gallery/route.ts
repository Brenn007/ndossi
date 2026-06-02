import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, title: true, category: true, imageUrl: true, gradient: true, order: true },
    })
    return NextResponse.json(images)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
