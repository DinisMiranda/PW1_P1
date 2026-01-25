<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-bold font-solo text-primary text-glow">XP</span>
      <span class="text-sm font-bold text-white">{{ userStore.xpIntoCurrentLevel }} / {{ userStore.xpForNextLevel }}</span>
    </div>
    <div class="bar-hp-mp h-6 w-full overflow-hidden relative">
      <div 
        class="h-full transition-all duration-500 relative"
        :style="`width: ${userStore.xpProgress * 100}%`"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary via-xp to-primary" style="box-shadow: 0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.5);"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="text-xs font-bold text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]">{{ Math.round(userStore.xpProgress * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<style scoped></style>


