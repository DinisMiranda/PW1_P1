<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold font-solo text-white uppercase tracking-wider">Inventário</h2>
      <div class="flex items-center gap-3">
        <span class="text-sm text-white/70">Caixas: {{ boxCount }}</span>
        <button
          @click="openBox"
          :disabled="boxCount === 0"
          class="border-2 border-primary bg-primary/20 px-4 py-2 text-white font-bold hover:bg-primary/30 glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Abrir Caixa ({{ boxCount }})
        </button>
      </div>
    </div>

    <!-- Personagem com Slots de Equipamento -->
    <div class="mb-8 border-2 border-primary/50 bg-card-solo p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Slot: Helmet (Topo) -->
        <div class="flex justify-center mb-4">
          <EquipmentSlot 
            slot="helmet" 
            :item="getEquippedItem('helmet')"
            @unequip="unequipItem"
          />
        </div>

        <!-- Linha do Meio: Offhand - Personagem - Mainhand -->
        <div class="flex items-center justify-center gap-6 mb-4">
          <!-- Offhand (Esquerda) -->
          <EquipmentSlot 
            slot="offhand" 
            :item="getEquippedItem('offhand')"
            @unequip="unequipItem"
          />

          <!-- Personagem no Centro -->
          <div class="flex flex-col items-center justify-center">
            <div class="border-2 border-primary/50 bg-black/30 w-32 h-48 flex items-center justify-center">
              <div class="text-center">
                <span class="material-symbols-rounded text-6xl text-primary/50">person</span>
                <p class="mt-2 text-sm font-bold text-white" v-if="characterStore.characterType">
                  {{ characterStore.characterType }}
                </p>
                <p v-else class="mt-2 text-xs text-white/60">Cria um personagem</p>
              </div>
            </div>
            <div class="text-center text-xs text-white/80 mt-2">
              <p>Nível: {{ characterStore.level }}</p>
            </div>
          </div>

          <!-- Mainhand (Direita) -->
          <EquipmentSlot 
            slot="mainhand" 
            :item="getEquippedItem('mainhand')"
            @unequip="unequipItem"
          />
        </div>

        <!-- Slot: Belt (Meio) -->
        <div class="flex justify-center mb-4">
          <EquipmentSlot 
            slot="belt" 
            :item="getEquippedItem('belt')"
            @unequip="unequipItem"
          />
        </div>

        <!-- Slots Inferiores: Chestplate, Leggings, Boots -->
        <div class="flex justify-center gap-4">
          <EquipmentSlot 
            slot="chestplate" 
            :item="getEquippedItem('chestplate')"
            @unequip="unequipItem"
          />
          <EquipmentSlot 
            slot="leggings" 
            :item="getEquippedItem('leggings')"
            @unequip="unequipItem"
          />
          <EquipmentSlot 
            slot="boots" 
            :item="getEquippedItem('boots')"
            @unequip="unequipItem"
          />
        </div>
      </div>
    </div>

    <!-- Inventário -->
    <div>
      <h3 class="mb-4 text-lg font-bold font-solo text-primary uppercase tracking-wider">Inventário ({{ itemStore.inventory.length }})</h3>
      <div v-if="itemStore.inventory.length === 0" class="border-2 border-primary/30 bg-card-solo p-8 text-center text-white/60">
        <p>Nenhum item no inventário. Abre uma caixa para receber itens!</p>
      </div>
      <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="item in itemStore.inventory"
          :key="item.id"
          :class="getRarityClass(item.rarity)"
          class="p-3 border-2 cursor-pointer hover:border-primary transition-all flex flex-col h-full"
          @click="equipItem(item.id)"
        >
          <p class="font-bold text-white mb-1 text-sm">{{ item.name }}</p>
          <p class="text-xs text-white/60 mb-2">{{ itemStore.getRarityInfo(item.rarity).name }}</p>
          <p class="text-xs text-primary/80 mb-2">{{ itemStore.getSlotName(item.slot) }}</p>
          <div class="text-xs text-white/80 space-y-0.5 mb-2">
            <div v-if="item.stats.str">STR: +{{ item.stats.str }}</div>
            <div v-if="item.stats.vit">VIT: +{{ item.stats.vit }}</div>
            <div v-if="item.stats.agi">AGI: +{{ item.stats.agi }}</div>
            <div v-if="item.stats.int">INT: +{{ item.stats.int }}</div>
          </div>
          <div class="mt-auto pt-2">
            <div class="flex items-center gap-2">
              <button
                @click.stop="equipItem(item.id)"
                class="flex-1 border-2 border-primary/50 bg-primary/10 px-2 py-1 text-xs text-white hover:bg-primary/20 transition-all font-semibold"
              >
                Equipar
              </button>
              <button
                @click.stop="upgradeItem(item.id)"
                class="flex-1 border-2 border-secondary/60 bg-secondary/15 px-2 py-1 text-[11px] text-white hover:bg-secondary/25 transition-all font-semibold"
              >
                Upgrade
              </button>
              <button
                @click.stop="deleteItem(item.id)"
                class="flex-1 border-2 border-error/60 bg-error/10 px-2 py-1 text-[11px] text-white hover:bg-error/20 transition-all font-semibold"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useItemStore } from '../stores/items'
import { useCharacterStore } from '../stores/character'
import EquipmentSlot from '../components/EquipmentSlot.vue'

const itemStore = useItemStore()
const characterStore = useCharacterStore()
const boxCount = computed(() => itemStore.lootBoxes.phase1 || 0)

function getEquippedItem(slot) {
  return itemStore.equippedItems.find(item => item.slot === slot)
}

function equipItem(itemId) {
  itemStore.equipItem(itemId)
}

function unequipItem(itemId) {
  itemStore.unequipItem(itemId)
}

function openBox() {
  if (boxCount.value <= 0) {
    alert('Não tens caixas para abrir.')
    return
  }
  itemStore.openBox('phase1', 'common', characterStore.characterType || 'generic')
}

function deleteItem(itemId) {
  itemStore.removeItem(itemId)
}

function upgradeItem(itemId) {
  const base = itemStore.inventory.find(i => i.id === itemId)
  if (!base) return
  const material = itemStore.inventory.find(i => i.id !== itemId && i.slot === base.slot && i.rarity === base.rarity)
  if (!material) {
    alert('Precisas de outro item do mesmo slot e raridade para fazer upgrade.')
    return
  }
  const upgraded = itemStore.upgradeItems(base.id, material.id)
  if (!upgraded) {
    alert('Não foi possível fazer upgrade.')
  }
}

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

