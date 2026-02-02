<template>
  <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
    <div class="text-sm font-semibold">Guest Login</div>
    <p class="mt-2 text-sm text-white/65">Enter your email to view bookings and continue faster.</p>

    <form class="mt-6 grid gap-4" @submit.prevent="submit">
      <label class="grid gap-1">
        <span class="text-xs text-white/60">Email</span>
        <input
          v-model.trim="email"
          type="email"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25"
        />
      </label>

      <button
        type="submit"
        :disabled="loading"
        class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>

      <RouterLink to="/signup" class="text-center text-sm text-white/70 underline hover:text-white">
        Don’t have an account? Create one
      </RouterLink>
    </form>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import apiClient from '@/util/client'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast
const guestStore = useGuestStore()

const email = ref('')
const loading = ref(false)

const submit = async () => {
  if (!email.value) {
    toast?.warning('Please enter your email.')
    return
  }

  loading.value = true
  try {
    const res = await apiClient.post('/public/guests/login', { email: email.value })
    const guest = res?.guest
    if (!guest?.id) {
      toast?.error('Login failed.')
      return
    }
    guestStore.setGuest(guest)
    toast?.success('Signed in successfully.')
    router.push('/')
  } catch (e) {
    const msg = e?.response?.data?.message || 'Login failed.'
    toast?.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
