<template>
  <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="w-full px-0 py-4 flex items-center justify-between">
      <!-- left group: logo + nav -->
      <div class="flex items-center gap-6">
        <router-link to="/" class="flex items-center gap-2 pl-4">
          <img :src="logo" alt="LevelUp Habits" class="h-6 w-6">
          <h1 class="text-xl font-semibold tracking-tight font-display">LevelUp Habits</h1>
        </router-link>

        <nav v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-6 text-sm ml-6">
          <router-link to="/" class="hover:text-primary" active-class="text-primary font-medium">Dashboard</router-link>
          <router-link to="/habits" class="hover:text-primary" active-class="text-primary font-medium">Hábitos</router-link>
          <router-link to="/stats" class="hover:text-primary" active-class="text-primary font-medium">Estatísticas</router-link>
          <router-link to="/badges" class="hover:text-primary" active-class="text-primary font-medium">Badges</router-link>
        </nav>
      </div>

      <!-- right group: action buttons -->
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 pr-4">
        <router-link to="/habits" class="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-white hover:brightness-95">
          <span class="material-symbols-rounded">add</span>
          <span class="text-sm font-medium">Novo Hábito</span>
        </router-link>
        <button @click="handleLogout" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
          <span class="material-symbols-rounded">logout</span>
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