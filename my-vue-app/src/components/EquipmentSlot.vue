<template>
  <div class="relative">
    <div
      class="border-2 bg-card-solo p-3 min-h-[80px] min-w-[80px] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all"
      :class="item ? getRarityClass(item.rarity) : 'border-primary/30'"
      @click="$emit('click')"
    >
      <p class="text-xs font-solo text-primary/80 uppercase mb-2 text-center">{{ itemStore.getSlotName(slot) }}</p>
      
      <div v-if="item" class="w-full">
        <p class="text-xs font-bold text-white mb-1 text-center truncate">{{ item.name }}</p>
        <div class="text-[10px] text-white/80 space-y-0.5">
          <div v-if="item.stats.str" class="text-center">STR: +{{ item.stats.str }}</div>
          <div v-if="item.stats.vit" class="text-center">VIT: +{{ item.stats.vit }}</div>
          <div v-if="item.stats.agi" class="text-center">AGI: +{{ item.stats.agi }}</div>
          <div v-if="item.stats.int" class="text-center">INT: +{{ item.stats.int }}</div>
        </div>
        <button
          @click.stop="$emit('unequip', item.id)"
          class="mt-2 w-full border border-primary/50 bg-primary/10 px-1 py-0.5 text-[10px] text-white hover:bg-primary/20 transition-all"
        >
          X
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

