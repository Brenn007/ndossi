'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { format, isSameDay, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { cn, SERVICES } from '@/lib/utils'

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface FormData {
  firstName: string
  lastName: string
  phone: string
  service: string
  message: string
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  // Convert Sunday (0) to 7 for Monday-first calendar
  return day === 0 ? 6 : day - 1
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function ReserverPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const shouldReduce = useReducedMotion()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    fetch('/api/timeslots')
      .then((r) => r.json())
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [])

  const slotsForDate = (date: Date) =>
    slots.filter((s) => isSameDay(new Date(s.date), date))

  const hasAvailableSlotOnDate = (date: Date) =>
    slotsForDate(date).some((s) => s.isAvailable)

  const hasSlotOnDate = (date: Date) =>
    slotsForDate(date).length > 0

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const onSubmit = async (data: FormData) => {
    if (!selectedSlot) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, timeSlotId: selectedSlot.id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur')
      setSuccess(true)
      reset()
      setSelectedDate(null)
      setSelectedSlot(null)
      // Refresh slots
      const refreshed = await fetch('/api/timeslots').then(r => r.json())
      setSlots(refreshed)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const today = startOfDay(new Date())

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Hero banner */}
      <div className="relative bg-dark pt-28 pb-16 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="rsv-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#D4A853" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rsv-pattern)" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold font-dm text-xs tracking-[0.3em] uppercase">Réservation en ligne</span>
              <div className="w-8 h-px bg-gold" />
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl text-cream font-bold mb-4">
              Prendre rendez-vous
            </h1>
            <p className="font-dm text-cream/60 text-lg max-w-lg mx-auto">
              Choisissez votre créneau parmi les disponibilités, puis remplissez le formulaire.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success screen */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm"
            >
              <motion.div
                className="bg-cream rounded-3xl p-12 max-w-md text-center mx-4"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Animated checkmark */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center">
                    <motion.svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <motion.path
                        d="M8 20 L16 28 L32 12"
                        stroke="#C4622D"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }}
                      />
                    </motion.svg>
                  </div>
                </div>
                <h2 className="font-playfair text-2xl text-dark font-bold mb-3">
                  Réservation confirmée !
                </h2>
                <p className="font-dm text-dark/60 mb-8">
                  Votre rendez-vous a bien été enregistré. Merci et à très bientôt chez ndossi_hair !
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-terracotta text-cream px-8 py-3 rounded-full font-dm text-sm tracking-wider uppercase hover:bg-terracotta-dark transition-colors duration-300"
                >
                  Fermer
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-2xl text-dark font-bold mb-6">Choisissez une date</h2>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-chocolate/5 p-6">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-cream rounded-lg transition-colors duration-200 text-dark/50 hover:text-terracotta"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="font-playfair text-lg font-bold text-dark">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-cream rounded-lg transition-colors duration-200 text-dark/50 hover:text-terracotta"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center font-dm text-xs text-dark/40 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for first day */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const date = new Date(currentYear, currentMonth, day)
                  const isPast = date < today
                  const hasSlotsAvailable = hasAvailableSlotOnDate(date)
                  const hasSlotsAll = hasSlotOnDate(date)
                  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
                  const isToday = isSameDay(date, today)

                  return (
                    <motion.button
                      key={day}
                      whileHover={!isPast && hasSlotsAvailable && !shouldReduce ? { scale: 1.1 } : {}}
                      whileTap={!isPast && hasSlotsAvailable && !shouldReduce ? { scale: 0.95 } : {}}
                      onClick={() => {
                        if (!isPast && hasSlotsAvailable) {
                          setSelectedDate(date)
                          setSelectedSlot(null)
                        }
                      }}
                      disabled={isPast || !hasSlotsAvailable}
                      className={cn(
                        'aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-dm transition-all duration-200 relative',
                        isSelected && 'bg-terracotta text-cream',
                        !isSelected && !isPast && hasSlotsAvailable && 'hover:bg-terracotta/10 text-dark hover:text-terracotta',
                        !isSelected && !isPast && !hasSlotsAvailable && hasSlotsAll && 'text-dark/30',
                        isPast && 'text-dark/20',
                        !isPast && !hasSlotsAll && 'text-dark/40',
                        isToday && !isSelected && 'font-bold text-terracotta',
                      )}
                    >
                      <span>{day}</span>
                      {!isPast && hasSlotsAvailable && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-terracotta" />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-chocolate/5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-terracotta" />
                  <span className="font-dm text-xs text-dark/50">Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-dark/20" />
                  <span className="font-dm text-xs text-dark/50">Complet / Passé</span>
                </div>
              </div>
            </div>

            {/* Time slots for selected date */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <h3 className="font-playfair text-lg font-bold text-dark mb-4">
                    Créneaux du {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {slotsForDate(selectedDate).map((slot) => (
                      <motion.button
                        key={slot.id}
                        whileHover={slot.isAvailable && !shouldReduce ? { scale: 1.02 } : {}}
                        whileTap={slot.isAvailable && !shouldReduce ? { scale: 0.98 } : {}}
                        onClick={() => slot.isAvailable && setSelectedSlot(slot)}
                        disabled={!slot.isAvailable}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all duration-200',
                          selectedSlot?.id === slot.id
                            ? 'border-terracotta bg-terracotta/5'
                            : slot.isAvailable
                            ? 'border-chocolate/10 hover:border-terracotta/30 bg-white'
                            : 'border-chocolate/5 bg-dark/3 opacity-50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {selectedSlot?.id === slot.id && (
                            <Check size={14} className="text-terracotta shrink-0" />
                          )}
                          <div>
                            <div className="font-dm font-medium text-dark text-sm">
                              {slot.startTime} – {slot.endTime}
                            </div>
                            <div className={cn(
                              'font-dm text-xs mt-0.5',
                              slot.isAvailable ? 'text-terracotta' : 'text-dark/30'
                            )}>
                              {slot.isAvailable ? 'Disponible' : 'Réservé'}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="font-playfair text-2xl text-dark font-bold mb-6">Vos informations</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Selected slot summary */}
              <AnimatePresence>
                {selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-terracotta/5 border border-terracotta/20 rounded-xl p-4"
                  >
                    <p className="font-dm text-sm text-dark/70">Créneau sélectionné :</p>
                    <p className="font-playfair font-bold text-terracotta mt-1">
                      {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                    <p className="font-dm text-dark text-sm">
                      {selectedSlot.startTime} – {selectedSlot.endTime}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* First name + last name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-dm text-sm text-dark/70 block mb-1.5">Prénom *</label>
                  <input
                    {...register('firstName', { required: 'Requis' })}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border bg-white font-dm text-sm text-dark outline-none transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10',
                      errors.firstName ? 'border-red-400' : 'border-chocolate/15'
                    )}
                    placeholder="Aminata"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="font-dm text-sm text-dark/70 block mb-1.5">Nom *</label>
                  <input
                    {...register('lastName', { required: 'Requis' })}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border bg-white font-dm text-sm text-dark outline-none transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10',
                      errors.lastName ? 'border-red-400' : 'border-chocolate/15'
                    )}
                    placeholder="Diallo"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="font-dm text-sm text-dark/70 block mb-1.5">Téléphone *</label>
                <input
                  {...register('phone', {
                    required: 'Requis',
                    pattern: { value: /^[0-9 +\-().]{8,20}$/, message: 'Numéro invalide' },
                  })}
                  type="tel"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white font-dm text-sm text-dark outline-none transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10',
                    errors.phone ? 'border-red-400' : 'border-chocolate/15'
                  )}
                  placeholder="06 12 34 56 78"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Service */}
              <div>
                <label className="font-dm text-sm text-dark/70 block mb-1.5">Type de prestation *</label>
                <select
                  {...register('service', { required: 'Requis' })}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white font-dm text-sm text-dark outline-none transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10',
                    errors.service ? 'border-red-400' : 'border-chocolate/15'
                  )}
                >
                  <option value="">Sélectionner...</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="font-dm text-sm text-dark/70 block mb-1.5">Message (optionnel)</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-chocolate/15 bg-white font-dm text-sm text-dark outline-none transition-all duration-200 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 resize-none"
                  placeholder="Précisez votre style, longueur souhaitée..."
                />
              </div>

              {/* Error message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 font-dm text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting || !selectedSlot}
                whileHover={!submitting && selectedSlot && !shouldReduce ? { scale: 1.02 } : {}}
                whileTap={!submitting && selectedSlot && !shouldReduce ? { scale: 0.98 } : {}}
                className={cn(
                  'w-full py-4 rounded-full font-dm text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3',
                  selectedSlot && !submitting
                    ? 'bg-terracotta text-cream hover:bg-terracotta-dark'
                    : 'bg-dark/10 text-dark/30 cursor-not-allowed'
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  selectedSlot ? 'Confirmer la réservation' : 'Sélectionnez un créneau'
                )}
              </motion.button>

              <p className="font-dm text-xs text-dark/40 text-center">
                * Champs obligatoires. Aucune confirmation par email n&apos;est envoyée.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
