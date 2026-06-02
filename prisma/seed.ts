import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({ connectionString: process.env.DIRECT_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.reservation.deleteMany()
  await prisma.timeSlot.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.user.deleteMany()

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
  console.log('🎉 Seed complete — base de données vierge, prête à l\'emploi.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
