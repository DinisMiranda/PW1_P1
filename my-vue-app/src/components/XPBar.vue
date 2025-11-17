<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium">XP</span>
      <span class="text-sm font-medium text-slate-500">{{ userStore.xp }} / {{ userStore.xpForNextLevel }}</span>
    </div>
    <div class="h-3 w-full rounded-xl bg-slate-100 overflow-hidden">
      <div class="h-full bg-xp rounded-xl transition-all" :style="`width: ${userStore.xpProgress * 100}%`"></div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<style scoped></style>


