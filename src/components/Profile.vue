<template>
  <div class="w-full max-w-xl mx-auto rounded-2xl border border-surface-border bg-surface-dark p-6 md:p-8 text-white">
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold">Profile</h2>
        <p class="mt-1 text-sm text-slate-400">Stored locally for this website.</p>
      </div>

      <button
        type="button"
        class="h-10 px-4 rounded-full border border-surface-border text-white hover:border-primary"
        @click="logout"
      >
        Logout
      </button>
    </div>

    <div class="flex items-center gap-4 mb-6">
      <div class="size-16 rounded-full border border-surface-border overflow-hidden bg-background-dark flex items-center justify-center">
        <img v-if="imagePreview" :src="imagePreview" alt="Profile" class="w-full h-full object-cover" />
        <span v-else class="material-symbols-outlined text-slate-400">person</span>
      </div>
      <div class="flex-1">
        <p class="text-sm text-slate-400">Profile Image (optional)</p>
        <input
          type="file"
          accept="image/*"
          class="mt-2 block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#122118] hover:file:bg-[#2bc466]"
          @change="onFileChange"
        />
      </div>
    </div>

    <form class="space-y-5" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium mb-2">Full Name</label>
        <input
          v-model.trim="form.name"
          type="text"
          class="w-full rounded-xl bg-background-dark border border-surface-border px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
          placeholder="Your name"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input
          v-model.trim="form.email"
          type="email"
          class="w-full rounded-xl bg-background-dark border border-surface-border px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Phone</label>
        <input
          v-model.trim="form.phone"
          type="tel"
          class="w-full rounded-xl bg-background-dark border border-surface-border px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
          placeholder="Optional"
        />
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="w-full h-12 rounded-full bg-primary text-[#122118] font-bold hover:bg-[#2bc466] transition-colors"
        >
          Save Profile
        </button>
        <p v-if="message" class="mt-3 text-sm" :class="messageType === 'ok' ? 'text-primary' : 'text-red-400'">
          {{ message }}
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import configurl from '../util/configurl'

const STORAGE_KEY = 'public_guest'

export default {
  name: 'Profile',
  emits: ['updated', 'logout'],
  data() {
    return {
      form: {
        id: null,
        name: '',
        email: '',
        phone: '',
        image: ''
      },
      imagePreview: '',
      message: '',
      messageType: 'ok'
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    getImageBaseUrl() {
      return configurl.image_path
    },
    resolveImageUrl(value) {
      const v = (value ?? '') ? String(value) : ''
      if (!v) return ''
      if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('data:')) return v
      if (v.startsWith('blob:')) return ''
      return `${this.getImageBaseUrl()}${v}`
    },
    load() {
      this.message = ''
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        if (!saved) return

        this.form.id = saved.id ?? null
        this.form.name = saved.name ?? ''
        this.form.email = saved.email ?? ''
        this.form.phone = saved.phone ?? ''
        this.form.image = saved.image ?? ''

        this.imagePreview = this.resolveImageUrl(this.form.image)
      } catch (e) {
        this.messageType = 'err'
        this.message = 'Failed to load profile.'
      }
    },
    async onFileChange(e) {
      const file = e?.target?.files?.[0]
      if (!file) return

      const maxBytes = 2 * 1024 * 1024
      if (file.size > maxBytes) {
        this.messageType = 'err'
        this.message = 'Image must be 2MB or less.'
        return
      }

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Failed to read image'))
        reader.readAsDataURL(file)
      })

      if (typeof dataUrl === 'string') {
        this.form.image = dataUrl
        this.imagePreview = dataUrl
      }
    },
    save() {
      this.message = ''
      try {
        const payload = {
          id: this.form.id,
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          image: this.form.image
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        this.messageType = 'ok'
        this.message = 'Saved.'
        this.$emit('updated', payload)
      } catch (e) {
        this.messageType = 'err'
        this.message = 'Failed to save profile.'
      }
    },
    logout() {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
      }
      this.form = { id: null, name: '', email: '', phone: '', image: '' }
      this.imagePreview = ''
      this.message = ''
      this.$emit('logout')
    }
  },
  unmounted() {}
}
</script>