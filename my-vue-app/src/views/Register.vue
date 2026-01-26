<template>
  <div class="fixed inset-0 flex items-center justify-center bg-background">
    <div class="w-full max-w-md border-2 border-primary bg-card-solo p-8 glow-cyan">
      <h2 class="mb-6 text-3xl font-bold font-solo text-primary text-glow uppercase tracking-wider">Registar</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full border-2 border-primary/50 bg-black/50 px-4 py-3 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
            placeholder="Escolha um username"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border-2 border-primary/50 bg-black/50 px-4 py-3 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
            placeholder="O seu email"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="4"
            class="w-full border-2 border-primary/50 bg-black/50 px-4 py-3 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
            placeholder="Crie uma password"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Confirmar Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            minlength="4"
            class="w-full border-2 border-primary/50 bg-black/50 px-4 py-3 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
            placeholder="Repita a password"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full border-2 border-primary bg-primary/20 px-4 py-3 text-white hover:bg-primary/30 font-bold font-solo uppercase tracking-wider glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'A criar conta...' : 'Criar conta' }}
        </button>
      </form>
      <p v-if="error" class="mt-4 text-sm text-red-400 font-semibold">{{ error }}</p>
      <p class="mt-6 text-xs text-white/60 text-center">
        Já tem conta?
        <router-link to="/login" class="text-primary font-semibold hover:underline">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

// Faz validação básica e delega criação de conta ao auth store
async function handleRegister() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'As passwords não coincidem.'
    return
  }

  loading.value = true
  try {
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    })
    router.push('/')
  } catch (err) {
    error.value = err?.message || 'Erro ao criar conta.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
