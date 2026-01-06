import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'
import { useCharacterStore } from './stores/character'
import { useItemStore } from './stores/items'
import { useBattleStore } from './stores/battle'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar stores
const authStore = useAuthStore()
const userStore = useUserStore()
const characterStore = useCharacterStore()
const itemStore = useItemStore()
const battleStore = useBattleStore()

authStore.init()
userStore.init()
characterStore.init()
itemStore.init()
battleStore.init()

app.mount('#app')
