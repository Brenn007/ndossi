'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  Image,
  LogOut,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Check,
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

const GRADIENTS = [
  { value: 'gradient-1', label: 'Terracotta → Or' },
  { value: 'gradient-2', label: 'Sombre → Terracotta' },
  { value: 'gradient-3', label: 'Terracotta → Crème' },
  { value: 'gradient-4', label: 'Chocolat → Sombre' },
  { value: 'gradient-5', label: 'Or → Chocolat' },
  { value: 'gradient-6', label: 'Sombre → Or' },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('agenda')

  // Data states
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // New slot form
  const [newSlotDate, setNewSlotDate] = useState('')
  const [newSlotStart, setNewSlotStart] = useState('09:00')
  const [newSlotEnd, setNewSlotEnd] = useState('11:00')
  const [addingSlot, setAddingSlot] = useState(false)

  // New gallery form
  const [newImgTitle, setNewImgTitle] = useState('')
  const [newImgCategory, setNewImgCategory] = useState('femmes')
  const [newImgFile, setNewImgFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [addingImg, setAddingImg] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Load data on tab change
  useEffect(() => {
    if (status !== 'authenticated') return
    setLoadingData(true)
    const fetches: Promise<any>[] = []

    if (activeTab === 'agenda' || activeTab === 'disponibilites') {
      fetches.push(
        fetch('/api/admin/timeslots').then(r => r.json()).then(setSlots)
      )
    }
    if (activeTab === 'reservations') {
      fetches.push(
        fetch('/api/admin/reservations').then(r => r.json()).then(setReservations)
      )
    }
    if (activeTab === 'galerie') {
      fetches.push(
        fetch('/api/admin/gallery').then(r => r.json()).then(setGallery)
      )
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
        setSlots((s) => [...s, slot])
        setNewSlotDate('')
      }
    } finally {
      setAddingSlot(false)
    }
  }

  const deleteSlot = async (id: string) => {
    if (!confirm('Supprimer ce créneau ?')) return
    const res = await fetch(`/api/admin/timeslots?id=${id}`, { method: 'DELETE' })
    if (res.ok) setSlots((s) => s.filter((sl) => sl.id !== id))
    else {
      const err = await res.json()
      alert(err.error)
    }
  }

  const cancelReservation = async (id: string) => {
    if (!confirm('Annuler cette réservation ?')) return
    const res = await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'cancelled' }),
    })
    if (res.ok) {
      setReservations((r) => r.map((res) => res.id === id ? { ...res, status: 'cancelled' } : res))
    }
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

  const addImage = async () => {
    if (!newImgTitle || !newImgFile) return
    setAddingImg(true)
    setUploadError(null)
    try {
      // 1. Upload file
      const fd = new FormData()
      fd.append('file', newImgFile)
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setUploadError(uploadData.error ?? "Erreur lors de l'upload")
        return
      }

      // 2. Create gallery entry
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newImgTitle, category: newImgCategory, imageUrl: uploadData.url }),
      })
      if (res.ok) {
        const img = await res.json()
        setGallery((g) => [...g, img])
        setNewImgTitle('')
        setNewImgFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } finally {
      setAddingImg(false)
    }
  }

  const deleteImage = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
    if (res.ok) setGallery((g) => g.filter((img) => img.id !== id))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-terracotta" />
      </div>
    )
  }

  if (!session) return null

  const tabs = [
    { id: 'agenda' as Tab, label: 'Agenda', icon: Calendar },
    { id: 'disponibilites' as Tab, label: 'Disponibilités', icon: Clock },
    { id: 'reservations' as Tab, label: 'Réservations', icon: Users },
    { id: 'galerie' as Tab, label: 'Galerie', icon: Image },
  ]

  const today = startOfDay(new Date())
  const upcomingSlots = slots.filter((s) => new Date(s.date) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const pastSlots = slots.filter((s) => new Date(s.date) < today).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-dark text-cream px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <span className="font-playfair text-lg font-bold">ndossi_hair</span>
          <span className="text-cream/40 font-dm text-xs ml-3">Administration</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-dm text-sm text-cream/60 hidden sm:block">{session.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 text-cream/50 hover:text-cream text-sm font-dm transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-full font-dm text-sm transition-all duration-200 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-terracotta text-cream'
                    : 'bg-white text-dark/60 hover:text-terracotta border border-chocolate/10'
                )}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {loadingData && (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-terracotta" />
          </div>
        )}

        {/* Tab: Agenda */}
        {activeTab === 'agenda' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-2xl font-bold text-dark mb-6">Agenda</h2>

            <div className="space-y-3">
              {upcomingSlots.length === 0 && (
                <div className="text-center py-12 text-dark/40 font-dm">
                  Aucun créneau à venir. Allez dans &quot;Disponibilités&quot; pour en ajouter.
                </div>
              )}
              {upcomingSlots.map((slot) => {
                const slotDate = new Date(slot.date)
                const isToday = isSameDay(slotDate, today)
                const hasReservation = slot.reservations && slot.reservations.length > 0
                return (
                  <div
                    key={slot.id}
                    className={cn(
                      'p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                      hasReservation ? 'bg-terracotta/5 border-terracotta/20' : 'bg-white border-chocolate/10'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                        isToday ? 'bg-terracotta text-cream' : 'bg-cream text-dark/50'
                      )}>
                        <span className="font-playfair font-bold text-sm">
                          {format(slotDate, 'd')}
                        </span>
                      </div>
                      <div>
                        <p className="font-dm font-medium text-dark text-sm">
                          {format(slotDate, 'EEEE d MMMM yyyy', { locale: fr })}
                        </p>
                        <p className="font-dm text-dark/50 text-xs">
                          {slot.startTime} – {slot.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {hasReservation ? (
                        <div className="bg-terracotta/10 text-terracotta font-dm text-xs px-3 py-1.5 rounded-lg">
                          {slot.reservations[0].firstName} {slot.reservations[0].lastName} — {slot.reservations[0].service}
                        </div>
                      ) : (
                        <span className="font-dm text-xs text-dark/40 bg-cream px-3 py-1.5 rounded-lg border border-chocolate/10">
                          Libre
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {pastSlots.length > 0 && (
              <details className="mt-8">
                <summary className="font-dm text-sm text-dark/40 cursor-pointer hover:text-dark/60 transition-colors mb-4">
                  Créneaux passés ({pastSlots.length})
                </summary>
                <div className="space-y-2 mt-3">
                  {pastSlots.slice(0, 5).map((slot) => (
                    <div key={slot.id} className="p-4 rounded-xl border border-chocolate/5 bg-white/50 opacity-60">
                      <p className="font-dm text-sm text-dark/50">
                        {format(new Date(slot.date), 'EEEE d MMMM yyyy', { locale: fr })} — {slot.startTime} – {slot.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </motion.div>
        )}

        {/* Tab: Disponibilités */}
        {activeTab === 'disponibilites' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-2xl font-bold text-dark mb-6">Gérer les disponibilités</h2>

            {/* Add slot form */}
            <div className="bg-white rounded-2xl border border-chocolate/10 p-6 mb-8">
              <h3 className="font-dm font-semibold text-dark mb-4">Ajouter un créneau</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    min={format(today, 'yyyy-MM-dd')}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Début</label>
                  <input
                    type="time"
                    value={newSlotStart}
                    onChange={(e) => setNewSlotStart(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Fin</label>
                  <input
                    type="time"
                    value={newSlotEnd}
                    onChange={(e) => setNewSlotEnd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div className="flex items-end">
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
                <p className="text-center py-8 text-dark/40 font-dm">Aucun créneau pour le moment.</p>
              )}
              {slots
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((slot) => {
                  const hasReservation = slot.reservations && slot.reservations.length > 0
                  return (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-chocolate/10"
                    >
                      <div>
                        <p className="font-dm text-sm font-medium text-dark">
                          {format(new Date(slot.date), 'EEEE d MMMM yyyy', { locale: fr })}
                        </p>
                        <p className="font-dm text-xs text-dark/50">
                          {slot.startTime} – {slot.endTime}
                          {hasReservation && (
                            <span className="ml-2 text-terracotta">
                              · Réservé par {slot.reservations[0].firstName} {slot.reservations[0].lastName}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'font-dm text-xs px-2 py-1 rounded-lg',
                          slot.isAvailable && !hasReservation ? 'bg-green-50 text-green-600' : 'bg-terracotta/10 text-terracotta'
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

        {/* Tab: Réservations */}
        {activeTab === 'reservations' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-2xl font-bold text-dark mb-6">Réservations</h2>

            <div className="space-y-3">
              {reservations.length === 0 && (
                <p className="text-center py-8 text-dark/40 font-dm">Aucune réservation.</p>
              )}
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className={cn(
                    'p-5 bg-white rounded-2xl border transition-all duration-200',
                    res.status === 'cancelled'
                      ? 'border-chocolate/5 opacity-50'
                      : 'border-chocolate/10 hover:border-terracotta/20'
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-playfair font-bold text-dark">
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
                      <div className="space-y-1">
                        <p className="font-dm text-sm text-dark/70">
                          <span className="text-dark/40">Service :</span> {res.service}
                        </p>
                        <p className="font-dm text-sm text-dark/70">
                          <span className="text-dark/40">Tel :</span> {res.phone}
                        </p>
                        {res.timeSlot && (
                          <p className="font-dm text-sm text-dark/70">
                            <span className="text-dark/40">Créneau :</span>{' '}
                            {format(new Date(res.timeSlot.date), 'EEEE d MMMM yyyy', { locale: fr })} — {res.timeSlot.startTime}–{res.timeSlot.endTime}
                          </p>
                        )}
                        {res.message && (
                          <p className="font-dm text-sm text-dark/50 italic mt-1">&ldquo;{res.message}&rdquo;</p>
                        )}
                      </div>
                    </div>
                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-600 font-dm text-xs border border-red-100 hover:border-red-200 px-3 py-2 rounded-xl transition-colors bg-red-50 hover:bg-red-100"
                      >
                        <X size={12} />
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab: Galerie */}
        {activeTab === 'galerie' && !loadingData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-playfair text-2xl font-bold text-dark mb-6">Gérer la galerie</h2>

            {/* Add image form */}
            <div className="bg-white rounded-2xl border border-chocolate/10 p-6 mb-8">
              <h3 className="font-dm font-semibold text-dark mb-4">Ajouter une image</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Titre</label>
                  <input
                    value={newImgTitle}
                    onChange={(e) => setNewImgTitle(e.target.value)}
                    placeholder="Box Braids..."
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="font-dm text-xs text-dark/50 block mb-1">Catégorie</label>
                  <select
                    value={newImgCategory}
                    onChange={(e) => setNewImgCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-chocolate/15 bg-cream font-dm text-sm text-dark outline-none focus:border-terracotta"
                  >
                    <option value="femmes">Femmes</option>
                    <option value="hommes">Hommes</option>
                  </select>
                </div>
              </div>

              {/* File picker */}
              <div className="mb-4">
                <label className="font-dm text-xs text-dark/50 block mb-1">Photo (JPG, PNG, WebP — max 5 Mo)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="gallery-file-input"
                />
                <div className="flex items-start gap-4">
                  <label
                    htmlFor="gallery-file-input"
                    className={cn(
                      'flex flex-col items-center justify-center w-40 h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
                      previewUrl
                        ? 'border-terracotta/40 bg-terracotta/5'
                        : 'border-chocolate/20 bg-cream hover:border-terracotta/40 hover:bg-terracotta/5'
                    )}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <Upload size={20} className="text-dark/30 mb-1" />
                        <span className="font-dm text-xs text-dark/40 text-center px-2">Cliquer pour choisir</span>
                      </>
                    )}
                  </label>
                  {newImgFile && (
                    <div className="flex flex-col justify-center gap-1 pt-1">
                      <p className="font-dm text-xs text-dark/70 font-medium">{newImgFile.name}</p>
                      <p className="font-dm text-xs text-dark/40">{(newImgFile.size / 1024).toFixed(0)} Ko</p>
                      <button
                        onClick={() => { setNewImgFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                        className="text-xs text-red-400 hover:text-red-600 font-dm flex items-center gap-1 mt-1"
                      >
                        <X size={10} /> Retirer
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {uploadError && (
                <p className="font-dm text-xs text-red-500 mb-3 flex items-center gap-1">
                  <AlertCircle size={12} /> {uploadError}
                </p>
              )}

              <button
                onClick={addImage}
                disabled={!newImgTitle || !newImgFile || addingImg}
                className="bg-terracotta text-cream px-6 py-2.5 rounded-xl font-dm text-sm flex items-center gap-2 hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingImg ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {addingImg ? 'Upload en cours...' : 'Ajouter à la galerie'}
              </button>
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.length === 0 && (
                <p className="col-span-3 text-center py-8 text-dark/40 font-dm">
                  Aucune image dans la galerie.
                </p>
              )}
              {gallery.map((img) => (
                <div key={img.id} className="relative group rounded-2xl overflow-hidden bg-dark/5" style={{ height: 180 }}>
                  {img.imageUrl ? (
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`absolute inset-0 ${img.gradient}`} />
                  )}
                  <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/40 transition-colors duration-200" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <span className="self-start bg-dark/40 text-cream/90 font-dm text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                      {img.category === 'femmes' ? 'Femmes' : 'Hommes'}
                    </span>
                    <div>
                      <p className="font-playfair text-cream font-bold text-sm">{img.title}</p>
                      <p className="font-dm text-cream/50 text-xs">#{img.order}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
