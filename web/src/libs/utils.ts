import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import { Timestamp } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp?: Timestamp) {
  return formatDate(timestamp?.toDate())
}

export function formatDate(date?: Date) {
  if (date) {
    return dayjs(date).format('YYYY年MM月DD日 HH：mm')
  }
}
export async function fetchAsBase64(url: string) {
  const response = await fetch(url)
  const blob = await response.blob()
  return await toBase64(blob)
}

export function toBase64(blob: Blob) {
  return new Promise<string | undefined>(async (resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result?.toString())
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
