<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card text-center">
    <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full"
         :class="isLocked ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'">
      <span class="material-symbols-rounded text-2xl">{{ icon }}</span>
    </div>
    <p class="font-medium">{{ title }}</p>
    <p class="text-sm text-slate-500">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Badge' },
  description: { type: String, default: 'Condição' },
  icon: { type: String, default: 'military_tech' },
  isLocked: { type: Boolean, default: false }
})
</script>

<style scoped></style>


