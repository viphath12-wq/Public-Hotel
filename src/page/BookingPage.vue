<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold tracking-tight">Booking</h1>
      <p class="text-sm text-white/65">Check availability, pick a room, confirm guest details, and pay securely.</p>
    </div>

    <div class="mt-9 grid gap-8 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <div class="rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="flex items-center justify-between gap-3">
            <div class="text-sm font-semibold">1) Availability</div>
            <div class="text-xs text-white/60">Step {{ step }} / 3</div>
          </div>

          <form class="mt-5 grid gap-4" @submit.prevent="checkAvailability">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Check-in</span>
                <input v-model="availability.checkIn" type="date" class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Check-out</span>
                <input v-model="availability.checkOut" type="date" class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
            </div>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Guests</span>
              <select v-model.number="availability.guests" class="h-11 rounded-xl border border-white/10 bg-[#112117] px-3 text-sm text-white outline-none transition focus:border-white/25">
                <option :value="1">1 Guest</option>
                <option :value="2">2 Guests</option>
                <option :value="3">3 Guests</option>
                <option :value="4">4 Guests</option>
              </select>
            </label>

            <button
              type="submit"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
            >
              Check Availability
            </button>
          </form>
        </div>

        <div class="mt-6 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="text-sm font-semibold">2) Select room</div>
          <div class="mt-1 text-sm text-white/65">Choose a room type. Availability is validated when you confirm.</div>

          <div v-if="roomsLoading" class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
            Loading rooms...
          </div>

          <div v-else-if="roomsError" class="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-white/80">
            {{ roomsError }}
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <button
              v-for="room in visibleRoomOptions"
              :key="room.id"
              type="button"
              class="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition"
              :class="[
                selectedRoom?.id === room.id ? 'ring-2 ring-[color:rgba(54,226,123,0.35)]' : '',
                room.isAvailable ? 'hover:bg-white/10' : 'cursor-not-allowed opacity-55'
              ]"
              :disabled="!room.isAvailable"
              @click="room.isAvailable && selectRoom(room)"
            >
              <div class="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img :src="room.image" :alt="room.name" class="h-28 w-full object-cover" loading="lazy" />
              </div>
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold">{{ room.name }}</div>
                  <div class="mt-1 text-xs text-white/60">{{ room.summary }}</div>
                </div>
                <div class="shrink-0 text-right">
                  <div class="text-xs text-white/60">From</div>
                  <div class="text-sm font-bold text-[color:var(--color-primary)]">${{ room.price }}</div>
                </div>
              </div>

              <div v-if="!room.isAvailable" class="mt-3">
                <span class="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white/75">Unavailable</span>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <span v-for="t in room.tags" :key="t" class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">{{ t }}</span>
              </div>
            </button>
          </div>

          <div v-if="!roomsLoading && !roomsError && roomOptions.length" class="mt-6 flex justify-center">
            <button
              v-if="canLoadMoreRooms"
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              @click="loadMoreRooms"
            >
              More Rooms
            </button>
          </div>
        </div>

        <div class="mt-6 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="text-sm font-semibold">3) Guest information</div>

          <form class="mt-5 grid gap-4" @submit.prevent="confirm">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Full name</span>
                <input v-model.trim="guest.name" class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
              <label class="grid gap-1">
                <span class="text-xs text-white/60">Phone / WhatsApp</span>
                <input v-model.trim="guest.phone" class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
              </label>
            </div>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Email</span>
              <input v-model.trim="guest.email" type="email" class="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <label class="grid gap-1">
              <span class="text-xs text-white/60">Notes (optional)</span>
              <textarea v-model.trim="guest.notes" rows="4" class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/25" />
            </label>

            <button
              type="submit"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>

      <aside class="lg:col-span-5">
        <div class="sticky top-24 rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.6)] p-6">
          <div class="text-sm font-semibold">Summary</div>

          <div class="mt-4 grid gap-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-white/60">Check-in</span>
              <span class="font-medium">{{ availability.checkIn || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white/60">Check-out</span>
              <span class="font-medium">{{ availability.checkOut || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white/60">Guests</span>
              <span class="font-medium">{{ availability.guests }}</span>
            </div>
            <div class="h-px bg-white/10" />
            <div class="flex items-center justify-between">
              <span class="text-white/60">Room</span>
              <span class="font-medium">{{ selectedRoom?.name || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white/60">Price</span>
              <span class="font-semibold text-[color:var(--color-primary)]">${{ selectedRoom?.price ?? '—' }}/night</span>
            </div>
          </div>

          <div v-if="confirmed" class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-start gap-3">
              <span class="material-symbols-outlined text-[20px] text-[color:var(--color-primary)]">verified</span>
              <div>
                <div class="text-sm font-semibold">Booking confirmed</div>
                <div class="mt-1 text-xs text-white/60">Scan QR to pay. Then send the receipt to WhatsApp for instant confirmation.</div>
              </div>
            </div>

            <div class="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3">
              <img :src="qr" alt="Payment QR" class="w-full rounded-xl" />
            </div>

            <div class="mt-4 text-xs text-white/60">Payment method: QR transfer (customizable).</div>
          </div>

          <div v-else class="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-xs text-white/60">
            Complete the steps on the left to see payment details.
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'

import qr from '@/assets/QRcode.JPG'
import apiClient from '@/util/client'
import configurl from '@/util/configurl'

const route = useRoute()

const availability = reactive({
  checkIn: typeof route.query.checkIn === 'string' ? route.query.checkIn : '',
  checkOut: typeof route.query.checkOut === 'string' ? route.query.checkOut : '',
  guests: Number(typeof route.query.guests === 'string' ? route.query.guests : 2) || 2,
})

const roomOptions = ref([])
const roomsLoading = ref(true)
const roomsError = ref('')

const visibleRoomsCount = ref(3)
const visibleRoomOptions = computed(() => roomOptions.value.slice(0, visibleRoomsCount.value))
const canLoadMoreRooms = computed(() => roomOptions.value.length > visibleRoomsCount.value)

const loadMoreRooms = () => {
  visibleRoomsCount.value += 3
}

const selectedRoom = ref(null)
const confirmed = ref(false)
const reservation = ref(null)

const guest = reactive({
  name: '',
  phone: '',
  email: '',
  notes: '',
})

const step = computed(() => {
  if (!availability.checkIn || !availability.checkOut) return 1
  if (!selectedRoom.value) return 2
  return 3
})

const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast

const checkAvailability = () => {
  confirmed.value = false
  toast?.success('Availability noted. Choose a room and confirm to validate dates.')
}

const selectRoom = (room) => {
  confirmed.value = false
  selectedRoom.value = room
  toast?.info(`Selected: ${room.name}`)
}

const ensureGuestId = async () => {
  const email = (guest.email || '').trim()
  const name = (guest.name || '').trim()
  const phone = (guest.phone || '').trim()

  if (!email) {
    throw new Error('Please enter your email.')
  }
  if (!name) {
    throw new Error('Please enter your full name.')
  }

  try {
    const res = await apiClient.post('/public/guests/login', { email })
    const id = res?.guest?.id
    if (!id) throw new Error('Guest login failed.')
    return id
  } catch (e) {
    const status = e?.response?.status
    if (status !== 404) {
      const msg = e?.response?.data?.message || 'Failed to login guest.'
      throw new Error(msg)
    }
  }

  const created = await apiClient.post('/public/guests', { name, email, phone: phone || null })
  const id = created?.guest?.id
  if (!id) throw new Error('Failed to create guest.')
  return id
}

const confirm = async () => {
  if (!availability.checkIn || !availability.checkOut) {
    toast?.warning('Please select check-in and check-out dates.')
    return
  }
  if (!selectedRoom.value) {
    toast?.warning('Please select a room type.')
    return
  }
  if (selectedRoom.value && selectedRoom.value.isAvailable === false) {
    toast?.warning('This room is not available. Please select another room.')
    return
  }
  if (!guest.phone) {
    toast?.warning('Please enter your phone/WhatsApp.')
    return
  }

  confirmed.value = false
  reservation.value = null

  try {
    const guestId = await ensureGuestId()
    const res = await apiClient.post('/public/reservations', {
      guest_id: guestId,
      room_id: selectedRoom.value.id,
      check_in: availability.checkIn,
      check_out: availability.checkOut,
    })

    reservation.value = res
    confirmed.value = true
    toast?.success('Booking confirmed. Proceed to payment via QR.')
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || 'Booking failed.'
    toast?.error(msg)
  }
}

const fallbackImage = 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80'

const mapRoomOption = (r) => {
  const image = r?.image ? `${configurl.image_path}${r.image}` : fallbackImage
  const capacity = Number(r?.capacity ?? 2)
  const status = String(r?.status ?? 'available')
  const isAvailable = status === 'available'
  return {
    id: r.id,
    name: r?.type ? String(r.type) : `Room ${r?.number ?? ''}`.trim(),
    price: r?.price ?? 0,
    summary: `Floor ${r?.floor ?? '-'} • Capacity ${capacity}`,
    tags: ['Wi‑Fi', capacity >= 3 ? 'Family' : 'Couples', 'Modern'],
    status,
    isAvailable,
    image,
  }
}

onMounted(async () => {
  roomsLoading.value = true
  roomsError.value = ''
  try {
    const res = await apiClient.get('/public/rooms')
    roomOptions.value = Array.isArray(res)
      ? res
          .filter(r => String(r?.status ?? 'available') === 'available')
          .map(mapRoomOption)
      : []
    visibleRoomsCount.value = 3
  } catch (e) {
    roomsError.value = e?.response?.data?.message || 'Failed to load rooms from API.'
  } finally {
    roomsLoading.value = false
  }
})
</script>
