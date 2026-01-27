import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import toast from './util/toast'

createApp(App).use(toast).mount('#app')
