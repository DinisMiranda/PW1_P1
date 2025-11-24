<template>
  <div class="border-2 border-primary/50 bg-card-solo p-4 hover:border-primary hover:glow-cyan transition-all">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-bold text-white mb-1">{{ title }}</h3>
        <p class="text-sm text-white/70">{{ subtitle }}</p>
      </div>
      <span class="px-3 py-1 text-xs font-bold font-solo border-2 border-primary/50 bg-primary/10 text-primary"
            :class="badgeColor">{{ frequency }}</span>
    </div>
    <div class="mt-4 flex items-center gap-2">
      <button class="inline-flex items-center gap-2 border-2 border-primary/50 bg-primary/10 px-3 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white font-semibold">
        <span class="material-symbols-rounded text-sm">check_circle</span>
        Registar
      </button>
      <button class="inline-flex items-center gap-2 border-2 border-primary/50 bg-primary/10 px-3 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white font-semibold">
        <span class="material-symbols-rounded text-sm">edit</span>
        Editar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
defineProps({
  title: { type: String, default: 'Hábito' },
  subtitle: { type: String, default: 'Descrição' },
  frequency: { type: String, default: 'Diário' },
  color: { type: String, default: 'emerald' }
})

const badgeColor = computed(() => {
  const map = {
    emerald: 'bg-primary/20 text-primary border-primary/50',
    indigo: 'bg-neonPurple/20 text-neonPurple border-neonPurple/50',
    sky: 'bg-primary/20 text-primary border-primary/50',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/50'
  }
  return map[color] || map.emerald
})
</script>

<style scoped></style>


