import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Store que gere progressão das fases de batalha e resultados dos combates
export const useBattleStore = defineStore('battle', () => {
  const currentPhase = ref(parseInt(localStorage.getItem('currentPhase') || '1'))
  const phases = ref(JSON.parse(localStorage.getItem('phases') || '[]'))
  const isInBattle = ref(false)
  const battleResult = ref(null)

  // Configuração default caso não existam fases persistidas
  const fallbackPhase = {
    id: 1,
    name: 'Fase 1: Iniciante',
    enemyHP: 100,
    enemyAttack: 10,
    reward: 'common'
  }

  // Inicializa um conjunto básico de fases no primeiro arranque
  function initPhases() {
    if (phases.value.length === 0) {
      phases.value = [
        { id: 1, name: 'Fase 1: Iniciante', enemyHP: 100, enemyAttack: 10, reward: 'common' },
        { id: 2, name: 'Fase 2: Aprendiz', enemyHP: 200, enemyAttack: 20, reward: 'uncommon' },
        { id: 3, name: 'Fase 3: Competente', enemyHP: 350, enemyAttack: 35, reward: 'rare' },
        { id: 4, name: 'Fase 4: Experiente', enemyHP: 500, enemyAttack: 50, reward: 'rare' },
        { id: 5, name: 'Fase 5: Mestre', enemyHP: 700, enemyAttack: 70, reward: 'epic' },
        { id: 6, name: 'Fase 6: Lendário', enemyHP: 1000, enemyAttack: 100, reward: 'epic' },
        { id: 7, name: 'Fase 7: Épico', enemyHP: 1500, enemyAttack: 150, reward: 'legendary' }
      ]
      saveState()
    }
  }

  // Dados da fase atual, com fallback se algo falhar
  const currentPhaseData = computed(() => {
    return phases.value.find(p => p.id === currentPhase.value) || phases.value[0] || fallbackPhase
  })

  // Lista apenas as fases já desbloqueadas pelo jogador
  const unlockedPhases = computed(() => {
    return phases.value.filter(p => p.id <= currentPhase.value)
  })

  // Persiste progresso da batalha no localStorage
  function saveState() {
    localStorage.setItem('currentPhase', currentPhase.value.toString())
    localStorage.setItem('phases', JSON.stringify(phases.value))
  }

  // Constrói um panorama simples dos stats do jogador combinando personagem e equipamento
  function calculatePlayerStats(characterStore, itemStore) {
    // Calcular stats totais (base + itens)
    const base = characterStore.totalStats
    const itemBonus = itemStore.equippedItems.reduce((acc, item) => {
      return {
        str: acc.str + (item.stats.str || 0),
        vit: acc.vit + (item.stats.vit || 0),
        agi: acc.agi + (item.stats.agi || 0),
        int: acc.int + (item.stats.int || 0)
      }
    }, { str: 0, vit: 0, agi: 0, int: 0 })

    const total = {
      str: base.str + itemBonus.str,
      vit: base.vit + itemBonus.vit,
      agi: base.agi + itemBonus.agi,
      int: base.int + itemBonus.int
    }

    // HP baseado em VIT, Attack baseado em STR
    const hp = 100 + (total.vit * 10)
    const attack = 10 + (total.str * 2)
    const defense = total.vit * 1
    const speed = total.agi * 1
    
    return { hp, maxHP: hp, attack, defense, speed }
  }

  // Marca o início de uma batalha e evita múltiplos combates simultâneos
  function startBattle(characterStore, itemStore) {
    if (isInBattle.value) return false
    
    isInBattle.value = true
    battleResult.value = null
    return true
  }

  // Atualiza progresso, loot e caixas com base no resultado final enviado pelo modal
  function processBattleResult(result, characterStore, itemStore) {
    isInBattle.value = false
    battleResult.value = result
    
    if (result.won) {
      // Avançar para próxima fase
      if (currentPhase.value < phases.value.length) {
        currentPhase.value++
      }
      
      // Dar recompensa de item, alinhado ao tipo de personagem
      itemStore.generateItem(currentPhaseData.value.reward, characterStore.characterType || 'generic')

      // Caixas: usar o valor que veio do modal
      if (result.boxesGained > 0) {
        itemStore.addBox('phase1', result.boxesGained)
      }
    }

    saveState()
  }

  function init() {
    initPhases()
    saveState()
  }

  // Garantir que ao criar o store temos fases carregadas
  if (!phases.value.length) {
    initPhases()
  }

  return {
    currentPhase,
    phases,
    currentPhaseData,
    unlockedPhases,
    isInBattle,
    battleResult,
    startBattle,
    processBattleResult,
    calculatePlayerStats,
    init,
    initPhases,
    saveState
  }
})

