<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-4xl mx-4 border-2 border-primary bg-card-solo p-6 glow-cyan">
        <!-- Header -->
        <div class="mb-6 text-center">
          <h2 class="text-3xl font-bold font-solo text-primary text-glow uppercase tracking-wider">
            {{ phaseName }}
          </h2>
        </div>

        <!-- Arena de Batalha -->
        <div class="relative flex items-center justify-between mb-6 min-h-[300px]">
          <!-- Personagem do Jogador -->
          <div class="flex-1 text-center">
            <div class="relative inline-block">
              <!-- Imagem do Personagem (placeholder) -->
              <div 
                class="w-32 h-32 border-4 border-primary bg-black/50 flex items-center justify-center mb-4 transition-all"
                :class="playerAttacking ? 'scale-110 glow-cyan' : ''"
              >
                <span class="text-6xl">⚔️</span>
                <!-- TODO: Substituir por imagem do personagem -->
              </div>
              
              <!-- Barra de HP do Jogador -->
              <div class="mb-2">
                <div class="text-sm font-bold text-white mb-1">
                  Jogador
                </div>
                <div class="w-48 h-6 border-2 border-primary/50 bg-black/50 mx-auto">
                  <div 
                    class="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 flex items-center justify-center"
                    :style="{ width: `${(playerHP / playerMaxHP) * 100}%` }"
                  >
                    <span class="text-xs font-bold text-white">{{ playerHP }} / {{ playerMaxHP }}</span>
                  </div>
                </div>
              </div>

              <!-- Dano recebido -->
              <Transition name="damage">
                <div v-if="playerDamage > 0" class="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-400 text-2xl font-bold animate-bounce">
                  -{{ playerDamage }}
                </div>
              </Transition>
            </div>
          </div>

          <!-- VS -->
          <div class="text-4xl font-bold text-primary mx-8">VS</div>

          <!-- Inimigo -->
          <div class="flex-1 text-center">
            <div class="relative inline-block">
              <!-- Imagem do Inimigo -->
              <div 
                class="w-32 h-32 border-4 border-red-500 bg-black/50 flex items-center justify-center mb-4 transition-all"
                :class="enemyAttacking ? 'scale-110 glow-red' : ''"
              >
                <span class="text-6xl">👹</span>
              </div>
              
              <!-- Barra de HP do Inimigo -->
              <div class="mb-2">
                <div class="text-sm font-bold text-white mb-1">
                  Inimigo
                </div>
                <div class="w-48 h-6 border-2 border-red-500/50 bg-black/50 mx-auto">
                  <div 
                    class="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 flex items-center justify-center"
                    :style="{ width: `${(enemyHP / enemyMaxHP) * 100}%` }"
                  >
                    <span class="text-xs font-bold text-white">{{ enemyHP }} / {{ enemyMaxHP }}</span>
                  </div>
                </div>
              </div>

              <!-- Dano recebido -->
              <Transition name="damage">
                <div v-if="enemyDamage > 0" class="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-400 text-2xl font-bold animate-bounce">
                  -{{ enemyDamage }}
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Log de Batalha -->
        <div class="mb-6 max-h-32 overflow-y-auto border-2 border-primary/30 bg-black/30 p-4">
          <div 
            v-for="(log, index) in battleLog" 
            :key="index"
            class="text-sm text-white/80 mb-1"
            :class="log.type === 'player' ? 'text-primary' : 'text-red-400'"
          >
            {{ log.message }}
          </div>
        </div>

        <!-- Resultado -->
        <div v-if="battleFinished" class="text-center">
          <div 
            class="mb-4 p-4 border-2"
            :class="won ? 'border-primary bg-primary/10' : 'border-red-500 bg-red-500/10'"
          >
            <p class="text-2xl font-bold mb-2" :class="won ? 'text-primary' : 'text-red-400'">
              {{ won ? '🎉 Vitória!' : '💀 Derrota' }}
            </p>
            <p v-if="won && boxesGained > 0" class="text-white/80">
              Ganhaste {{ boxesGained }} caixa(s)!
            </p>
          </div>
          <button
            @click="closeModal"
            class="border-2 border-primary bg-primary/20 px-6 py-3 text-white font-bold font-solo uppercase tracking-wider hover:bg-primary/30 glow-cyan transition-all"
          >
            Fechar
          </button>
        </div>

        <!-- Loading durante batalha -->
        <div v-else class="text-center">
          <div class="text-primary text-lg font-bold animate-pulse">
            Batalhando...
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  playerStats: {
    type: Object,
    required: true
  },
  enemyStats: {
    type: Object,
    required: true
  },
  phaseName: {
    type: String,
    default: 'Batalha'
  }
})

const emit = defineEmits(['close', 'battle-finished'])

const playerHP = ref(props.playerStats.maxHP)
const playerMaxHP = ref(props.playerStats.maxHP)
const enemyHP = ref(props.enemyStats.hp)
const enemyMaxHP = ref(props.enemyStats.hp)

