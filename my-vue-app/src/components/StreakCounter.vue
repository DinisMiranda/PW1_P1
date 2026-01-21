<template>
  <div class="inline-flex items-center gap-3 border-2 border-primary bg-card-solo px-5 py-3 glow-cyan">
    <div class="h-12 w-12 flex items-center justify-center">
      <img
        v-if="streakImage"
        :src="streakImage"
        alt="Streak"
        class="h-12 w-12 object-contain"
      />
    </div>
    <div class="leading-tight">
      <p class="text-xs font-solo text-primary/80 uppercase tracking-widest mb-1">Streak</p>
      <p class="text-2xl font-bold font-solo text-white text-glow">{{ userStore.streak }} dias</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const streakImages = {
  1: new URL('../imagens/streak/streak1.png', import.meta.url).href,
  2: new URL('../imagens/streak/streak2.png', import.meta.url).href,
  3: new URL('../imagens/streak/streak3.png', import.meta.url).href
}

function resolveStreakLevel(days) {
  if (days >= 8) return 3
  if (days >= 4) return 2
  if (days >= 1) return 1
  return 0
}

const streakImage = computed(() => {
  const level = resolveStreakLevel(userStore.streak)
  return level ? streakImages[level] : null
})
</script>

<style scoped></style>


