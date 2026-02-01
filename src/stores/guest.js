import { defineStore } from 'pinia'

import configurl from '@/util/configurl'

const STORAGE_KEY = 'guest'

export const useGuestStore = defineStore('guest', {
  state: () => ({
    guest: null,
  }),
  getters: {
    isLoggedIn: state => Boolean(state.guest?.id),
    name: state => state.guest?.name || 'Guest',
    email: state => state.guest?.email || 'Not signed in',
    imageUrl: state => {
      if (!state.guest?.image) return ''
      return `${configurl.image_path}${state.guest.image}`
    },
  },
  actions: {
    hydrate() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.guest = raw ? JSON.parse(raw) : null
      } catch {
        this.guest = null
      }
    },
    setGuest(guest) {
      this.guest = guest || null
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.guest))
    },
    clear() {
      this.guest = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
