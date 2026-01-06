<template>
  <div class="border-2 bg-card-solo p-4 text-center transition-all"
       :class="isLocked ? 'opacity-40 border-primary/20' : 'border-primary/50 hover:border-primary hover:glow-cyan'">
    <div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center border-2"
         :class="isLocked ? 'bg-black/50 border-primary/20 text-white/30' : 'bg-primary/20 border-primary text-primary glow-cyan'">
      <span class="material-symbols-rounded text-4xl">{{ icon }}</span>
    </div>
    <p class="font-bold text-white mb-1">{{ title }}</p>
    <p class="text-xs text-white/60">{{ description }}</p>
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


