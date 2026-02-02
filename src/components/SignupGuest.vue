<template>
  <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
    <div class="text-sm font-semibold">Create Guest Account</div>
    <p class="mt-2 text-sm text-white/65">Create an account with your email. No password is required in this demo
      backend.</p>

    <form class="mt-6 grid gap-4" @submit.prevent="submit">
      <label class="grid gap-1">
        <span class="text-xs text-white/60">Full name</span>
        <input v-model.trim="form.name"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
      </label>

      <label class="grid gap-1">
        <span class="text-xs text-white/60">Email</span>
        <input v-model.trim="form.email" type="email"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
      </label>

      <label class="grid gap-1">
        <span class="text-xs text-white/60">Phone (optional)</span>
        <input v-model.trim="form.phone"
          class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
      </label>

      <label class="grid gap-2">
        <span class="text-xs text-white/60">Profile image (optional)</span>
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-12 md:w-13 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
            <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="h-full w-full object-cover" />
            <span v-else class="material-symbols-outlined text-white/50">person</span>
          </div>
          <input type="file" accept="image/*"
            class="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
            @change="onFileChange" />
        </div>
      </label>

      <button type="submit" :disabled="loading"
        class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] disabled:cursor-not-allowed disabled:opacity-70">
        {{ loading ? 'Creating...' : 'Create Account' }}
      </button>

      <RouterLink to="/login" class="text-center text-sm text-white/70 underline hover:text-white">
        Already have an account? Sign in
      </RouterLink>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import apiClient from '@/util/client'
import { useGuestStore } from '@/stores/guest'

const router = useRouter()
const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast
const guestStore = useGuestStore()

const loading = ref(false)
const imageFile = ref(null)
const previewUrl = ref('')
const form = reactive({
  name: '',
  email: '',
  phone: '',
})

const onFileChange = e => {
  const file = e?.target?.files?.[0] || null
  imageFile.value = file
  previewUrl.value = file ? URL.createObjectURL(file) : ''
}

const submit = async () => {
  if (!form.name || !form.email) {
    toast?.warning('Please enter your name and email.')
    return
  }

  loading.value = true
  try {
    const data = new FormData()
    data.append('name', form.name)
    data.append('email', form.email)
    if (form.phone) data.append('phone', form.phone)
    if (imageFile.value) data.append('image', imageFile.value)

    const res = await apiClient.post('/public/guests', data)

    const guest = res?.guest
    if (!guest?.id) {
      toast?.error('Sign up failed.')
      return
    }

    guestStore.setGuest(guest)
    toast?.success('Account created and signed in.')
    router.push('/')
  } catch (e) {
    const msg = e?.response?.data?.message || 'Sign up failed.'
    toast?.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
