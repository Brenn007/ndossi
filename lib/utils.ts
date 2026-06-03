import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatTime(time: string): string {
  return time
}

export const SERVICES = [
  'Knotless / Box Braids',
  'Vanilles',
  'Fulani Braids',
  'Nattes',
  'Locks Crochet',
  'Vanilles & Barrel Twist Homme',
] as const

export type Service = typeof SERVICES[number]
