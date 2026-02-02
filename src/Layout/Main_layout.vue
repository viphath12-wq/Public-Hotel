<template>
  <div class="flex min-h-dvh flex-col bg-[var(--color-background-dark)] text-white">
  <header class="fixed w-full inset-x-0 top-[-5px] z-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="mt-3 flex items-center justify-between rounded-2xl border border-[color:var(--color-surface-border)] bg-[color:rgba(13,24,17,0.72)] px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-[color:rgba(13,24,17,0.55)]">
        <RouterLink to="/" class="flex min-w-0 items-center gap-3">
          <div class="grid h-8 w-8 place-items-center">
            <img src="@/assets/Hotel_icon.png" alt="Hotel" class="h-8 w-8" />
          </div>
          <div class="min-w-0">
            <div class="truncate text-base font-bold tracking-wide text-white">Battambang Hotel</div>
            <div class=" truncate text-xs text-white/60 sm:block">Resort calm. Business ready.</div>
          </div>
        </RouterLink>
        <div class="flex items-center gap-3">
          <nav class="hidden items-center gap-1 md:flex">
            <NavLink to="/" label="Home" />
            <NavLink to="/rooms" label="Rooms" />

            <div class="relative">
              <button type="button"
                class="inline-flex h-10 w-20 cursor-pointer items-center justify-center rounded-xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.55)] text-white/80 transition hover:text-[color:var(--color-primary)] hover:bg-[var(--color-primary)/50]"
                :class="menuOpen ? 'bg-white/5 text-white' : ''" @click="toggleMenu">
                Menu
              </button>

              <div v-if="menuOpen"
                class="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-[color:var(--color-surface-border)] bg-[#0D1811] shadow-xl shadow-black/30">
                <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to"
                  class="flex items-center justify-between px-4 py-3 text-sm text-white/80 transition hover:text-[var(--color-primary)]"
                  @click="menuOpen = false">
                  <span>{{ item.label }}</span>
                </RouterLink>
              </div>
            </div>
          </nav>
          <RouterLink to="/booking"
            class="hidden rounded-xl bg-[color:rgba(54,226,123,0.16)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)] md:inline-flex">
            Book Now
          </RouterLink>
          <button type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.55)] text-white/80 transition hover:text-white md:hidden"
            aria-label="Open menu" @click="open = true">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <!-- Account Profile - Premium Hotel Version -->
          <div class="relative cursor-pointer" @mouseenter="isAccountMenuHover = true" @mouseleave="isAccountMenuHover = false">
            <div class="relative" @click="toggleAccountMenu">
              <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#36E27B]/20 to-[#36E27B]/5 ring-1 ring-white/30">
                <img 
                  v-if="isLoggedIn && customerImageUrl" 
                  :src="customerImageUrl" 
                  alt="Customer" 
                  class="h-full w-full object-cover"
                />
                <span v-else class="material-symbols-outlined text-[#36E27B]">person</span>
              </div>
              <div class="absolute -bottom-0 -right-0 h-3 w-3 rounded-full border-2 border-[#1A1F2C] bg-[#36E27B]"></div>
            </div>

            <!-- Premium Dropdown Menu -->
            <div 
              v-if="isAccountMenuOpen || isAccountMenuHover"
              class="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1A1F2C]/95 to-[#0F172A]/95 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300"
              :class="isAccountMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
            >
              <!-- Customer Info Header -->
              <div class="border-b border-white/10 p-5 bg-gradient-to-r from-[#36E27B]/5 via-transparent to-transparent">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#36E27B]/20 to-[#36E27B]/5 ring-1 ring-white/20">
                      <img 
                        v-if="isLoggedIn && customerImageUrl" 
                        :src="customerImageUrl" 
                        alt="Customer" 
                        class="h-full w-full object-cover"
                      />
                      <span v-else class="material-symbols-outlined text-3xl text-[#36E27B]">person</span>
                    </div>
                    <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#1A1F2C] bg-[#36E27B]"></div>
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <p class="truncate text-lg font-semibold text-white">{{ isLoggedIn ? customerName : 'Welcome Guest' }}</p>
                    <p class="truncate text-sm text-white/60">{{ isLoggedIn ? customerEmail : 'Sign in to manage bookings' }}</p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="p-2 space-y-1">
                <!-- History Booking -->
                <RouterLink
                  v-if="isLoggedIn"
                  to="/history-booking"
                  class="group flex w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="closeAccountMenu"
                >
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#36E27B]/10">
                    <span class="material-symbols-outlined text-[#36E27B] text-lg">receipt_long</span>
                  </div>
                  <div class="flex-1">
                    <span class="font-medium">History</span>
                  </div>
                </RouterLink>

                <!-- Login -->
                <RouterLink
                  v-if="!isLoggedIn"
                  to="/login"
                  class="group flex w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="closeAccountMenu"
                >
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#36E27B]/10">
                    <span class="material-symbols-outlined text-[#36E27B] text-lg">login</span>
                  </div>
                  <div class="flex-1">
                    <span class="font-medium">Sign In</span>
                  </div>
                </RouterLink>

                <!-- Sign Up -->
                <RouterLink
                  v-if="!isLoggedIn"
                  to="/signup"
                  class="group flex w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="closeAccountMenu"
                >
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#36E27B]/10">
                    <span class="material-symbols-outlined text-[#36E27B] text-lg">person_add</span>
                  </div>
                  <div class="flex-1">
                    <span class="font-medium">Sign Up</span>
                  </div>
                </RouterLink>

                <!-- Logout -->
                <button 
                  v-if="isLoggedIn"
                  class="group flex text-left w-full items-center gap-3 rounded-xl p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  @click="logout"
                >
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <span class="material-symbols-outlined text-red-500 text-lg">logout</span>
                  </div>
                  <div class="flex-1">
                    <span class="font-medium">Sign Out</span>
                  </div>
                </button>
              </div>

              <!-- Footer -->
              <div class="border-t border-white/10 bg-white/5 p-3">
                <div class="text-center">
                  <p class="text-xs text-white/50">Need help? <a href="https://t.me/PHANG_VIPHATH" class="text-[#36E27B] hover:underline">Contact Support</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/60" @click="open = false" />

        <div
          class="absolute right-0 top-0 h-full w-[50%] max-w-sm border-l border-[color:var(--color-surface-border)] bg-[color:rgba(13,24,17,0.92)] p-5 backdrop-blur">
          <div class="flex items-center justify-between">
            <div class="flex min-w-0 items-center gap-3">
              <img src="@/assets/Hotel_icon.png" alt="Hotel" class="h-9 w-9" />
              <div class="min-w-0">
                <div class="truncate text-sm font-semibold">Battambang Hotel</div>
                <div class="text-xs text-white/60">Luxury, calm, modern</div>
              </div>
            </div>
          </div>

          <RouterLink to="/booking"
            class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[color:rgba(54,226,123,0.16)] px-4 py-3 text-sm font-semibold text-[color:var(--color-primary)] ring-1 ring-[color:rgba(54,226,123,0.28)] transition hover:bg-[color:rgba(54,226,123,0.22)]"
            @click="open = false">
            Book Now
          </RouterLink>
          <div class="mt-6 grid gap-2">
            <RouterLink v-for="item in mobileItems" :key="item.to" :to="item.to"
              class="flex items-center justify-between rounded-xl border border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.55)] px-4 py-3 text-sm text-white/85 transition hover:text-white"
              @click="open = false">
              <span>{{ item.label }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </transition>
  </header>

    <main class="flex-1 pt-20">
      <slot />
    </main>

    <footer class="mt-auto border-t border-[color:var(--color-surface-border)] bg-[color:rgba(17,33,23,0.8)] backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-[color:rgba(54,226,123,0.1)] p-2">
              <img src="@/assets/Hotel_icon.png" alt="Hotel" class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold">Battambang Hotel</div>
              <div class="text-xs text-white/60">Resort calm. Business ready.</div>
            </div>
          </div>
          <div class="text-center text-xs text-white/60 sm:text-right">
            © {{ new Date().getFullYear() }} Battambang Hotel. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'

const NavLink = {
  props: {
    to: { type: String, required: true },
    label: { type: String, required: true },
  },
  template: `
    <RouterLink
      :to="to"
      class="rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
      active-class="bg-white/5 text-white"
      exact-active-class="bg-white/5 text-white"
    >
      {{ label }}
    </RouterLink>
  `,
}
</script>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useGuestStore } from '@/stores/guest'

const open = ref(false)

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const menuItems = [
  { to: '/amenities', label: 'Amenities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const mobileItems = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms & Suites' },
  ...menuItems,
]

const router = useRouter()
const route = useRoute()

const guestStore = useGuestStore()

const isLoggedIn = computed(() => guestStore.isLoggedIn)
const customerName = computed(() => guestStore.name)
const customerEmail = computed(() => guestStore.email)
const customerImageUrl = computed(() => guestStore.imageUrl)

const isAccountMenuOpen = ref(false)
const isAccountMenuHover = ref(false)

const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value
}

const closeAccountMenu = () => {
  isAccountMenuOpen.value = false
  isAccountMenuHover.value = false
}

const logout = () => {
  guestStore.clear()
  closeAccountMenu()
  router.push('/')
}

onMounted(() => {
  guestStore.hydrate()
})

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    closeAccountMenu()
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
