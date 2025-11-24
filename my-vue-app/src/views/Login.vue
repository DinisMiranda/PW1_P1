<template>
 <div class="fixed inset-0 flex items-center justify-center">
    <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-card">
      <h2 class="mb-6 text-2xl font-semibold font-display">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
            placeholder="Digite o seu username"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
            placeholder="Digite a sua password"
          />
        </div>
        <button
          type="submit"
          class="w-full rounded-xl bg-primary px-4 py-2 text-white hover:brightness-95 font-medium"
        >
          Entrar
        </button>
      </form>
      <p v-if="error" class="mt-4 text-sm text-red-500">{{ error }}</p>
      <p class="mt-4 text-xs text-slate-500 text-center">
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

function handleLogin() {
  error.value = ''
  if (authStore.login(username.value, password.value)) {
    router.push('/')
  } else {
    error.value = 'Credenciais inválidas'
  }
}
</script>

<style scoped></style>

