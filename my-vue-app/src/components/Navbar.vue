<template>
  <header class="sticky top-0 z-10 border-b-2 border-primary/50 bg-black/40 backdrop-blur-md">
    <div class="w-full px-0 py-4 flex items-center justify-between">
      <!-- left group: logo + nav -->
      <div class="flex items-center gap-6">
        <router-link to="/" class="flex items-center gap-2 pl-4 group">
          <span class="material-symbols-rounded text-primary">bolt</span>
          <h1 class="text-xl font-bold font-solo tracking-tight text-glow text-primary">LevelUp Habits</h1>
        </router-link>

        <nav v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-6 text-sm ml-6">
          <router-link 
            to="/" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Dashboard
            <span v-if="$route.path === '/'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
          <router-link 
            to="/habits" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Hábitos
            <span v-if="$route.path === '/habits'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
          <router-link 
            to="/stats" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Estatísticas
            <span v-if="$route.path === '/stats'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
          <router-link 
            to="/badges" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Badges
            <span v-if="$route.path === '/badges'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
          <router-link 
            to="/character" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Personagem
            <span v-if="$route.path === '/character'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
          <router-link 
            to="/inventory" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Inventário
            <span v-if="$route.path === '/inventory'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
          <router-link 
            to="/battle" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Batalha
            <span v-if="$route.path === '/battle'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
          <router-link 
            v-if="authStore.isAdmin"
            to="/admin" 
            class="hover:text-primary transition-all duration-200 relative font-semibold text-white"
            active-class="text-primary"
          >
            Admin
            <span v-if="$route.path === '/admin'" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-cyan"></span>
          </router-link>
        </nav>
      </div>

      <!-- right group: action buttons -->
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 pr-4">
        <router-link 
          to="/habits" 
          class="inline-flex items-center gap-2 border-2 border-primary bg-primary/20 px-4 py-2 text-white font-bold hover:bg-primary/30 transition-all glow-cyan"
        >
          <span class="material-symbols-rounded text-sm">add</span>
          <span class="text-sm">Novo Hábito</span>
        </router-link>
        <button 
          @click="handleLogout" 
          class="inline-flex items-center gap-2 border-2 border-primary/50 bg-primary/10 px-3 py-2 hover:border-primary hover:bg-primary/20 transition-all text-white"
        >
          <span class="material-symbols-rounded text-sm">logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import logo from '@/imagens/846766d325361041748074cce5c2df67-removebg-preview.png'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

// ...existing code...
const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped></style>