<template>
  <div class="relative">
    <div
      class="border-2 bg-card-solo p-3 min-h-[80px] min-w-[80px] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all"
      :class="item ? getRarityClass(item.rarity) : 'border-primary/30'"
      @click="$emit('click')"
    >
      <p class="text-xs font-solo text-primary/80 uppercase mb-2 text-center">{{ itemStore.getSlotName(slot) }}</p>
      
      <div v-if="item" class="relative w-full flex items-center justify-center">
        <img
          v-if="item.image"
          :src="item.image"
          :alt="'Imagem de ' + item.name"
          class="max-h-16 object-contain"
        />
        <span v-else class="material-symbols-rounded text-primary/50 text-2xl">image</span>
        <button
          @click.stop="$emit('unequip', item.id)"
          class="absolute -top-1 -right-1 h-5 w-5 rounded-full border border-primary/60 bg-primary/20 text-[10px] text-white hover:bg-primary/30"
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

