<template>
  <header class="sticky top-0 z-50 w-full border-b border-surface-border bg-background-dark/95 backdrop-blur-sm">
    <div class="px-4 md:px-10 py-3 flex items-center justify-between">
      <!-- Logo & Brand -->
      <div class="flex items-center gap-4 text-white">
        <div class="size-8 text-primary">
          <img src="../assets/Hotel_icon.png" alt="Hotel Logo" class="w-8 h-8 object-contain" />
        </div>
        <h2 class="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Battambang Hotel</h2>
      </div>
      
      <!-- Auth Buttons -->
      <div class="flex gap-3">
        <button
          v-if="!currentGuest"
          class="h-10 px-5 rounded-full border border-surface-border bg-surface-dark text-white hover:border-primary hover:text-primary transition-all text-sm font-bold"
          type="button"
          @click="$emit('login')"
        >
          Login
        </button>
        <button
          v-else
          class="h-10 px-5 rounded-full border border-surface-border bg-surface-dark text-white hover:border-primary hover:text-primary transition-all text-sm font-bold"
          type="button"
          @click="$emit('profile')"
        >
          Profile
        </button>
        <button
          v-if="currentGuest"
          class="h-10 px-5 rounded-full border border-surface-border bg-surface-dark text-white hover:border-primary hover:text-primary transition-all text-sm font-bold"
          type="button"
          @click="$emit('history')"
        >
          History
        </button>
        <button 
          class="flex items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-transparent border border-surface-border text-white hover:border-primary hover:text-primary transition-all text-sm font-bold"
          @click="signIn"
        >
          <span>Sign In</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    currentGuest: {
      type: Object,
      default: null
    }
  },
  methods: {
    signIn() {
      this.$emit('sign-in')
    },
  },
  emits: ['navigation-change', 'sign-in', 'login', 'profile', 'history']
}
</script>