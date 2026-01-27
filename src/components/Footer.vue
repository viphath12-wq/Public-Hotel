<template>
  <footer class="bg-surface-dark border-t border-surface-border text-center py-12 px-4">
    <div class="mx-auto flex flex-col gap-6">
      <!-- Navigation Links -->
      <div class="flex flex-wrap items-center justify-center gap-6">
        <a 
          v-for="link in footerLinks" 
          :key="link.text"
          :href="link.href" 
          class="text-[#95c6a9] hover:text-primary transition-colors text-base font-normal min-w-40"
        >
          {{ link.text }}
        </a>
      </div>
      
      <!-- Social Icons -->
      <div class="flex flex-wrap justify-center gap-6">
        <a 
          v-for="social in socialLinks" 
          :key="social.name"
          :href="social.href" 
          class="text-[#95c6a9] hover:text-primary hover:scale-110 transition-all"
          :title="social.name"
        >
          <span class="material-symbols-outlined text-[24px]">{{ social.icon }}</span>
        </a>
      </div>
      
      <!-- Copyright -->
      <p class="text-[#95c6a9] text-sm md:text-base font-normal">
        © {{ currentYear }} Sanctuary Hotel Management. All rights reserved.
      </p>
      
      <!-- Newsletter Signup (Optional Addition) -->
      <div class="mt-6 max-w-md mx-auto">
        <div class="flex gap-2">
          <input 
            type="email" 
            placeholder="Subscribe to our newsletter"
            class="flex-1 px-4 py-2 rounded-full bg-background-dark border border-surface-border text-white placeholder:text-[#95c6a9] focus:outline-none focus:border-primary"
            v-model="email"
            @keyup.enter="subscribeNewsletter"
          />
          <button 
            class="px-6 py-2 rounded-full bg-primary text-[#122118] font-bold hover:bg-[#2bc466] transition-colors"
            @click="subscribeNewsletter"
          >
            Subscribe
          </button>
        </div>
        <p v-if="subscriptionMessage" class="mt-2 text-sm" :class="subscriptionMessage.type === 'success' ? 'text-primary' : 'text-orange-400'">
          {{ subscriptionMessage.text }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      footerLinks: [
        { text: 'Privacy Policy', href: '#' },
        { text: 'Terms of Service', href: '#' },
        { text: 'Accessibility', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
        { text: 'Site Map', href: '#' }
      ],
      socialLinks: [
        { name: 'Instagram', href: '#', icon: 'photo_camera' },
        { name: 'Twitter', href: '#', icon: 'flutter_dash' },
        { name: 'Facebook', href: '#', icon: 'groups' },
        { name: 'YouTube', href: '#', icon: 'play_circle' },
        { name: 'LinkedIn', href: '#', icon: 'work' }
      ],
      email: '',
      subscriptionMessage: null
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  methods: {
    subscribeNewsletter() {
      if (!this.email) {
        this.subscriptionMessage = {
          type: 'error',
          text: 'Please enter your email address'
        }
        return
      }
      
      if (!this.validateEmail(this.email)) {
        this.subscriptionMessage = {
          type: 'error',
          text: 'Please enter a valid email address'
        }
        return
      }
      
      // Simulate API call
      setTimeout(() => {
        this.subscriptionMessage = {
          type: 'success',
          text: 'Thank you for subscribing to our newsletter!'
        }
        this.email = ''
        
        // Clear message after 5 seconds
        setTimeout(() => {
          this.subscriptionMessage = null
        }, 5000)
      }, 500)
    },
    
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }
  }
}
</script>