<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Booking History</h1>
      <p class="text-sm text-white/65">View your reservations and stay details.</p>
    </div>

    <div v-if="!isLoggedIn" class="mt-8 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
      <div class="text-sm font-semibold">You are not signed in</div>
      <p class="mt-2 text-sm text-white/65">Please login to view your booking history.</p>
      <RouterLink
        to="/login"
        class="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-5 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
      >
        Go to Login
      </RouterLink>
    </div>

    <div v-else class="mt-8">
      <div v-if="loading" class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6 text-sm text-white/70">
        Loading your bookings...
      </div>

      <div v-else-if="error" class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
        {{ error }}
      </div>

      <div v-else-if="items.length === 0" class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6 text-sm text-white/70">
        No reservations found.
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="r in items"
          :key="r.id"
          class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <div class="text-sm font-semibold">{{ r.room?.name || 'Room' }}</div>
              <div class="mt-1 text-sm text-white/70">
                {{ formatDate(r.check_in) }} - {{ formatDate(r.check_out) }}
              </div>
              <div class="mt-1 text-xs text-white/60">Reservation #{{ r.id }}</div>
            </div>

            <div class="flex items-center gap-3">
              <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">{{ r.status || 'Pending' }}</span>
              <span class="text-sm font-semibold text-[color:var(--color-primary)]">${{ Number(r.total || 0).toFixed(2) }}</span>
            </div>
          </div>

          <div v-if="r.room" class="mt-4 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
            <div>Type: <span class="text-white/90">{{ r.room.type || 'N/A' }}</span></div>
            <div>Price/night: <span class="text-white/90">${{ Number(r.room.price || 0).toFixed(2) }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import apiClient from '@/util/client'
import { formatDate } from '@/util/helpers'
import { useGuestStore } from '@/stores/guest'

const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast
const guestStore = useGuestStore()

const loading = ref(false)
const error = ref('')
const items = ref([])

const isLoggedIn = computed(() => guestStore.isLoggedIn)

const load = async () => {
  if (!guestStore.guest?.id) {
    items.value = []
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await apiClient.get('/public/reservations/history', { guest_id: guestStore.guest.id })
    items.value = Array.isArray(res) ? res : []
  } catch (e) {
    const msg = e?.response?.data?.message || 'Failed to load booking history.'
    error.value = msg
    toast?.error(msg)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  guestStore.hydrate()
  if (guestStore.isLoggedIn) load()
})

watch(
  () => guestStore.guest?.id,
  () => {
    if (guestStore.isLoggedIn) load()
  }
)
</script>
