<template>
  <div>
    <h2 class="mb-6 text-2xl font-bold font-solo text-white uppercase tracking-wider">Batalha</h2>

    <!-- Modal de Batalha -->
    <BattleModal
      :is-open="showBattleModal"
      :player-stats="playerStats"
      :enemy-stats="enemyStats"
      :phase-name="battleStore.currentPhaseData.name"
      :character-type="playerCharacterType"
      :boss-key="currentBossKey"
      @close="closeBattleModal"
      @battle-finished="handleBattleFinished"
    />

    <!-- Fase Atual -->
    <div class="mb-6 border-2 border-primary/50 bg-card-solo p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold font-solo text-primary">{{ battleStore.currentPhaseData.name }}</h3>
        <div class="text-white/80">
          <span class="font-semibold">Fase:</span> {{ battleStore.currentPhase }} / {{ battleStore.phases.length }}
        </div>
      </div>

      <!-- Info do Inimigo -->
      <div class="mb-4 p-4 border-2 border-primary/30 bg-black/30">
        <p class="mb-2 font-bold text-white">Inimigo:</p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-white/80">HP:</span>
            <span class="text-white font-bold ml-2">{{ battleStore.currentPhaseData.enemyHP }}</span>
          </div>
          <div>
            <span class="text-white/80">Ataque:</span>
            <span class="text-white font-bold ml-2">{{ battleStore.currentPhaseData.enemyAttack }}</span>
          </div>
        </div>
        <p class="mt-2 text-xs text-primary/80">
          Recompensa: Item {{ itemStore.getRarityInfo(battleStore.currentPhaseData.reward).name }}
        </p>
      </div>

      <!-- Stats do Jogador -->
      <div class="mb-4 p-4 border-2 border-primary/30 bg-black/30">
        <p class="mb-2 font-bold text-white">Teus Stats:</p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-white/80">HP:</span>
            <span class="text-white font-bold ml-2">{{ playerStats.hp }}</span>
          </div>
          <div>
            <span class="text-white/80">Ataque:</span>
            <span class="text-white font-bold ml-2">{{ playerStats.attack }}</span>
          </div>
          <div>
            <span class="text-white/80">Defesa:</span>
            <span class="text-white font-bold ml-2">{{ playerStats.defense }}</span>
          </div>
          <div>
            <span class="text-white/80">Velocidade:</span>
            <span class="text-white font-bold ml-2">{{ playerStats.speed }}</span>
          </div>
        </div>
      </div>

      <!-- Botão de Batalha -->
      <button
        @click="startBattle"
        :disabled="showBattleModal"
        class="w-full border-2 border-primary bg-primary/20 px-6 py-4 text-white font-bold font-solo uppercase tracking-wider hover:bg-primary/30 glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ showBattleModal ? 'A Batalhar...' : 'Iniciar Batalha' }}
      </button>

      <!-- Resultado da Batalha -->
      <div v-if="battleStore.battleResult" class="mt-4 p-4 border-2" :class="battleStore.battleResult.won ? 'border-primary bg-primary/10' : 'border-red-500 bg-red-500/10'">
        <div class="flex items-center justify-center gap-3 mb-2">
          <img
            :src="battleStore.battleResult.won ? victoryIcon : defeatIcon"
            :alt="battleStore.battleResult.won ? 'Vitória' : 'Derrota'"
            class="h-12 w-12 object-contain"
          />
          <p class="text-lg font-bold" :class="battleStore.battleResult.won ? 'text-primary' : 'text-red-400'">
            {{ battleStore.battleResult.won ? 'Vitória!' : 'Derrota' }}
          </p>
        </div>
        <div class="text-sm text-white/80 text-center">
          <p v-if="battleStore.battleResult.won">
            Recebeste um item! Vê o teu inventário.
          </p>
          <p v-else>
            Não conseguiste derrotar o inimigo. Completa mais hábitos para ganhar XP e melhorar os teus stats!
          </p>
        </div>
      </div>
    </div>

    <!-- Lista de Fases -->
    <div>
      <h3 class="mb-4 text-lg font-bold font-solo text-primary uppercase tracking-wider">Fases</h3>
      <div class="space-y-2">
        <div
          v-for="phase in battleStore.phases"
          :key="phase.id"
          class="border-2 p-4"
          :class="phase.id <= battleStore.currentPhase ? 'border-primary/50 bg-card-solo' : 'border-primary/20 bg-black/20 opacity-50'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-white">{{ phase.name }}</p>
              <p class="text-xs text-white/60">HP: {{ phase.enemyHP }} | ATK: {{ phase.enemyAttack }}</p>
            </div>
            <div class="text-right">
              <span v-if="phase.id < battleStore.currentPhase" class="text-primary font-bold">✓ Completo</span>
              <span v-else-if="phase.id === battleStore.currentPhase" class="text-primary font-bold">Atual</span>
              <span v-else class="text-white/40">Bloqueado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useBattleStore } from '../stores/battle'
import { useCharacterStore } from '../stores/character'
import { useItemStore } from '../stores/items'
import { useUserStore } from '../stores/user'
import BattleModal from '../components/BattleModal.vue'

const victoryIcon = new URL('../imagens/batalha/vitoria.png', import.meta.url).href
const defeatIcon = new URL('../imagens/batalha/derrota.png', import.meta.url).href

const battleStore = useBattleStore()
const characterStore = useCharacterStore()
const itemStore = useItemStore()
const userStore = useUserStore()

const showBattleModal = ref(false)

// Garante que fases e estado inicial da batalha são carregados
onMounted(() => {
  battleStore.init()
})

// Calcula stats finais do jogador juntando personagem + itens para enviar ao modal
const playerStats = computed(() => {
  if (!characterStore.characterType) {
    return { hp: 0, maxHP: 0, attack: 0, defense: 0, speed: 0 }
  }
  return battleStore.calculatePlayerStats(characterStore, itemStore)
})

const playerCharacterType = computed(() => characterStore.characterType || 'generic')

// Determina qual boss sprite/anim usar com base na fase atual
const currentBossKey = computed(() => {
  const phaseId = battleStore.currentPhase
  if (!phaseId) {
    return 'Boss1'
  }
  const maxBossIndex = 6
  const bossIndex = Math.min(phaseId, maxBossIndex)
  return `Boss${bossIndex}`
})

// Dados simplificados do inimigo atual para o modal
const enemyStats = computed(() => {
  return {
    hp: battleStore.currentPhaseData.enemyHP,
    attack: battleStore.currentPhaseData.enemyAttack
  }
})

// Impede início de batalha quando não existe personagem criado
function startBattle() {
  if (!characterStore.characterType) {
    alert('Precisas criar um personagem primeiro!')
    return
  }
  showBattleModal.value = true
}

function closeBattleModal() {
  showBattleModal.value = false
}

// Recebe o resultado emitido pelo modal e atualiza o store
function handleBattleFinished(result) {
  // Processar resultado da batalha
  battleStore.processBattleResult(result, characterStore, itemStore)
  // Fechar modal após um pequeno delay para mostrar resultado
  setTimeout(() => {
    showBattleModal.value = false
  }, 1000)
}
</script>

<style scoped></style>

