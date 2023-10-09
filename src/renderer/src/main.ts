import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import 'virtual:svg-icons-register'

import '@renderer/assets/css/main.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import Icon from '@renderer/components/Icon.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.component('Icon',Icon)
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
