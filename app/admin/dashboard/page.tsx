'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  Image,
  LogOut,
  Plus,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Upload,
} from 'lucide-react'
import { format, isSameDay, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn, SERVICES } from '@/lib/utils'

type Tab = 'agenda' | 'disponibilites' | 'reservations' | 'galerie'

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  reservations: { id: string; firstName: string; lastName: string; service: string }[]
}

interface Reservation {
  id: string
  firstName: string
  lastName: string
  phone: string
  service: string
  message: string
  status: string
  timeSlot: TimeSlot
  createdAt: string
}

interface GalleryImage {
  id: string
  title: string
  category: string
  gradient: string
  imageUrl: string
  order: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('agenda')

  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotStart, setNewSlotStart] = useState('09:00')
  const [newSlotEnd, setNewSlotEnd] = useState('11:00')
  const [addingSlot, setAddingSlot] = useState(false)

  const [newImgTitle, setNewImgTitle] = useState('')
  const [newImgCategory, setNewImgCategory] = useState('femmes')
  const [newImgFile, setNewImgFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [addingImg, setAddingImg] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    setLoadingData(true)
    const fetches: Promise<any>[] = []
    if (activeTab === 'agenda' || activeTab === 'disponibilites') {
      fetches.push(fetch('/api/admin/timeslots').then(r => r.json()).then(setSlots))
    }
    if (activeTab === 'reservations') {
      fetches.push(fetch('/api/admin/reservations').then(r => r.json()).then(setReservations))
    }
    if (activeTab === 'galerie') {
      fetches.push(fetch('/api/admin/gallery').then(r => r.json()).then(setGallery))
    }
    Promise.all(fetches).finally(() => setLoadingData(false))
  }, [activeTab, status])

  const addSlot = async () => {
    if (!newSlotDate || !newSlotStart || !newSlotEnd) return
    setAddingSlot(true)
    try {
      const res = await fetch('/api/admin/timeslots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newSlotDate, startTime: newSlotStart, endTime: newSlotEnd }),
      })
      if (res.ok) {
        const slot = await res.json()
        setSlots(s => [...s, slot])
        setNewSlotDate('')
      }
    } finally {
      setAddingSlot(false)
    }
  }

  const deleteSlot = async (id: string) => {
    if (!confirm('Supprimer ce créneau ?')) return
    const res = await fetch(`/api/admin/timeslots?id=${id}`, { method: 'DELETE' })
    if (res.ok) setSlots(s => s.filter(sl => sl.id !== id))
    else res.json().then(d => alert(d.error))
  }

  const cancelReservation = async (id: string) => {
    if (!confirm('Annuler cette réservation ?')) return
    const res = await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'cancelled' }),
    })
    if (res.ok) setReservations(r => r.map(r2 => r2.id === id ? { ...r2, status: 'cancelled' } : r2))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setNewImgFile(file)
    setUploadError(null)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const clearFile = () => {
    setNewImgFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const addImage = async () => {
    if (!newImgTitle || !newImgFile) return
    setAddingImg(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', newImgFile)
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setUploadError(uploadData.error ?? "Erreur lors de l'upload")
        return
      }
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newImgTitle, category: newImgCategory, imageUrl: uploadData.url }),
      })
      if (res.ok) {
        const img = await res.json()
        setGallery(g => [...g, img])
        setNewImgTitle('')
        clearFile()
      }
    } finally {
      setAddingImg(false)
    }
  }

  const deleteImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
    if (res.ok) setGallery(g => g.filter(img => img.id !== id))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 size={32} className="animate-spin text-terracotta" />
      </div>
    )
  }

  if (!session) return null

  const tabs = [
    { id: 'agenda' as Tab, label: 'Agenda', icon: Calendar },
    { id: 'disponibilites' as Tab, label: 'Dispo', icon: Clock },
    { id: 'reservations' as Tab, label: 'Réservations', icon: Users },
    { id: 'galerie' as Tab, label: 'Galerie', icon: Image },
  ]

  const today = startOfDay(new Date())
  const upcomingSlots = slots
    .filter(s => new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const pastSlots = slots
    .filter(s => new Date(s.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Header ── */}
      <header className="bg-dark text-cream px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="font-playfair text-base sm:text-lg font-bold">ndossi_hair</span>
          <span className="text-cream/40 font-dm text-xs hidden xs:block">Administration</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-dm text-sm text-cream/60 hidden sm:block">{session.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-1.5 text-cream/50 hover:text-cream font-dm text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
          >
            <LogOut size={15} />
            <span className="hidden sm:block text-xs">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-5 sm:py-8">

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-dm text-xs sm:text-sm transition-all duration-200 whitespace-nowrap shrink-0',
                  active
                    ? 'bg-terracotta text-cream shadow-sm'
                    : 'bg-white text-dark/60 hover:text-terracotta border border-chocolate/10'
                )}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── Loading ── */}
        {loadingData && (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-terracotta" />
          </div>
        )}

        {/* ══════════════════════════════
            Tab : Agenda
        ══════════════════════════════ */}
        {activeTab === 'agenda' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-dark mb-5">Agenda</h2>

            <div className="space-y-2.5">
              {upcomingSlots.length === 0 && (
                <div className="text-center py-12 text-dark/40 font-dm text-sm">
                  Aucun créneau à venir.{' '}
                  <button
                    className="text-terracotta underline underline-offset-2"
                    onClick={() => setActiveTab('disponibilites')}
                  >
                    Ajouter des disponibilités
                  </button>
                </div>
              )}
              {upcomingSlots.map(slot => {
                const slotDate = new Date(slot.date)
                const isToday = isSameDay(slotDate, today)
                const hasReservation = slot.reservations?.length > 0
                return (
                  <div
                    key={slot.id}
                    className={cn(
                      'p-3.5 sm:p-4 rounded-xl border',
                      hasReservation ? 'bg-terracotta/5 border-terracotta/20' : 'bg-white border-chocolate/10'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                        isToday ? 'bg-terracotta text-cream' : 'bg-cream text-dark/50'
                      )}>
                        <span className="font-playfair font-bold text-sm">{format(slotDate, 'd')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm font-medium text-dark text-sm">
                          {format(slotDate, 'EEE d MMM yyyy', { locale: fr })}
                        </p>
                        <p className="font-dm text-dark/50 text-xs mt-0.5">
                          {slot.startTime} – {slot.endTime}
                        </p>
                        {hasReservation ? (
                          <div className="mt-2 inline-flex items-center bg-terracotta/10 text-terracotta font-dm text-xs px-2.5 py-1 rounded-lg max-w-full">
                            <span className="truncate">
                              {slot.reservations[0].firstName} {slot.reservations[0].lastName} · {slot.reservations[0].service}
                            </span>
                          </div>
                        ) : (
                          <span className="mt-1.5 inline-block font-dm text-xs text-dark/40 bg-cream px-2.5 py-1 rounded-lg border border-chocolate/10">
                            Libre
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {pastSlots.length > 0 && (
              <details className="mt-8">
                <summary className="font-dm text-sm text-dark/40 cursor-pointer hover:text-dark/60 transition-colors">
                  Créneaux passés ({pastSlots.length})
                </summary>
                <div className="space-y-2 mt-3">
                  {pastSlots.slice(0, 5).map(slot => (
                    <div key={slot.id} className="p-3 rounded-xl border border-chocolate/5 bg-white/50 opacity-60">
                      <p className="font-dm text-sm text-dark/50">
                        {format(new Date(slot.date), 'EEE d MMM yyyy', { locale: fr })} · {slot.startTime}–{slot.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════
            Tab : Disponibilités
        ══════════════════════════════ */}
        {activeTab === 'disponibilites' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-dark mb-5">Disponibilités</h2>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-chocolate/10 p-4 sm:p-6 mb-6">
              <h3 className="font-dm font-semibold text-dark mb-4 text-sm sm:text-base">Ajouter un créneau</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="font-dm text-xs text-dark/50 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={e => setNewSlotDate(e.target.value)}
                    min={format(today, 'yyyy-MM-dd')}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Début</label>
                  <input
                    type="time"
                    value={newSlotStart}
                    onChange={e => setNewSlotStart(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Fin</label>
                  <input
                    type="time"
                    value={newSlotEnd}
                    onChange={e => setNewSlotEnd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <button
                    onClick={addSlot}
                    disabled={!newSlotDate || addingSlot}
                    className="w-full bg-terracotta text-cream px-4 py-2.5 rounded-xl font-dm text-sm flex items-center justify-center gap-2 hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingSlot ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Slots list */}
            <div className="space-y-2">
              {slots.length === 0 && (
                <p className="text-center py-8 text-dark/40 font-dm text-sm">Aucun créneau pour le moment.</p>
              )}
              {slots
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(slot => {
                  const hasReservation = slot.reservations?.length > 0
                  return (
                    <div key={slot.id} className="flex items-center justify-between gap-2 p-3.5 bg-white rounded-xl border border-chocolate/10">
                      <div className="flex-1 min-w-0">
                        <p className="font-dm text-sm font-medium text-dark truncate">
                          {format(new Date(slot.date), 'EEE d MMM yyyy', { locale: fr })}
                        </p>
                        <p className="font-dm text-xs text-dark/50 mt-0.5">
                          {slot.startTime} – {slot.endTime}
                          {hasReservation && (
                            <span className="text-terracotta ml-1 truncate">
                              · {slot.reservations[0].firstName} {slot.reservations[0].lastName}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn(
                          'font-dm text-xs px-2 py-1 rounded-lg whitespace-nowrap',
                          slot.isAvailable && !hasReservation
                            ? 'bg-green-50 text-green-600'
                            : 'bg-terracotta/10 text-terracotta'
                        )}>
                          {slot.isAvailable && !hasReservation ? 'Libre' : 'Réservé'}
                        </span>
                        {!hasReservation && (
                          <button
                            onClick={() => deleteSlot(slot.id)}
                            className="p-2 text-dark/30 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════
            Tab : Réservations
        ══════════════════════════════ */}
        {activeTab === 'reservations' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-dark mb-5">Réservations</h2>

            <div className="space-y-3">
              {reservations.length === 0 && (
                <p className="text-center py-8 text-dark/40 font-dm text-sm">Aucune réservation.</p>
              )}
              {reservations.map(res => (
                <div
                  key={res.id}
                  className={cn(
                    'p-4 sm:p-5 bg-white rounded-2xl border transition-all duration-200',
                    res.status === 'cancelled'
                      ? 'border-chocolate/5 opacity-50'
                      : 'border-chocolate/10'
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-playfair font-bold text-dark text-base">
                        {res.firstName} {res.lastName}
                      </h3>
                      <span className={cn(
                        'font-dm text-xs px-2 py-0.5 rounded-full',
                        res.status === 'confirmed'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-dark/5 text-dark/40'
                      )}>
                        {res.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                      </span>
                    </div>
                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="shrink-0 flex items-center gap-1.5 text-red-400 hover:text-red-600 font-dm text-xs border border-red-100 hover:border-red-200 px-2.5 py-1.5 rounded-xl transition-colors bg-red-50 hover:bg-red-100"
                      >
                        <X size={11} />
                        <span className="hidden xs:block">Annuler</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-dm text-sm text-dark/70">
                      <span className="text-dark/40">Service :</span> {res.service}
                    </p>
                    <p className="font-dm text-sm text-dark/70">
                      <span className="text-dark/40">Tél :</span> {res.phone}
                    </p>
                    {res.timeSlot && (
                      <p className="font-dm text-sm text-dark/70">
                        <span className="text-dark/40">Créneau :</span>{' '}
                        {format(new Date(res.timeSlot.date), 'EEE d MMM yyyy', { locale: fr })} · {res.timeSlot.startTime}–{res.timeSlot.endTime}
                      </p>
                    )}
                    {res.message && (
                      <p className="font-dm text-sm text-dark/50 italic mt-1">&ldquo;{res.message}&rdquo;</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════
            Tab : Galerie
        ══════════════════════════════ */}
        {activeTab === 'galerie' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-dark mb-5">Galerie</h2>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-chocolate/10 p-4 sm:p-6 mb-6">
              <h3 className="font-dm font-semibold text-dark mb-4 text-sm sm:text-base">Ajouter une image</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Titre</label>
                  <input
                    value={newImgTitle}
                    onChange={e => setNewImgTitle(e.target.value)}
                    placeholder="Box Braids..."
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Catégorie</label>
                  <select
                    value={newImgCategory}
                    onChange={e => setNewImgCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  >
                    <option value="femmes">Femmes</option>
                    <option value="hommes">Hommes</option>
                  </select>
                </div>
              </div>

              {/* File picker */}
              <div className="mb-4">
                <label className="font-dm text-xs text-dark/50 block mb-2">
                  Photo <span className="text-dark/30">(JPG, PNG, WebP — max 5 Mo)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="gallery-file-input"
                />

                {!previewUrl ? (
                  <label
                    htmlFor="gallery-file-input"
                    className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-chocolate/20 bg-cream hover:border-terracotta/40 hover:bg-terracotta/5 cursor-pointer transition-colors"
                  >
                    <Upload size={20} className="text-dark/30 mb-1.5" />
                    <span className="font-dm text-xs text-dark/40">Appuyer pour choisir une photo</span>
                  </label>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden border border-chocolate/10">
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-dm text-sm text-dark/70 font-medium truncate">{newImgFile?.name}</p>
                      <p className="font-dm text-xs text-dark/40 mt-0.5">
                        {newImgFile ? (newImgFile.size / 1024).toFixed(0) : 0} Ko
                      </p>
                      <button
                        onClick={clearFile}
                        className="mt-2 text-xs text-red-400 hover:text-red-600 font-dm flex items-center gap-1"
                      >
                        <X size={10} /> Retirer
                      </button>
                    </div>
                    <label
                      htmlFor="gallery-file-input"
                      className="shrink-0 text-xs text-terracotta font-dm border border-terracotta/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-terracotta/5 transition-colors"
                    >
                      Changer
                    </label>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="font-dm text-xs text-red-500 mb-3 flex items-center gap-1.5">
                  <AlertCircle size={12} /> {uploadError}
                </p>
              )}

              <button
                onClick={addImage}
                disabled={!newImgTitle || !newImgFile || addingImg}
                className="w-full sm:w-auto bg-terracotta text-cream px-6 py-3 rounded-xl font-dm text-sm flex items-center justify-center gap-2 hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingImg ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {addingImg ? 'Upload en cours...' : 'Ajouter à la galerie'}
              </button>
            </div>

            {/* Gallery grid */}
            {gallery.length === 0 ? (
              <p className="text-center py-8 text-dark/40 font-dm text-sm">Aucune image dans la galerie.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {gallery.map(img => (
                  <div key={img.id} className="relative rounded-2xl overflow-hidden bg-dark/5" style={{ height: 160 }}>
                    {img.imageUrl ? (
                      <img src={img.imageUrl} alt={img.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className={`absolute inset-0 ${img.gradient}`} />
                    )}
                    <div className="absolute inset-0 bg-dark/25" />
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <span className="bg-dark/40 text-cream/90 font-dm text-xs px-2 py-0.5 rounded-lg backdrop-blur-sm leading-5">
                          {img.category === 'femmes' ? 'Femmes' : 'Hommes'}
                        </span>
                        {/* Delete button always visible on mobile */}
                        <button
                          onClick={() => deleteImage(img.id)}
                          className="w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors shrink-0"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                      <p className="font-playfair text-cream font-bold text-xs leading-tight">{img.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  )
}
