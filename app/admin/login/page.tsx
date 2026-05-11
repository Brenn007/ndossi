'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface LoginForm {
  email: string
  password: string
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="login-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 Q45 15 30 30 Q15 45 30 60" stroke="#C4622D" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-pattern)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-cream rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-terracotta" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-dark mb-1">
              ndossi_hair
            </h1>
            <p className="font-dm text-dark/50 text-sm">Espace Administration</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="font-dm text-sm text-dark/70 block mb-1.5">Email</label>
              <input
                {...register('email', {
                  required: 'Requis',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
                })}
                type="email"
                autoComplete="email"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white font-dm text-sm text-dark outline-none transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10',
                  errors.email ? 'border-red-400' : 'border-chocolate/15'
                )}
                placeholder="admin@ndossihair.fr"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-dm text-sm text-dark/70 block mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Requis', minLength: { value: 6, message: '6 caractères minimum' } })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={cn(
                    'w-full px-4 py-3 pr-11 rounded-xl border bg-white font-dm text-sm text-dark outline-none transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10',
                    errors.password ? 'border-red-400' : 'border-chocolate/15'
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 font-dm text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full bg-terracotta text-cream py-3.5 rounded-full font-dm text-sm tracking-wider uppercase flex items-center justify-center gap-3 hover:bg-terracotta-dark transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
