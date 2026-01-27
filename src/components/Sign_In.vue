<template>
  <div class="w-full max-w-xl mx-auto rounded-2xl border border-surface-border bg-surface-dark p-6 md:p-8 text-white">
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Guest Details</h2>
      <p class="mt-1 text-sm text-slate-400">Fields marked with * are required.</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium mb-2">
          Full Name <span class="text-red-400">*</span>
        </label>
        <input
          v-model.trim="form.name"
          type="text"
          class="w-full rounded-xl bg-background-dark border border-surface-border px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
          placeholder="Enter your full name"
          autocomplete="name"
        />
        <p v-if="errors.name" class="mt-2 text-sm text-red-400">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">
          Email <span class="text-red-400">*</span>
        </label>
        <input
          v-model.trim="form.email"
          type="email"
          class="w-full rounded-xl bg-background-dark border border-surface-border px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
          placeholder="you@example.com"
          autocomplete="email"
        />
        <p v-if="errors.email" class="mt-2 text-sm text-red-400">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Phone</label>
        <input
          v-model.trim="form.phone"
          type="tel"
          class="w-full rounded-xl bg-background-dark border border-surface-border px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
          placeholder="Optional phone number"
          autocomplete="tel"
        />
        <p v-if="errors.phone" class="mt-2 text-sm text-red-400">{{ errors.phone }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Profile Image (optional)</label>

        <div class="flex items-center gap-4">
          <div class="size-14 rounded-full border border-surface-border overflow-hidden bg-background-dark flex items-center justify-center">
            <img v-if="imagePreview" :src="imagePreview" alt="Profile preview" class="w-full h-full object-cover" />
            <span v-else class="material-symbols-outlined text-slate-400">person</span>
          </div>

          <div class="flex-1">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#122118] hover:file:bg-[#2bc466]"
              @change="onFileChange"
            />
            <p v-if="errors.image" class="mt-2 text-sm text-red-400">{{ errors.image }}</p>
          </div>
        </div>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="w-full h-12 rounded-full bg-primary text-[#122118] font-bold hover:bg-[#2bc466] transition-colors"
          :disabled="submitting"
        >
          {{ submitting ? 'Submitting...' : 'Submit' }}
        </button>
        <p v-if="submitError" class="mt-3 text-sm text-red-400">{{ submitError }}</p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  emits: ['submit'],
  data() {
    return {
      submitting: false,
      submitError: '',
      imagePreview: '',
      form: {
        name: '',
        email: '',
        phone: '',
        imageFile: null
      },
      errors: {
        name: '',
        email: '',
        phone: '',
        image: ''
      }
    }
  },
  methods: {
    validate() {
      this.errors = { name: '', email: '', phone: '', image: '' }
      this.submitError = ''

      if (!this.form.name) {
        this.errors.name = 'Full Name is required.'
      }

      if (!this.form.email) {
        this.errors.email = 'Email is required.'
      } else {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
        if (!ok) this.errors.email = 'Please enter a valid email address.'
      }

      if (this.form.phone) {
        const ok = /^[+()\d\s-]{6,}$/.test(this.form.phone)
        if (!ok) this.errors.phone = 'Please enter a valid phone number.'
      }

      if (this.form.imageFile) {
        const maxBytes = 2 * 1024 * 1024
        if (this.form.imageFile.size > maxBytes) {
          this.errors.image = 'Image must be 2MB or less.'
        }
      }

      return !this.errors.name && !this.errors.email && !this.errors.phone && !this.errors.image
    },
    onFileChange(e) {
      const file = e?.target?.files?.[0] || null
      this.form.imageFile = file
      this.errors.image = ''

      if (this.imagePreview) {
        URL.revokeObjectURL(this.imagePreview)
        this.imagePreview = ''
      }

      if (file) {
        this.imagePreview = URL.createObjectURL(file)
      }
    },
    async handleSubmit() {
      if (!this.validate()) return

      this.submitting = true
      this.submitError = ''
      try {
        const payload = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          imageFile: this.form.imageFile
        }
        this.$emit('submit', payload)
      } catch (e) {
        this.submitError = e?.message || 'Submit failed.'
      } finally {
        this.submitting = false
      }
    }
  },
  unmounted() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview)
    }
  }
}
</script>