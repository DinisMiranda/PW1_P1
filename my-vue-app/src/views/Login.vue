<template>
 <div class="fixed inset-0 flex items-center justify-center bg-background">
    <div class="w-full max-w-md border-2 border-primary bg-card-solo p-8 glow-cyan">
      <h2 class="mb-6 text-3xl font-bold font-solo text-primary text-glow uppercase tracking-wider">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full border-2 border-primary/50 bg-black/50 px-4 py-3 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
            placeholder="Digite o seu username"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border-2 border-primary/50 bg-black/50 px-4 py-3 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
            placeholder="Digite a sua password"
          />
        </div>
        <button
          type="submit"
          class="w-full border-2 border-primary bg-primary/20 px-4 py-3 text-white hover:bg-primary/30 font-bold font-solo uppercase tracking-wider glow-cyan transition-all"
        >
          Entrar
        </button>
      </form>
      <p v-if="error" class="mt-4 text-sm text-red-400 font-semibold">{{ error }}</p>
      <p class="mt-4 text-xs text-white/60 text-center">
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  const success = await authStore.login(username.value, password.value)
  if (success) router.push('/')
  else error.value = 'Credenciais inválidas'
}
</script>

<style scoped></style>

