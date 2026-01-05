<template>
  <div class="relative">
    <div
      class="relative border-2 bg-card-solo p-3 min-h-[100px] min-w-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all"
      :class="item ? getRarityClass(item.rarity) : 'border-primary/30'"
      @click="$emit('click')"
    >
      <p class="text-[11px] font-solo text-primary/80 uppercase mb-2 text-center">{{ itemStore.getSlotName(slot) }}</p>

      <div v-if="item" class="relative w-full flex items-center justify-center">
        <img :src="item.image" :alt="item.name" class="h-14 object-contain" />
        <button
          @click.stop="$emit('unequip', item.id)"
          class="absolute -top-2 -right-2 h-6 w-6 rounded-full border border-primary/60 bg-black/70 text-white text-[10px] hover:bg-primary/30 flex items-center justify-center"
          title="Desequipar"
        >
          ×
        </button>
      </div>
      <div v-else class="text-white/30 text-xs text-center">
        <span class="material-symbols-rounded text-2xl">add</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useItemStore } from '../stores/items'

defineProps({
  slot: String,
  item: Object
})

defineEmits(['unequip', 'click'])

const itemStore = useItemStore()

function getRarityClass(rarity) {
  if (!rarity) return 'border-slate-500 bg-slate-500/10'
  const colors = {
    common: 'border-slate-500 bg-slate-500/10',
    uncommon: 'border-primary bg-primary/10',
    rare: 'border-purple-500 bg-purple-500/10',
    epic: 'border-orange-500 bg-orange-500/10',
    legendary: 'border-yellow-500 bg-yellow-500/10'
  }
  return colors[rarity] || colors.common
}
</script>

<style scoped></style>