const playerAttacking = ref(false)
const enemyAttacking = ref(false)
const playerDamage = ref(0)
const enemyDamage = ref(0)
const battleLog = ref([])
const battleFinished = ref(false)
const won = ref(false)
const boxesGained = ref(0)

let battleInterval = null

function addLog(message, type = 'info') {
  battleLog.value.push({ message, type, timestamp: Date.now() })
  // Manter apenas últimos 20 logs
  if (battleLog.value.length > 20) {
    battleLog.value.shift()
  }
}

function calculateDamage(attacker, defender) {
  const baseDamage = attacker.attack
  const defenseReduction = defender.defense * 0.1
  return Math.max(1, Math.floor(baseDamage - defenseReduction))
}

function getTurnOrder(playerSpeed, enemySpeed) {
  // Quem tem mais velocidade ataca primeiro
  // Se velocidade for igual, jogador ataca primeiro
  if (playerSpeed >= enemySpeed) {
    return ['player', 'enemy']
  }
  return ['enemy', 'player']
}

function calculateTurnDelay(speed) {
  // Velocidade maior = delay menor (ataca mais rápido)
  // Delay mínimo de 800ms, máximo de 2000ms
  // Velocidade de 10 = 2000ms, velocidade de 50 = 1000ms, velocidade de 100+ = 800ms
  const baseDelay = 2000
  const speedFactor = Math.min(speed, 100) / 100 // Normalizar velocidade até 100
  return Math.max(800, Math.min(2000, baseDelay - (speedFactor * 1200)))
}

async function startBattle() {
  // Reset
  playerHP.value = props.playerStats.maxHP
  playerMaxHP.value = props.playerStats.maxHP
  enemyHP.value = props.enemyStats.hp
  enemyMaxHP.value = props.enemyStats.hp
  playerAttacking.value = false
  enemyAttacking.value = false
  playerDamage.value = 0
  enemyDamage.value = 0
  battleLog.value = []
  battleFinished.value = false
  won.value = false
  boxesGained.value = 0

  addLog('Batalha iniciada!', 'info')

  const playerSpeed = props.playerStats.speed || 10
  const enemySpeed = 10 // Velocidade base do inimigo

  const playerDelay = calculateTurnDelay(playerSpeed)
  const enemyDelay = calculateTurnDelay(enemySpeed)

  // Batalha automática
  while (playerHP.value > 0 && enemyHP.value > 0) {
    const turnOrder = getTurnOrder(playerSpeed, enemySpeed)
    
    for (const attacker of turnOrder) {
      if (playerHP.value <= 0 || enemyHP.value <= 0) break

      if (attacker === 'player') {
        // Jogador ataca
        await new Promise(resolve => setTimeout(resolve, playerDelay))
        
        playerAttacking.value = true
        const damage = calculateDamage(props.playerStats, { defense: 0 })
        enemyDamage.value = damage
        enemyHP.value = Math.max(0, enemyHP.value - damage)
        addLog(`Jogador ataca e causa ${damage} de dano!`, 'player')
        
        await new Promise(resolve => setTimeout(resolve, 300))
        playerAttacking.value = false
        enemyDamage.value = 0
      } else {
        // Inimigo ataca
        await new Promise(resolve => setTimeout(resolve, enemyDelay))
        
        enemyAttacking.value = true
        const damage = calculateDamage(props.enemyStats, { defense: props.playerStats.defense })
        playerDamage.value = damage
        playerHP.value = Math.max(0, playerHP.value - damage)
        addLog(`Inimigo ataca e causa ${damage} de dano!`, 'enemy')
        
        await new Promise(resolve => setTimeout(resolve, 300))
        enemyAttacking.value = false
        playerDamage.value = 0
      }
    }
  }

  // Resultado
  won.value = playerHP.value > 0
  battleFinished.value = true

  if (won.value) {
    addLog('🎉 Vitória!', 'player')
    boxesGained.value = Math.floor(Math.random() * 6) + 1
  } else {
    addLog('💀 Derrota...', 'enemy')
  }

  // Aguardar um pouco antes de emitir o evento para mostrar o resultado
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Emitir evento de batalha terminada
  emit('battle-finished', {
    won: won.value,
    playerHP: playerHP.value,
    enemyHP: enemyHP.value,
    boxesGained: boxesGained.value
  })
}

function closeModal() {
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    startBattle()
  } else {
    // Limpar estado quando fechar
    if (battleInterval) {
      clearInterval(battleInterval)
      battleInterval = null
    }
  }
})

onMounted(() => {
  if (props.isOpen) {
    startBattle()
  }
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.damage-enter-active, .damage-leave-active {
  transition: all 0.5s ease;
}

.damage-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.damage-leave-to {
  opacity: 0;
  transform: translate(-50%, -40px);
}

.glow-red {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
}

@keyframes bounce {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -10px);
  }
}
</style>

