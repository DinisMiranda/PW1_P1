<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-4xl mx-4 border-2 border-primary bg-card-solo px-6 pb-6 pt-12 glow-cyan">
        <!-- Header -->
        <div class="mb-6 text-center">
          <h2 class="text-3xl font-bold font-solo text-primary text-glow uppercase tracking-wider">
            {{ phaseName }}
          </h2>
        </div>

        <!-- Arena de Batalha -->
        <div class="relative mb-6 min-h-[380px] overflow-hidden rounded-lg border-2 border-primary/40">
          <img :src="battleBackground" alt="Cenário de batalha" class="absolute inset-0 h-full w-full object-cover" />
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative z-10 flex h-full items-center justify-between px-6 py-4">
            <!-- Personagem do Jogador -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute left-0 top-0 z-20 flex w-56 flex-col items-start gap-2">
                  <div class="text-sm font-bold text-white">Jogador</div>
                  <div class="w-full h-6 border-2 border-primary/50 bg-black/50">
                    <div
                      class="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 flex items-center justify-center"
                      :style="{ width: `${(playerHP / playerMaxHP) * 100}%` }"
                    >
                      <span class="text-xs font-bold text-white">{{ playerHP }} / {{ playerMaxHP }}</span>
                    </div>
                  </div>
                </div>

                <div
                  class="relative inline-block transition-transform duration-300"
                  :style="{ transform: `translate(${playerOffset}px, 160px)` }"
                >
                <!-- Imagem do Personagem (placeholder) -->
                <div 
                  class="w-72 h-72 flex items-center justify-center mb-4 transition-all overflow-hidden"
                  :class="playerAttacking ? 'scale-110' : ''"
                >
                  <img :src="currentPlayerImage" alt="Personagem do jogador" class="h-full w-full object-contain" />
                </div>
                  
                  <!-- Dano recebido -->
                  <Transition name="damage">
                    <div v-if="playerDamage > 0" class="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-400 text-2xl font-bold animate-bounce">
                      -{{ playerDamage }}
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- VS -->
            <div class="text-4xl font-bold text-primary mx-8">VS</div>

            <!-- Inimigo -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute right-0 top-0 z-20 flex w-56 flex-col items-end gap-2">
                  <div class="text-sm font-bold text-white">Inimigo</div>
                  <div class="w-full h-6 border-2 border-red-500/50 bg-black/50">
                    <div
                      class="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 flex items-center justify-center"
                      :style="{ width: `${(enemyHP / enemyMaxHP) * 100}%` }"
                    >
                      <span class="text-xs font-bold text-white">{{ enemyHP }} / {{ enemyMaxHP }}</span>
                    </div>
                  </div>
                </div>

                <div
                  class="relative inline-block transition-transform duration-300"
                  :style="{ transform: `translate(${enemyOffset}px, 160px)` }"
                >
                <!-- Imagem do Inimigo -->
                <div 
                    class="w-72 h-72 flex items-center justify-center mb-4 transition-all overflow-hidden"
                    :class="enemyAttacking ? 'scale-110' : ''"
                >
                  <img :src="currentEnemyImage" alt="Imagem do inimigo" class="h-full w-full object-contain" />
                </div>

                <!-- Efeito mágico -->
                <div
                  v-if="mageEffectActive && currentMageEffectImage"
                  class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                >
                  <img :src="currentMageEffectImage" alt="Efeito mágico" class="h-96 w-96 object-contain" />
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
            <div class="flex items-center justify-center gap-4 mb-2">
              <img
                :src="won ? victoryIcon : defeatIcon"
                :alt="won ? 'Vitória' : 'Derrota'"
                class="h-16 w-16 object-contain"
              />
              <p class="text-3xl font-bold" :class="won ? 'text-primary' : 'text-red-400'">
                {{ won ? 'Vitória!' : 'Derrota' }}
              </p>
            </div>
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
import { ref, watch, onMounted, computed } from 'vue'

const battleBackground = new URL('../imagens/batalha/cenario.png', import.meta.url).href
const victoryIcon = new URL('../imagens/batalha/vitoria.png', import.meta.url).href
const defeatIcon = new URL('../imagens/batalha/derrota.png', import.meta.url).href

const warriorFrames = import.meta.glob('../imagens/batalha/guerreiro/**/*.png', { eager: true, import: 'default' })
const mageFrames = import.meta.glob('../imagens/batalha/mago/**/*.png', { eager: true, import: 'default' })
const archerFrames = import.meta.glob('../imagens/batalha/arqueiro/**/*.png', { eager: true, import: 'default' })
const barbaroFrames = import.meta.glob('../imagens/batalha/barbaro/**/*.png', { eager: true, import: 'default' })
const bossFrames = import.meta.glob('../imagens/batalha/Boss/**/*.png', { eager: true, import: 'default' })

