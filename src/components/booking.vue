<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Complete Your Reservation</h2>
        
        <form @submit.prevent="submitBooking" class="space-y-6">
          <!-- Guest Information -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Guest Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  v-model="form.phone"
                  type="tel" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="+855 12 345 678"
                />
              </div>
            </div>
          </div>

          <!-- Reservation Details -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Stay Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <input 
                  v-model="form.check_in"
                  type="date" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                <input 
                  v-model="form.check_out"
                  type="date" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          <!-- Payment Section with QR Code -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center text-center">
              <p class="text-sm text-gray-600 mb-4">Scan the QR code below to complete your payment</p>
              
              <!-- QR Code Image -->
              <div class="bg-white p-2 rounded-lg shadow-sm border border-gray-200 mb-4">
                <img 
                  src="/QRcode.jpg" 
                  alt="Payment QR Code" 
                  class="w-48 h-48 object-contain"
                />
              </div>
              
              <p class="text-xs text-gray-500 mb-4">Supported Banks: ABA, ACLEDA, Wing</p>
              
              <div class="w-full max-w-md">
                <label class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition">
                  <input 
                    v-model="form.payment_confirmed"
                    type="checkbox" 
                    required
                    class="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span class="text-sm text-gray-700 text-left">
                    I confirm that I have transferred the payment using the QR code above.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="isSubmitting" class="animate-spin material-symbols-outlined">refresh</span>
              {{ isSubmitting ? 'Processing Booking...' : 'Confirm Booking' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const isSubmitting = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  check_in: '',
  check_out: '',
  payment_confirmed: false
})

const submitBooking = async () => {
  if (!form.value.payment_confirmed) return

  isSubmitting.value = true
  try {
    // Replace with your actual API endpoint
    // Assuming the backend handles guest creation and reservation in one go
    const response = await axios.post('http://localhost:8000/api/bookings', {
      guest_name: form.value.name,
      guest_email: form.value.email,
      guest_phone: form.value.phone,
      check_in: form.value.check_in,
      check_out: form.value.check_out,
      payment_status: 'paid_via_qr'
    })
    
    alert('Booking created successfully! We will contact you shortly.')
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      check_in: '',
      check_out: '',
      payment_confirmed: false
    }
  } catch (error) {
    console.error('Booking failed:', error)
    alert('Failed to create booking. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>