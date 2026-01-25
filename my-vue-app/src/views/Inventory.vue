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
        <div class="flex justify-center mb-5">
          <EquipmentSlot 
            slot="helmet" 
            :item="getEquippedItem('helmet')"
            @unequip="unequipItem"
          />
        </div>

        <!-- Linha do Meio: Colunas com acessório/arma -->
        <div class="flex items-start justify-center gap-8 mb-4">
          <div class="flex flex-col items-center gap-2">
            <EquipmentSlot 
              slot="mainhand" 
              :item="getEquippedItem('mainhand')"
              @unequip="unequipItem"
            />
            <EquipmentSlot 
              slot="belt" 
              :item="getEquippedItem('belt')"
              @unequip="unequipItem"
            />
          </div>

          <!-- Personagem no Centro -->
          <div class="flex flex-col items-center justify-center">
            <div class="border-2 border-primary/50 bg-black/30 w-32 h-48 flex items-center justify-center relative overflow-visible">
              <img
                v-if="characterSprite"
                :src="characterSprite"
                :alt="`Retrato ${characterTypeLabel || 'do personagem'}`"
                class="pointer-events-none absolute left-1/2 top-1/2 w-[26rem] h-[26rem] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_24px_rgba(0,255,255,0.5)]"
              />
              <div v-else class="text-center">
                <span class="material-symbols-rounded text-6xl text-primary/50">person</span>
              </div>
            </div>
            <div class="text-center text-xs text-white/80 mt-4 flex flex-col items-center">
              <p v-if="characterSprite" class="text-base font-bold text-white tracking-wide">
                {{ characterTypeLabel }}
              </p>
              <p v-else-if="characterTypeLabel" class="text-sm font-bold text-white">
                {{ characterTypeLabel }}
              </p>
              <p v-else class="text-xs text-white/60">Cria um personagem</p>
              <p class="mt-2">Nível: {{ characterStore.level }}</p>
            </div>
          </div>

          <div class="flex flex-col items-center gap-2">
            <EquipmentSlot 
              slot="offhand" 
              :item="getEquippedItem('offhand')"
              @unequip="unequipItem"
            />
            <EquipmentSlot 
              slot="amulet" 
              :item="getEquippedItem('amulet')"
              @unequip="unequipItem"
            />
          </div>
        </div>

        <!-- Slots Inferiores: Chestplate, Boots -->
        <div class="flex justify-center gap-6">
          <EquipmentSlot 
            slot="chestplate" 
            :item="getEquippedItem('chestplate')"
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
          class="p-3 border-2 cursor-pointer hover:border-primary transition-all flex h-full"
          @click="equipItem(item.id)"
        >
          <div class="flex-1 flex flex-col gap-1 pr-2">
            <p class="font-bold text-white text-sm">{{ formatItemName(item.name) }}</p>
            <p class="text-xs text-white/60">{{ itemStore.getRarityInfo(item.rarity).name }}</p>
            <p class="text-xs text-primary/80">{{ itemStore.getSlotName(item.slot) }}</p>
            <div class="text-xs text-white/80 space-y-0.5">
              <div v-if="item.stats.str">STR: +{{ item.stats.str }}</div>
              <div v-if="item.stats.vit">VIT: +{{ item.stats.vit }}</div>
              <div v-if="item.stats.agi">AGI: +{{ item.stats.agi }}</div>
              <div v-if="item.stats.int">INT: +{{ item.stats.int }}</div>
            </div>
            <div class="mt-auto pt-2 flex items-center gap-2">
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
          <div class="flex items-start justify-center w-16" v-if="item.image">
            <img :src="item.image" :alt="item.name" class="h-16 object-contain" />
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

const typeLabelMap = {
  warrior: 'Guerreiro',
  mage: 'Mago',
  archer: 'Arqueiro',
  barbaro: 'Barbaro'
}

const standardSpriteMap = {
  warrior: new URL('../imagens/batalha/guerreiro/Standard/Standard-P01.png', import.meta.url).href,
  mage: new URL('../imagens/batalha/mago/Standard/Standard-P01.png', import.meta.url).href,
  archer: new URL('../imagens/batalha/arqueiro/Standard/Standard-P01.png', import.meta.url).href,
  barbaro: new URL('../imagens/batalha/barbaro/Standard/Standard-P01.png', import.meta.url).href
}

const characterTypeLabel = computed(() => {
  const key = characterStore.characterType
  if (!key) return ''
  if (typeLabelMap[key]) return typeLabelMap[key]
  return key.includes('assin') ? 'Barbaro' : key
})

const characterSprite = computed(() => {
  const key = characterStore.characterType
  if (!key) return null
  if (standardSpriteMap[key]) return standardSpriteMap[key]
  return key.includes('assin') ? standardSpriteMap.barbaro : null
})

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

function formatItemName(name) {
  if (!name) return ''
  return name.toString().replace(/\s*\d+$/, '')
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