function sortedValuesFromMap(map, segment) {
  return Object.keys(map)
    .filter((key) => key.includes(segment))
    .sort()
    .map((key) => map[key])
}

function buildHeroAnimations(type) {
  const key = (type || 'generic').toLowerCase()
  const frameMap = key === 'mage'
    ? mageFrames
    : key === 'archer'
      ? archerFrames
      : key === 'barbaro'
        ? barbaroFrames
        : warriorFrames

  return {
    idle: sortedValuesFromMap(frameMap, '/Standard/'),
    walk: sortedValuesFromMap(frameMap, '/walk/'),
    attack: sortedValuesFromMap(frameMap, '/Attack01/'),
    hurt: sortedValuesFromMap(frameMap, '/Hurt/'),
    death: sortedValuesFromMap(frameMap, '/Death/'),
    effect: sortedValuesFromMap(frameMap, '/Effect01/')
  }
}

function buildBossAnimations(bossKey) {
  const key = bossKey || 'Boss1'
  const segmentBase = `/Boss/${key}/`
  return {
    idle: sortedValuesFromMap(bossFrames, `${segmentBase}Standard/`),
    walk: sortedValuesFromMap(bossFrames, `${segmentBase}walk/`),
    attack: sortedValuesFromMap(bossFrames, `${segmentBase}Attack01/`),
    hurt: sortedValuesFromMap(bossFrames, `${segmentBase}Hurt/`),
    death: sortedValuesFromMap(bossFrames, `${segmentBase}Death/`)
  }
}

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
  },
  characterType: {
    type: String,
    default: 'generic'
  },
  bossKey: {
    type: String,
    default: 'Boss1'
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
const playerImageState = ref('idle')
const enemyImageState = ref('idle')

const playerAnimations = computed(() => buildHeroAnimations(props.characterType))
const enemyAnimations = computed(() => buildBossAnimations(props.bossKey))

const playerFrameIndex = ref(0)
const enemyFrameIndex = ref(0)
const mageEffectFrameIndex = ref(0)
const mageEffectActive = ref(false)
const enemyImmobilized = ref(false)
const maxDistanceUnits = 8
const distanceUnits = ref(maxDistanceUnits)
const playerNextActionTime = ref(0)
const enemyNextActionTime = ref(0)
const unitOffset = 48
const playerStepsClosed = ref(0)
const enemyStepsClosed = ref(0)
const playerPosition = ref(0)
const enemyPosition = ref(0)

const currentPlayerFrames = computed(() => playerAnimations.value[playerImageState.value] || playerAnimations.value.idle || [])
const currentEnemyFrames = computed(() => enemyAnimations.value[enemyImageState.value] || enemyAnimations.value.idle || [])
const mageEffectFrames = computed(() => playerAnimations.value.effect || [])

const currentPlayerImage = computed(() => currentPlayerFrames.value[playerFrameIndex.value] || currentPlayerFrames.value[0] || playerAnimations.value.idle?.[0] || '')
const currentEnemyImage = computed(() => currentEnemyFrames.value[enemyFrameIndex.value] || currentEnemyFrames.value[0] || enemyAnimations.value.idle?.[0] || '')
const currentMageEffectImage = computed(() => mageEffectFrames.value[mageEffectFrameIndex.value] || mageEffectFrames.value[0] || '')

const playerOffset = computed(() => playerPosition.value)
const enemyOffset = computed(() => enemyPosition.value)

const normalizedPlayerType = computed(() => (props.characterType || 'generic').toLowerCase())
const playerIsMage = computed(() => normalizedPlayerType.value === 'mage')
const playerIsRanged = computed(() => playerIsMage.value || normalizedPlayerType.value === 'archer')
const playerIsMelee = computed(() => !playerIsRanged.value)

let battleInterval = null
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

watch(() => props.characterType, () => {
  playerImageState.value = 'idle'
  playerFrameIndex.value = 0
  mageEffectFrameIndex.value = 0
})

watch(() => props.bossKey, () => {
  enemyImageState.value = 'idle'
  enemyFrameIndex.value = 0
})

watch(playerImageState, () => {
  playerFrameIndex.value = 0
})

watch(enemyImageState, () => {
  enemyFrameIndex.value = 0
})

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

function animationRefsFor(target) {
  return target === 'player'
    ? { state: playerImageState, frame: playerFrameIndex, animations: playerAnimations }
    : { state: enemyImageState, frame: enemyFrameIndex, animations: enemyAnimations }
}

function recomputeDistance() {
  distanceUnits.value = Math.max(maxDistanceUnits - playerStepsClosed.value - enemyStepsClosed.value, 0)
}

function animateOffset(refValue, targetValue, duration = 260) {
  const frame = typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (cb) => setTimeout(() => cb(Date.now()), 16)
  const nowFn = typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? () => performance.now()
    : () => Date.now()

  return new Promise(resolve => {
    const start = refValue.value
    const delta = targetValue - start

    if (Math.abs(delta) < 0.5 || duration <= 0) {
      refValue.value = targetValue
      resolve()
      return
    }

    const startTime = nowFn()

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      refValue.value = start + delta * progress
      if (progress < 1) {
        frame(step)
      } else {
        resolve()
      }
    }

    frame(step)
  })
}

