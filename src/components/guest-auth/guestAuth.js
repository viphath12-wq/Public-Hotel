import configurl from '@/util/configurl'

const STORAGE_KEY = 'guest'

export function readGuest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeGuest(guest) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guest))
}

export function clearGuest() {
  localStorage.removeItem(STORAGE_KEY)
}

export function guestImageUrl(guest) {
  if (!guest?.image) return ''
  return `${configurl.image_path}${guest.image}`
}
