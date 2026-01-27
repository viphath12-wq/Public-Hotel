<template>
  <div class="w-full max-w-xl mx-auto rounded-2xl border border-surface-border bg-surface-dark p-6 md:p-8 text-white">
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Login</h2>
      <p class="mt-1 text-sm text-slate-400">Enter your email to continue.</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleLogin">
      <div>
        <label class="block text-sm font-medium mb-2">
          Email <span class="text-red-400">*</span>
        </label>
        <input
          v-model.trim="email"
          type="email"
          class="w-full rounded-xl bg-background-dark border border-surface-border px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
          placeholder="you@example.com"
          autocomplete="email"
        />
        <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="w-full h-12 rounded-full bg-primary text-[#122118] font-bold hover:bg-[#2bc466] transition-colors"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import configurl from '../util/configurl'

const STORAGE_KEY = 'public_guest'

export default {
  name: 'Login',
  emits: ['logged-in'],
  data() {
    return {
      email: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    getApiUrl() {
      return configurl.baseurl
    },
    async handleLogin() {
      this.error = ''
      if (!this.email) {
        this.error = 'Email is required.'
        return
      }
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
      if (!ok) {
        this.error = 'Please enter a valid email address.'
        return
      }

      this.loading = true
      try {
        const url = `${this.getApiUrl()}/public/guests/login`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        })

        if (!res.ok) {
          let msg = `Login failed (${res.status})`
          try {
            const data = await res.json()
            msg = data?.message || data?.error || msg
          } catch (e) {
          }
          this.error = msg
          return
        }

        const data = await res.json()
        const guest = data?.guest || null
        if (!guest?.id) {
          this.error = 'Login failed.'
          return
        }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(guest))
        } catch (e) {
        }

        this.$emit('logged-in', guest)
      } catch (e) {
        this.error = 'Failed to fetch'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>