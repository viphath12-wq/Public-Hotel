<template>
  <div 
    class="group flex flex-col bg-surface-dark rounded-xl overflow-hidden border border-surface-border transition-all duration-300"
    :class="{
      'hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:-translate-y-1': room.available,
      'opacity-75': !room.available
    }"
  >
    <div class="relative h-68 overflow-hidden">
      <div v-if="room.badge" class="absolute top-3 left-3 z-10">
        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" :class="room.badgeColor">
          {{ room.badge }}
        </span>
      </div>
      
      <div class="absolute top-3 right-3 z-10">
        <button 
          class="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors"
          :class="room.favorite ? 'bg-primary text-[#122118]' : 'text-white hover:bg-primary hover:text-[#122118]'"
          @click="$emit('toggle-favorite', room.id)"
        >
          <span class="material-symbols-outlined text-[18px]">favorite</span>
        </button>
      </div>
      
      <img 
        :alt="room.title" 
        class="w-full h-full object-cover transition-transform duration-700 filter saturate-[0.8]"
        :class="room.available ? 'group-hover:scale-105 group-hover:saturate-100' : 'grayscale opacity-50'"
        :src="room.image"
      />
      
      <!-- Image Carousel Indicators -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
      </div>
    </div>
    
    <div class="p-5 flex flex-col flex-1">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-bold text-white transition-colors" :class="room.available ? 'group-hover:text-primary' : ''">
          {{ room.title }}
        </h3>
      </div>
      
      <div class="flex gap-4 mb-4 text-slate-400 text-sm">
        <div class="flex items-center gap-1.5" title="Guests">
          <span class="material-symbols-outlined text-[18px]">group</span>
          <span>{{ room.guests }}</span>
        </div>
        <div class="flex items-center gap-1.5" title="Size">
          <span class="material-symbols-outlined text-[18px]">straighten</span>
          <span>{{ room.size }}</span>
        </div>
        <div class="flex items-center gap-1.5" title="Bed Type">
          <span class="material-symbols-outlined text-[18px]">bed</span>
          <span>{{ room.bedType }}</span>
        </div>
      </div>
      
      <div class="mt-auto flex items-center justify-between pt-4 border-t border-surface-border">
        <div>
          <p class="text-xs text-slate-400">Start from</p>
          <p 
            class="text-2xl font-bold"
            :class="room.available ? 'text-primary' : 'text-slate-400'"
          >
            ${{ room.price }}<span class="text-sm font-normal" :class="room.available ? 'text-white' : 'text-slate-500'">/night</span>
          </p>
        </div>
        <button 
          class="px-5 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-primary transition-colors"
          @click="$emit('book', room)"
        >Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomCard',
  props: {
    room: {
      type: Object,
      required: true
    }
  },
  methods: {
    getAmenityIcon(amenity) {
      const icons = {
        'Balcony': 'balcony',
        'Minibar': 'local_bar',
        'Bathtub': 'bathtub',
        'Workspace': 'work',
        'Private Garden': 'yard',
        'Plunge Pool': 'pool',
        'Smart TV': 'tv',
        'Coffee': 'coffee_maker',
        'Kids Area': 'toys',
        'Kitchenette': 'kitchen',
        'Panoramic View': 'panorama',
        'Jacuzzi': 'hot_tub',
        'Chef\'s Kitchen': 'local_dining'
      }
      return icons[amenity] || 'check'
    },
    viewDetails() {
      if (this.room.available) {
        alert(`Viewing details for: ${this.room.title}`)
      }
    }
  }
}
</script>