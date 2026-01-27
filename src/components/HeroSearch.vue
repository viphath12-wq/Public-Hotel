<template>
  <div class="relative w-full bg-background-dark pt-10 pb-6 px-4 md:px-10 flex justify-center">
    <div class="mx-auto flex w-full gap-8 items-center justify-center">
      <div class="w-full max-w-sm mx-auto">
        <div class="flex flex-col md:flex-row w-full h-auto md:h-16 gap-2 md:gap-0" @click="openDatePicker">
          <!-- Check-in/Check-out -->
          <div class="flex w-full items-stretch rounded-xl h-14 md:h-full flex-1 border border-surface-border bg-surface-dark transition-colors group"
               :class="{ 'border-primary': activeField === 'dates' }"
               @click="setActiveField('dates')">
            <div class="text-[#95c6a9] flex items-center justify-center pl-4 mr-5">
              <span class="material-symbols-outlined mb-1">calendar_month</span>
            </div>
            <input 
              type="text" 
              class="w-full bg-transparent text-white focus:ring-0 placeholder:text-[#95c6a9] px-3 text-sm cursor-pointer"
              placeholder="Check-in - Check-out"
              v-model="dateRange"
              @focus="setActiveField('dates')"
              readonly
            />
            <!-- Date Picker Modal Trigger -->
            <div class="pr-3 flex items-center">
              <button 
                class="text-[#95c6a9] hover:text-primary"
              >
                <span class="material-symbols-outlined mt-1">edit_calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Date Picker Modal (Simulated) -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-surface-dark rounded-xl max-w-md w-full p-6 border border-surface-border">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-white text-xl font-bold">Select Dates</h3>
          <button @click="closeDatePicker" class="text-slate-400 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-slate-400 text-sm mb-2 block">Check-in</label>
            <input 
              type="date" 
              v-model="checkInDate"
              class="w-full p-3 rounded-lg bg-black border border-surface-border text-white"
            />
          </div>
          <div>
            <label class="text-slate-400 text-sm mb-2 block">Check-out</label>
            <input 
              type="date" 
              v-model="checkOutDate"
              class="w-full p-3 rounded-lg bg-black border border-surface-border text-white"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button 
            @click="applyDates"
            class="flex-1 bg-primary text-[#122118] font-bold py-3 rounded-lg hover:bg-[#2bc466] transition-colors"
          >
            Apply Dates
          </button>
          <button 
            @click="closeDatePicker"
            class="flex-1 border border-surface-border text-white font-bold py-3 rounded-lg hover:bg-surface-border transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSearch',
  data() {
    return {
      activeField: null,
      dateRange: 'Check-in - Check-out',
      guestSelection: '2 Guests, 1 Room',
      showDatePicker: false,
      checkInDate: '',
      checkOutDate: '',
    }
  },
  mounted() {
    // Set default dates (tomorrow and 3 days later)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const threeDaysLater = new Date()
    threeDaysLater.setDate(threeDaysLater.getDate() + 4)
    
    this.checkInDate = this.formatDate(tomorrow)
    this.checkOutDate = this.formatDate(threeDaysLater)
  },
  methods: {
    setActiveField(field) {
      this.activeField = field
    },
    
    openDatePicker() {
      this.showDatePicker = true
    },
    
    closeDatePicker() {
      this.showDatePicker = false
    },
    
    openGuestSelector() {
      alert('Guest selector modal would open here')
      // This would open a modal for selecting guests and rooms
    },
    
    applyDates() {
      if (this.checkInDate && this.checkOutDate) {
        const start = new Date(this.checkInDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        const end = new Date(this.checkOutDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        this.dateRange = `${start} - ${end}`
      }
      this.closeDatePicker()
      this.send();
    },
    
    send() {
      const searchCriteria = {
        check_in: this.checkInDate || '',
        check_out: this.checkOutDate || '',
        dates: this.dateRange,
        guests: this.guestSelection
      }
      this.$emit('search', searchCriteria)
    },
    
    formatDate(date) {
      return date.toISOString().split('T')[0]
    }
  },
  emits: ['search']
}
</script>