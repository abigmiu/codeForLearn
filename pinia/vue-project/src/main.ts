import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from './pinia/index.js'
console.log('123123213')
const app = createApp(App)
console.log('1231')
app.use(createPinia())
app.use(router)

app.mount('#app')
