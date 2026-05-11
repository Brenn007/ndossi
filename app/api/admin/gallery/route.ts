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
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauthorized()

  try {
    const body = await req.json()
    const { title, category, imageUrl, gradient } = body

    if (!title || !category) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const lastImage = await prisma.galleryImage.findFirst({
      orderBy: { order: 'desc' },
    })

    const image = await prisma.galleryImage.create({
      data: {
        title,
        category,
        imageUrl: imageUrl || '',
        gradient: gradient || 'gradient-1',
        order: (lastImage?.order ?? 0) + 1,
      },
    })

    return NextResponse.json(image, { status: 201 })
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

    await prisma.galleryImage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