function framesFor(target, state) {
  const { animations } = animationRefsFor(target)
  const frames = animations.value[state] || []
  if (frames.length === 0 && state !== 'idle') {
    return animations.value.idle || []
  }
  return frames
}

async function playAnimationOnce(target, state, frameDelay = 100) {
  const { state: stateRef, frame: frameRef } = animationRefsFor(target)
  const frames = framesFor(target, state)
  stateRef.value = frames.length ? state : 'idle'

  if (frames.length === 0) {
    frameRef.value = 0
    await delay(frameDelay)
    return
  }

  for (let i = 0; i < frames.length; i++) {
    frameRef.value = i
    await delay(frameDelay)
  }
}

async function playWalkCycle(target, cycles = 1, frameDelay = 80) {
  const { state: stateRef, frame: frameRef } = animationRefsFor(target)
  const frames = framesFor(target, 'walk')
  if (!frames.length) {
    stateRef.value = 'idle'
    await delay(frameDelay * 4 * cycles)
    return
  }

  stateRef.value = 'walk'
  for (let cycle = 0; cycle < cycles; cycle++) {
    for (let i = 0; i < frames.length; i++) {
      frameRef.value = i
      await delay(frameDelay)
    }
  }
  frameRef.value = 0
  stateRef.value = 'idle'
}

async function playMageEffect() {
  if (!mageEffectFrames.value.length) return
  mageEffectActive.value = true
  enemyImmobilized.value = true
  mageEffectFrameIndex.value = 0

  for (let i = 0; i < mageEffectFrames.value.length; i++) {
    mageEffectFrameIndex.value = i
    await delay(120)
  }

  mageEffectActive.value = false
  mageEffectFrameIndex.value = 0
  enemyImmobilized.value = false
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
  playerImageState.value = 'idle'
  enemyImageState.value = 'idle'
  playerFrameIndex.value = 0
  enemyFrameIndex.value = 0
  mageEffectFrameIndex.value = 0
  mageEffectActive.value = false
  enemyImmobilized.value = false
  playerStepsClosed.value = 0
  enemyStepsClosed.value = 0
  playerPosition.value = 0
  enemyPosition.value = 0
  recomputeDistance()
  playerNextActionTime.value = 0
  enemyNextActionTime.value = 0

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
        await delay(playerDelay)
        await handlePlayerTurn()
      } else {
        await delay(enemyDelay)
        await handleEnemyTurn()
      }
    }
  }

  // Resultado
  won.value = playerHP.value > 0
  battleFinished.value = true

  if (playerHP.value <= 0) {
    playerImageState.value = 'death'
  }
  if (enemyHP.value <= 0) {
    enemyImageState.value = 'death'
  }

  if (won.value) {
    addLog('Vitória!', 'player')
    boxesGained.value = Math.floor(Math.random() * 6) + 1
  } else {
    addLog('Derrota...', 'enemy')
  }

  // Aguardar um pouco antes de emitir o evento para mostrar o resultado
  await delay(1500)

  // Emitir evento de batalha terminada
  emit('battle-finished', {
    won: won.value,
    playerHP: playerHP.value,
    enemyHP: enemyHP.value,
    boxesGained: boxesGained.value
  })
}

async function handlePlayerTurn() {
  if (playerHP.value <= 0 || enemyHP.value <= 0) return

  const now = Date.now()
  if (now < playerNextActionTime.value) {
    await delay(playerNextActionTime.value - now)
  }

  if (playerHP.value <= 0 || enemyHP.value <= 0) return

  if (playerIsMelee.value && distanceUnits.value > 0) {
    const { playerMoved } = await moveCloserBoth()
    if (playerMoved || distanceUnits.value > 0) {
      playerNextActionTime.value = Date.now() + 400
      return
    }
  }

  if (enemyHP.value <= 0) return

  await playerAttack()

  const cooldown = playerIsRanged.value ? 1100 : 750
  playerNextActionTime.value = Date.now() + cooldown
}

