<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-medium">{{ title }}</h3>
        <p class="text-sm text-slate-500">{{ subtitle }}</p>
      </div>
      <span class="rounded-full px-2 py-1 text-xs font-medium"
            :class="badgeColor">{{ frequency }}</span>
    </div>
    <div class="mt-4 flex items-center gap-2">
      <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
        <span class="material-symbols-rounded">check_circle</span>
        Registar
      </button>
      <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
        <span class="material-symbols-rounded">edit</span>
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
    emerald: 'bg-emerald-50 text-emerald-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700'
  }
  return map[color] || map.emerald
})
</script>

<style scoped></style>


