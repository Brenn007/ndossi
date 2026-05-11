import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Allow access to login page without session
  // All other admin pages require authentication
  // The check happens per-page for the login route

  return (
    <div className="min-h-screen bg-cream">
      {children}
    </div>
  )
}
