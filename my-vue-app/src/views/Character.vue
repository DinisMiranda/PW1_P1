<template>
  <div>
    <!-- Criação de Personagem -->
    <div v-if="!characterStore.characterType" class="mb-8">
      <h2 class="mb-6 text-2xl font-bold font-solo text-white uppercase tracking-wider">Criar Personagem</h2>
      <div class="border-2 border-primary/50 bg-card-solo p-6">
        <p class="mb-4 text-white/80">Escolhe o tipo do teu personagem:</p>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <button
            v-for="type in characterTypes"
            :key="type.value"
            @click="createCharacter(type.value)"
            class="border-2 border-primary/50 bg-primary/10 p-4 hover:border-primary hover:bg-primary/20 transition-all text-white font-semibold"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Personagem Criado -->
    <div v-else>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold font-solo text-white uppercase tracking-wider">Personagem</h2>
        <div class="text-white/80">
          <span class="font-bold text-primary">Tipo:</span> {{ characterTypeLabel }}
        </div>
      </div>

      <!-- Stats -->
      <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="border-2 border-primary/50 bg-card-solo p-4">
          <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Estatísticas Base</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-white/80 font-semibold">STR (Força)</span>
              <div class="flex items-center gap-2">
                <span class="text-white font-bold">{{ characterStore.stats.str }}</span>
                <button
                  v-if="characterStore.availablePoints > 0"
                  @click="characterStore.addStatPoint('str')"
                  class="border-2 border-primary/50 bg-primary/10 px-2 py-1 hover:border-primary hover:bg-primary/20 text-primary font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-white/80 font-semibold">VIT (Vitalidade)</span>
              <div class="flex items-center gap-2">
                <span class="text-white font-bold">{{ characterStore.stats.vit }}</span>
                <button
                  v-if="characterStore.availablePoints > 0"
                  @click="characterStore.addStatPoint('vit')"
                  class="border-2 border-primary/50 bg-primary/10 px-2 py-1 hover:border-primary hover:bg-primary/20 text-primary font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-white/80 font-semibold">AGI (Agilidade)</span>
              <div class="flex items-center gap-2">
                <span class="text-white font-bold">{{ characterStore.stats.agi }}</span>
                <button
                  v-if="characterStore.availablePoints > 0"
                  @click="characterStore.addStatPoint('agi')"
                  class="border-2 border-primary/50 bg-primary/10 px-2 py-1 hover:border-primary hover:bg-primary/20 text-primary font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-white/80 font-semibold">INT (Inteligência)</span>
              <div class="flex items-center gap-2">
                <span class="text-white font-bold">{{ characterStore.stats.int }}</span>
                <button
                  v-if="characterStore.availablePoints > 0"
                  @click="characterStore.addStatPoint('int')"
                  class="border-2 border-primary/50 bg-primary/10 px-2 py-1 hover:border-primary hover:bg-primary/20 text-primary font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div v-if="characterStore.availablePoints > 0" class="mt-4 p-3 border-2 border-primary bg-primary/20">
            <p class="text-primary font-bold text-center">
              Pontos Disponíveis: {{ characterStore.availablePoints }}
            </p>
          </div>
        </div>

        <!-- Stats Totais (com itens) -->
        <div class="border-2 border-primary/50 bg-card-solo p-4">
          <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Estatísticas Totais</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-white/80 font-semibold">STR Total</span>
              <span class="text-white font-bold text-glow">{{ totalStats.str }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/80 font-semibold">VIT Total</span>
              <span class="text-white font-bold text-glow">{{ totalStats.vit }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/80 font-semibold">AGI Total</span>
              <span class="text-white font-bold text-glow">{{ totalStats.agi }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-white/80 font-semibold">INT Total</span>
              <span class="text-white font-bold text-glow">{{ totalStats.int }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterStore } from '../stores/character'
import { useItemStore } from '../stores/items'

const characterStore = useCharacterStore()
const itemStore = useItemStore()

// Lista das classes disponíveis para criação
const characterTypes = [
  { label: 'Guerreiro', value: 'warrior' },
  { label: 'Mago', value: 'mage' },
  { label: 'Arqueiro', value: 'archer' },
  { label: 'Barbaro', value: 'barbaro' }
]

// Ajuda a apresentar rótulos humanizados para tipos já escolhidos
const typeLabelMap = characterTypes.reduce((acc, type) => {
  acc[type.value] = type.label
  return acc
}, {})

const characterTypeLabel = computed(() => {
  const key = characterStore.characterType
  if (!key) return ''
  if (typeLabelMap[key]) return typeLabelMap[key]
  return key.includes('assin') ? 'Barbaro' : key
})

// Encaminha para o store para efetivamente criar/sincronizar personagem
async function createCharacter(type) {
  await characterStore.createCharacter(type)
}

// Combina stats base do personagem com bônus dos itens equipados
const totalStats = computed(() => {
  const base = characterStore.totalStats
  const itemBonus = itemStore.equippedItems.reduce((acc, item) => {
    return {
      str: acc.str + (item.stats.str || 0),
      vit: acc.vit + (item.stats.vit || 0),
      agi: acc.agi + (item.stats.agi || 0),
      int: acc.int + (item.stats.int || 0)
    }
  }, { str: 0, vit: 0, agi: 0, int: 0 })

  return {
    str: base.str + itemBonus.str,
    vit: base.vit + itemBonus.vit,
    agi: base.agi + itemBonus.agi,
    int: base.int + itemBonus.int
  }
})
</script>

<style scoped></style>

