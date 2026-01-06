<template>
  <div class="inline-flex items-center gap-3 border-2 border-primary bg-card-solo px-5 py-3 glow-cyan">
    <span class="material-symbols-rounded text-primary text-3xl text-glow">military_tech</span>
    <div class="leading-tight">
      <p class="text-xs font-solo text-primary/80 uppercase tracking-widest mb-1">Nível</p>
      <p class="text-2xl font-bold font-solo text-white text-glow">{{ userStore.level }}</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<style scoped></style>


