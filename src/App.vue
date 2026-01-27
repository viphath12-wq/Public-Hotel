<template>
  <div class="min-h-screen flex flex-col bg-background-dark text-white font-display antialiased">
    <Header
      :current-guest="currentGuest"
      @login="openAuthModal('login')"
      @profile="openProfile"
      @history="openHistory"
      @sign-in="openAuthModal('sign_in')"
      @book-now="openAuthModal('sign_in')"
      @navigation-change="handleHeaderNavigation"
    />
    <HeroSearch @search="onSearch" />
    
    <main class="flex-wrap px-4 md:px-10 py-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6 flex justify-between items-end">
          <p class="text-slate-400 text-sm">Showing {{ filteredRooms.length }} available rooms</p>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-primary" @click="toggleSort">
              <span>Sort by: {{ sortOptions[currentSort] }}</span>
              <span class="material-symbols-outlined text-[18px]">sort</span>
            </div>
          </div>
        </div>

        <div v-if="isLoadingRooms" class="mb-6 text-slate-400 text-sm">Loading rooms...</div>
        <div v-else-if="roomsError" class="mb-6 text-red-400 text-sm">{{ roomsError }}</div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RoomCard 
            v-for="room in filteredRooms" 
            :key="room.id"
            :room="room"
            @toggle-favorite="toggleFavorite"
            @book="handleBook(room)"
          />
        </div>

        <div v-if="filteredRooms.length < rooms.length && !isLoadingRooms" class="mt-8 text-center">
          <button
            @click="loadMore"
            class="px-6 py-3 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors"
          >
            Load More Rooms
          </button>
        </div>
      </div>
    </main>

    <Footer />

    <!-- Guest Authentication Modal -->
    <div v-if="showGuestModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="closeGuestForm">
      <div class="w-full max-w-xl bg-surface-dark rounded-2xl border border-surface-border p-6">
        <div class="mb-4 flex items-center justify-end gap-2">
          <button
            type="button"
            class="h-9 px-4 rounded-full border border-surface-border text-white hover:border-primary text-sm transition-colors"
            :class="authMode === 'login' ? 'border-primary text-primary' : ''"
            @click="authMode = 'login'"
          >
            Login
          </button>
          <button
            type="button"
            class="h-9 px-4 rounded-full border border-surface-border text-white hover:border-primary text-sm transition-colors"
            :class="authMode === 'sign_in' ? 'border-primary text-primary' : ''"
            @click="authMode = 'sign_in'"
          >
            Sign In
          </button>
          <button class="h-9 px-4 rounded-full border border-surface-border text-white hover:border-primary text-sm transition-colors" @click="closeGuestForm">
            Close
          </button>
        </div>
        <EmailLogin v-if="authMode === 'login'" @logged-in="onGuestLoggedIn" />
        <SignIn v-else @submit="submitGuest" />
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="closeProfile">
      <div class="w-full max-w-xl bg-surface-dark rounded-2xl border border-surface-border p-6">
        <Profile @updated="onProfileUpdated" @logout="onProfileLogout" />
        <div class="mt-6 flex justify-end">
          <button class="px-6 py-2 rounded-full border border-surface-border text-white hover:border-primary transition-colors" @click="closeProfile">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <div v-if="showHistoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="closeHistory">
      <div class="w-full max-w-3xl rounded-2xl border border-surface-border bg-surface-dark p-6 md:p-8 text-white">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 class="text-2xl font-bold">Booking History</h2>
            <p class="mt-1 text-sm text-slate-400" v-if="currentGuest?.email">{{ currentGuest.email }}</p>
          </div>
          <button
            type="button"
            class="h-10 px-4 rounded-full border border-surface-border text-white hover:border-primary transition-colors"
            @click="closeHistory"
          >
            Close
          </button>
        </div>

        <div v-if="historyLoading" class="text-slate-400 text-sm">Loading history...</div>
        <div v-else-if="historyError" class="text-red-400 text-sm">{{ historyError }}</div>
        <div v-else-if="!historyItems.length" class="text-slate-400 text-sm">No bookings yet.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-slate-400">
                <th class="text-left py-2 pr-4 font-medium">Room</th>
                <th class="text-left py-2 pr-4 font-medium">Check In</th>
                <th class="text-left py-2 pr-4 font-medium">Check Out</th>
                <th class="text-left py-2 pr-4 font-medium">Status</th>
                <th class="text-right py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in historyItems" :key="r.id" class="border-t border-surface-border">
                <td class="py-3 pr-4">
                  <span class="font-medium">{{ r.roomName }}</span>
                </td>
                <td class="py-3 pr-4">{{ r.checkIn }}</td>
                <td class="py-3 pr-4">{{ r.checkOut }}</td>
                <td class="py-3 pr-4">
                  <span class="px-2 py-1 rounded-full text-xs border border-surface-border">{{ r.status }}</span>
                </td>
                <td class="py-3 text-right">{{ r.totalLabel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="showPaymentModal = false">
      <div class="w-full max-w-md bg-surface-dark rounded-2xl border border-surface-border p-6 text-white text-center">
        <h3 class="text-xl font-bold mb-4">Scan to Pay</h3>
        <div class="bg-white p-4 rounded-xl inline-block mb-4">
          <!-- Fixed: Using proper Vue binding -->
          <img :src="QRCodeImage" alt="QR Code" class="w-48 h-48 object-contain" />
        </div>
        <p class="text-slate-400 text-sm mb-6">Please scan the QR code to complete your payment for {{ selectedRoom?.title }}.</p>
        
        <div class="flex gap-3 justify-center">
          <button 
            class="px-6 py-2 rounded-full border border-surface-border text-white hover:bg-white/10 transition-colors"
            @click="showPaymentModal = false"
          >
            Cancel
          </button>
          <button 
            class="px-6 py-2 rounded-full bg-primary text-[#122118] font-bold hover:bg-primary/90 transition-colors"
            @click="confirmPaymentAndBook"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
    
    <!-- Floating Action Button -->
    <button 
      class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-[#122118] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      @click="openChat"
    >
      <span class="material-symbols-outlined text-[28px]">chat_bubble</span>
    </button>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import HeroSearch from './components/HeroSearch.vue'
import RoomCard from './components/RoomCard.vue'
import Footer from './components/Footer.vue'
import EmailLogin from './components/Login.vue'
import SignIn from './components/Sign_In.vue'
import Profile from './components/Profile.vue'
import configurl from './util/configurl'
import QRCodeImage from '@/assets/QRcode.JPG'

export default {
  name: 'App',
  components: {
    Header,
    HeroSearch,
    RoomCard,
    Footer,
    EmailLogin,
    SignIn,
    Profile
  },
  data() {
    return {
      rooms: [],
      isLoadingRooms: false,
      roomsError: '',
      showGuestModal: false,
      showProfileModal: false,
      showHistoryModal: false,
      showPaymentModal: false,
      historyLoading: false,
      historyError: '',
      historyItems: [],
      authMode: 'sign_in',
      selectedRoom: null,
      currentGuest: null,
      searchState: {
        check_in: '',
        check_out: '',
        dates: '',
        guests: ''
      },
      currentSort: 0,
      sortOptions: ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Popular'],
      showAvailableOnly: false,
      visibleRooms: 6,
      QRCodeImage: QRCodeImage // Store the imported image
    }
  },
  computed: {
    filteredRooms() {
      let filtered = Array.isArray(this.rooms) ? this.rooms : []
      
      if (this.showAvailableOnly) {
        filtered = filtered.filter(room => room.available)
      }
      
      // Apply sorting
      const sortIndex = this.currentSort || 0
      filtered = [...filtered].sort((a, b) => {
        switch (sortIndex) {
          case 1: return a.price - b.price
          case 2: return b.price - a.price
          case 3: return 0
          default: return 0
        }
      })
      
      return filtered.slice(0, this.visibleRooms)
    }
  },
  mounted() {
    try {
      const saved = JSON.parse(localStorage.getItem('public_guest') || 'null')
      if (saved && saved.id) {
        this.currentGuest = saved
      }
    } catch (e) {
      console.error('Error loading guest from localStorage:', e)
    }
    this.fetchRooms()
  },
  methods: {
    getApiUrl() {
      return configurl.baseurl
    },
    getImageBaseUrl() {
      return configurl.image_path || ''
    },
    onSearch(payload) {
      this.searchState = {
        check_in: payload?.check_in || '',
        check_out: payload?.check_out || '',
        dates: payload?.dates || '',
        guests: payload?.guests || ''
      }
      console.log('Search state updated:', this.searchState)
    },
    openGuestForm(room = null) {
      this.selectedRoom = room
      this.showGuestModal = true
    },
    openAuthModal(mode = 'sign_in', room = null) {
      this.authMode = mode
      this.openGuestForm(room)
    },
    async handleBook(room) {
      this.selectedRoom = room
      const checkIn = this.searchState?.check_in
      const checkOut = this.searchState?.check_out
      
      if (!checkIn || !checkOut) {
        this.$toast.warning('Please select check-in and check-out dates first.')
        return
      }
      
      if (this.currentGuest?.id) {
        this.showPaymentModal = true
        return
      }
      
      this.openAuthModal('sign_in', room)
    },
    closeGuestForm() {
      this.showGuestModal = false
      this.selectedRoom = null
    },
    openProfile() {
      this.showProfileModal = true
    },
    closeProfile() {
      this.showProfileModal = false
    },
    handleHeaderNavigation(nav) {
      if (nav === 'Profile') {
        this.openProfile()
      }
    },
    onProfileUpdated(payload) {
      if (payload?.id) {
        this.currentGuest = payload
        try {
          localStorage.setItem('public_guest', JSON.stringify(payload))
        } catch (e) {
          console.error('Error saving guest to localStorage:', e)
        }
      }
    },
    onProfileLogout() {
      this.currentGuest = null
      try {
        localStorage.removeItem('public_guest')
      } catch (e) {
        console.error('Error removing guest from localStorage:', e)
      }
      this.showProfileModal = false
    },
    openHistory() {
      this.showHistoryModal = true
      this.fetchHistory()
    },
    closeHistory() {
      this.showHistoryModal = false
    },
    async fetchHistory() {
      const guestId = this.currentGuest?.id
      if (!guestId) {
        this.historyItems = []
        this.historyError = 'Please login first.'
        return
      }

      this.historyLoading = true
      this.historyError = ''
      
      try {
        const url = `${this.getApiUrl()}/public/reservations/history?guest_id=${encodeURIComponent(guestId)}`
        const res = await fetch(url)
        
        if (!res.ok) {
          let msg = `Failed to load history (${res.status})`
          try {
            const data = await res.json()
            msg = data?.message || data?.error || msg
          } catch (e) {
            // Ignore JSON parsing error
          }
          throw new Error(msg)
        }

        const data = await res.json()
        const list = Array.isArray(data) ? data : []

        this.historyItems = list.map((item) => {
          const room = item?.room || null
          const roomName = room?.type 
            ? String(room.type) 
            : (room?.number 
              ? `Room ${room.number}` 
              : `Room #${item?.room_id ?? ''}`
            )
          const total = Number(item?.total || 0)
          
          return {
            id: item?.id,
            roomName,
            checkIn: item?.check_in || '—',
            checkOut: item?.check_out || '—',
            status: item?.status || '—',
            totalLabel: total ? `$${total.toFixed(2)}` : '—'
          }
        })
      } catch (e) {
        this.historyItems = []
        this.historyError = e?.message || 'Failed to load history'
        console.error('Error fetching history:', e)
      } finally {
        this.historyLoading = false
      }
    },
    async onGuestLoggedIn(guest) {
      if (guest?.id) {
        this.currentGuest = guest
        try {
          localStorage.setItem('public_guest', JSON.stringify(guest))
        } catch (e) {
          console.error('Error saving guest to localStorage:', e)
        }
      }

      if (this.selectedRoom && this.currentGuest?.id) {
        this.showPaymentModal = true
      }
      this.closeGuestForm()
    },
    async submitGuest(payload) {
      try {
        const fd = new FormData()
        fd.append('name', payload?.name || '')
        fd.append('email', payload?.email || '')
        if (payload?.phone) fd.append('phone', payload.phone)
        if (payload?.imageFile) fd.append('image', payload.imageFile)

        const url = `${this.getApiUrl()}/public/guests`
        const res = await fetch(url, { 
          method: 'POST', 
          body: fd 
        })
        
        if (!res.ok) {
          let msg = `Failed to create guest (${res.status})`
          try {
            const data = await res.json()
            msg = data?.message || data?.error || msg
          } catch (e) {
            // Ignore JSON parsing error
          }
          this.$toast.error(msg)
          return
        }

        const data = await res.json()
        const guest = data?.guest || null
        if (guest?.id) {
          this.currentGuest = guest
          try {
            localStorage.setItem('public_guest', JSON.stringify(guest))
          } catch (e) {
            console.error('Error saving guest to localStorage:', e)
          }
        }

        if (this.selectedRoom && this.currentGuest?.id) {
          this.showPaymentModal = true
        }

        this.closeGuestForm()
      } catch (e) {
        this.$toast.error(e?.message || 'Submit failed.')
        console.error('Error submitting guest:', e)
      }
    },
    async confirmPaymentAndBook() {
      try {
        await this.createReservation()
        this.showPaymentModal = false
        this.fetchHistory() // Refresh history after booking
      } catch (e) {
        console.error('Error in payment confirmation:', e)
      }
    },
    async createReservation() {
      const guestId = this.currentGuest?.id
      const roomId = this.selectedRoom?.id
      const checkIn = this.searchState?.check_in
      const checkOut = this.searchState?.check_out

      if (!guestId || !roomId) {
        this.$toast.error('Missing guest or room information.')
        return
      }
      
      if (!checkIn || !checkOut) {
        this.$toast.warning('Please select check-in and check-out dates first.')
        return
      }

      try {
        const url = `${this.getApiUrl()}/public/reservations`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            guest_id: guestId,
            room_id: roomId,
            check_in: checkIn,
            check_out: checkOut,
            status: 'Pending'
          })
        })

        if (!res.ok) {
          let msg = `Failed to create reservation (${res.status})`
          try {
            const data = await res.json()
            msg = data?.message || data?.error || msg
          } catch (e) {
            // Ignore JSON parsing error
          }
          this.$toast.error(msg)
          return
        }

        const data = await res.json()
        this.$toast.success('Booking created successfully!')
        this.selectedRoom = null
        await this.fetchRooms()
        
        return data
      } catch (e) {
        this.$toast.error('Network error. Please try again.')
        console.error('Error creating reservation:', e)
        throw e
      }
    },
    mapRoom(r) {
      const imageBase = this.getImageBaseUrl()
      const rawImage = r?.image
      
      let image = 'https://placehold.co/600x450/1e293b/ffffff?text=Room+Image'
      
      if (rawImage) {
        if (String(rawImage).startsWith('http')) {
          image = rawImage
        } else {
          image = `${imageBase}${rawImage}`
        }
      }

      const status = String(r?.status || '').toLowerCase()
      const available = status === 'available'

      const title = r?.type ? String(r.type) : `Room #${r?.number ?? ''}`
      const price = Number(r?.price || 0)

      return {
        id: r?.id,
        title,
        price,
        size: r?.floor ? `Floor ${r.floor}` : '—',
        guests: Number(r?.capacity || 2),
        bedType: r?.bed_type || '—',
        amenities: r?.amenities ? r.amenities.split(',') : ['Wifi', 'AC'],
        badge: available ? null : 'Unavailable',
        badgeColor: available ? '' : 'bg-slate-700/80 backdrop-blur-sm text-white',
        image,
        available,
        favorite: false,
        // Image error handler
        onImageError: (e) => {
          e.target.src = 'https://placehold.co/600x450/1e293b/ffffff?text=Room+Image'
        }
      }
    },
    async fetchRooms() {
      this.isLoadingRooms = true
      this.roomsError = ''
      
      try {
        const url = `${this.getApiUrl()}/public/rooms`
        const res = await fetch(url)
        
        if (!res.ok) {
          throw new Error(`Failed to load rooms (${res.status})`)
        }
        
        const data = await res.json()
        const list = Array.isArray(data?.data) 
          ? data.data 
          : (Array.isArray(data) ? data : [])
        
        this.rooms = list.map(this.mapRoom.bind(this))
      } catch (e) {
        this.rooms = []
        this.roomsError = e?.message || 'Failed to load rooms'
        console.error('Error fetching rooms:', e)
      } finally {
        this.isLoadingRooms = false
      }
    },
    toggleFavorite(roomId) {
      const room = this.rooms.find(r => r.id === roomId)
      if (room) {
        room.favorite = !room.favorite
        // You could add API call here to save favorite status
      }
    },
    toggleSort() {
      this.currentSort = (this.currentSort + 1) % this.sortOptions.length
    },
    loadMore() {
      this.visibleRooms += 6
    },
    openChat() {
      window.open('https://t.me/PHANG_VIPHATH')
    }
  }
}
</script>