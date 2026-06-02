import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns'
import * as dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({ connectionString: process.env.DIRECT_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.reservation.deleteMany()
  await prisma.timeSlot.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    12
  )
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@ndossihair.fr',
      password: hashedPassword,
      name: 'Ndossi Admin',
      role: 'admin',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create time slots — 10 slots over 2 weeks
  const today = startOfDay(new Date())
  const slots = [
    { dayOffset: 1, startHour: 9, startMin: 0, endHour: 11, endMin: 0 },
    { dayOffset: 1, startHour: 14, startMin: 0, endHour: 16, endMin: 0 },
    { dayOffset: 2, startHour: 10, startMin: 0, endHour: 12, endMin: 0 },
    { dayOffset: 3, startHour: 9, startMin: 0, endHour: 11, endMin: 0 },
    { dayOffset: 3, startHour: 15, startMin: 0, endHour: 17, endMin: 0 },
    { dayOffset: 5, startHour: 10, startMin: 0, endHour: 12, endMin: 0 },
    { dayOffset: 6, startHour: 14, startMin: 0, endHour: 16, endMin: 0 },
    { dayOffset: 8, startHour: 9, startMin: 0, endHour: 11, endMin: 0 },
    { dayOffset: 10, startHour: 11, startMin: 0, endHour: 13, endMin: 0 },
    { dayOffset: 12, startHour: 10, startMin: 0, endHour: 12, endMin: 0 },
  ]

  const createdSlots = []
  for (const slot of slots) {
    const slotDate = addDays(today, slot.dayOffset)
    const startDateTime = setMinutes(setHours(slotDate, slot.startHour), slot.startMin)
    const ts = await prisma.timeSlot.create({
      data: {
        date: slotDate,
        startTime: `${String(slot.startHour).padStart(2, '0')}:${String(slot.startMin).padStart(2, '0')}`,
        endTime: `${String(slot.endHour).padStart(2, '0')}:${String(slot.endMin).padStart(2, '0')}`,
        isAvailable: true,
      },
    })
    createdSlots.push(ts)
  }
  console.log(`✅ ${createdSlots.length} time slots created`)

  // Create 3 sample reservations
  const sampleReservations = [
    {
      firstName: 'Aminata',
      lastName: 'Diallo',
      phone: '06 12 34 56 78',
      service: 'Box Braids',
      message: 'Je souhaite des box braids mi-longues en marron',
      status: 'confirmed',
      timeSlotId: createdSlots[0].id,
    },
    {
      firstName: 'Fatou',
      lastName: 'Kouyaté',
      phone: '07 98 76 54 32',
      service: 'Tresses Collées',
      message: '',
      status: 'confirmed',
      timeSlotId: createdSlots[2].id,
    },
    {
      firstName: 'Mariam',
      lastName: 'Touré',
      phone: '06 55 44 33 22',
      service: 'Vanilles',
      message: 'Vanilles longues, extension noire naturelle',
      status: 'confirmed',
      timeSlotId: createdSlots[4].id,
    },
  ]

  for (const res of sampleReservations) {
    await prisma.reservation.create({ data: res })
    // Mark slot as unavailable
    await prisma.timeSlot.update({
      where: { id: res.timeSlotId },
      data: { isAvailable: false },
    })
  }
  console.log('✅ 3 sample reservations created')

  // Create 6 gallery images
  const galleryImages = [
    {
      title: 'Box Braids Longues',
      category: 'femmes',
      imageUrl: '',
      gradient: 'gradient-1',
      order: 1,
    },
    {
      title: 'Tresses Collées Élégantes',
      category: 'femmes',
      imageUrl: '',
      gradient: 'gradient-2',
      order: 2,
    },
    {
      title: 'Vanilles Naturelles',
      category: 'femmes',
      imageUrl: '',
      gradient: 'gradient-3',
      order: 3,
    },
    {
      title: 'Cornrows Géométriques',
      category: 'hommes',
      imageUrl: '',
      gradient: 'gradient-4',
      order: 4,
    },
    {
      title: 'Locks Débutantes',
      category: 'femmes',
      imageUrl: '',
      gradient: 'gradient-5',
      order: 5,
    },
    {
      title: 'Tresses Homme Stylé',
      category: 'hommes',
      imageUrl: '',
      gradient: 'gradient-6',
      order: 6,
    },
  ]

  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img })
  }
  console.log('✅ 6 gallery images created')

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