async function handleEnemyTurn() {
  if (enemyHP.value <= 0 || playerHP.value <= 0) return

  const now = Date.now()
  if (now < enemyNextActionTime.value) {
    await delay(enemyNextActionTime.value - now)
  }

  if (enemyHP.value <= 0 || playerHP.value <= 0) return

  if (enemyImmobilized.value) {
    addLog('Inimigo está imobilizado pelo feitiço.', 'enemy')
    await delay(300)
    enemyNextActionTime.value = Date.now() + 500
    return
  }

  if (distanceUnits.value > 0) {
    const { enemyMoved } = await moveCloserBoth()
    if (enemyMoved || distanceUnits.value > 0) {
      enemyNextActionTime.value = Date.now() + 500
      return
    }
  }

  if (distanceUnits.value > 0) return

  await enemyAttack()
  enemyNextActionTime.value = Date.now() + 900
}

async function moveCloserBoth() {
  if (distanceUnits.value <= 0) return { playerMoved: false, enemyMoved: false }

  let playerMoved = false
  let enemyMoved = false

  const canPlayerMove = playerIsMelee.value && distanceUnits.value > 0
  const canEnemyMove = distanceUnits.value > 0 && !enemyImmobilized.value

  if (!canPlayerMove && !canEnemyMove) {
    return { playerMoved, enemyMoved }
  }

  const nextPlayerSteps = canPlayerMove ? Math.min(playerStepsClosed.value + 1, maxDistanceUnits) : playerStepsClosed.value
  const nextEnemySteps = canEnemyMove ? Math.min(enemyStepsClosed.value + 1, maxDistanceUnits) : enemyStepsClosed.value
  const playerTargetOffset = nextPlayerSteps * unitOffset
  const enemyTargetOffset = nextEnemySteps * -unitOffset

  const animations = []

  if (canPlayerMove) {
    playerStepsClosed.value = Math.min(playerStepsClosed.value + 1, maxDistanceUnits)
    const walkPromise = playWalkCycle('player', 1, 110)
    animations.push(Promise.all([walkPromise, animateOffset(playerPosition, playerTargetOffset, 320)]))
    playerMoved = true
  }

  if (canEnemyMove) {
    enemyStepsClosed.value = Math.min(enemyStepsClosed.value + 1, maxDistanceUnits)
    const walkPromise = playWalkCycle('enemy', 1, 110)
    animations.push(Promise.all([walkPromise, animateOffset(enemyPosition, enemyTargetOffset, 320)]))
    enemyMoved = true
  }

  if (animations.length) {
    await Promise.all(animations)
    recomputeDistance()
  }

  return { playerMoved, enemyMoved }
}

async function playerAttack() {
  playerAttacking.value = true
  await playAnimationOnce('player', 'attack', playerIsRanged.value ? 110 : 90)

  const damage = calculateDamage(props.playerStats, { defense: 0 })
  enemyDamage.value = damage
  enemyHP.value = Math.max(0, enemyHP.value - damage)

  if (enemyHP.value <= 0) {
    addLog(`Jogador termina a batalha com ${damage} de dano!`, 'player')
    await playAnimationOnce('enemy', 'death', 140)
  } else {
    addLog(`Jogador ataca e causa ${damage} de dano!`, 'player')
    await playAnimationOnce('enemy', 'hurt', 120)
  }

  if (enemyHP.value > 0) {
    if (playerIsMage.value && mageEffectFrames.value.length) {
      await playMageEffect()
    }
    if (enemyHP.value > 0) {
      enemyImageState.value = 'idle'
      enemyFrameIndex.value = 0
    }
  }

  enemyDamage.value = 0
  playerAttacking.value = false

  if (playerHP.value > 0) {
    playerImageState.value = 'idle'
    playerFrameIndex.value = 0
  }
}

async function enemyAttack() {
  enemyAttacking.value = true
  await playAnimationOnce('enemy', 'attack', 110)

  const damage = calculateDamage(props.enemyStats, { defense: props.playerStats.defense })
  playerDamage.value = damage
  playerHP.value = Math.max(0, playerHP.value - damage)

  if (playerHP.value <= 0) {
    addLog(`Inimigo derrota o jogador com ${damage} de dano!`, 'enemy')
    await playAnimationOnce('player', 'death', 140)
  } else {
    addLog(`Inimigo ataca e causa ${damage} de dano!`, 'enemy')
    await playAnimationOnce('player', 'hurt', 120)
  }

  enemyAttacking.value = false
  playerDamage.value = 0

  if (playerHP.value > 0) {
    playerImageState.value = 'idle'
    playerFrameIndex.value = 0
  }
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
    playerAttacking.value = false
    enemyAttacking.value = false
    playerImageState.value = 'idle'
    enemyImageState.value = 'idle'
    playerFrameIndex.value = 0
    enemyFrameIndex.value = 0
    mageEffectFrameIndex.value = 0
    mageEffectActive.value = false
    enemyImmobilized.value = false
    playerStepsClosed.value = 0
    enemyStepsClosed.value = 0
    playerPosition.value = 0
    enemyPosition.value = 0
    recomputeDistance()
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

