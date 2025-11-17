<template>
  <div class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-card">
    <span class="material-symbols-rounded text-xp">military_tech</span>
    <div class="leading-tight">
      <p class="text-xs text-slate-500">Nível</p>
      <p class="text-sm font-semibold">{{ userStore.level }}</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<style scoped></style>


