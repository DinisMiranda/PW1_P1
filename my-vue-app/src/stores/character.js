import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCharacterStore = defineStore('character', () => {
  // Personagem
  const characterType = ref(localStorage.getItem('characterType') || null)
  const stats = ref({
    str: parseInt(localStorage.getItem('stat_str') || '10'),
    vit: parseInt(localStorage.getItem('stat_vit') || '10'),
    agi: parseInt(localStorage.getItem('stat_agi') || '10'),
    int: parseInt(localStorage.getItem('stat_int') || '10')
  })
  const availablePoints = ref(parseInt(localStorage.getItem('availablePoints') || '0'))
  const level = ref(parseInt(localStorage.getItem('characterLevel') || '1'))

  // Stats totais (base + itens) - será calculado externamente para evitar dependência circular
  const totalStats = computed(() => {
    return {
      str: stats.value.str,
      vit: stats.value.vit,
      agi: stats.value.agi,
      int: stats.value.int
    }
  })

  function saveState() {
    localStorage.setItem('characterType', characterType.value || '')
    localStorage.setItem('stat_str', stats.value.str.toString())
    localStorage.setItem('stat_vit', stats.value.vit.toString())
    localStorage.setItem('stat_agi', stats.value.agi.toString())
    localStorage.setItem('stat_int', stats.value.int.toString())
    localStorage.setItem('availablePoints', availablePoints.value.toString())
    localStorage.setItem('characterLevel', level.value.toString())
  }

  function createCharacter(type) {
    characterType.value = type
    stats.value = { str: 10, vit: 10, agi: 10, int: 10 }
    availablePoints.value = 0
    level.value = 1
    saveState()
  }

  function addStatPoint(stat) {
    if (availablePoints.value > 0 && stats.value[stat] !== undefined) {
      stats.value[stat]++
      availablePoints.value--
      saveState()
    }
  }

  function levelUp() {
    level.value++
    availablePoints.value += 3
    saveState()
  }

  function init() {
    saveState()
  }

  return {
    characterType,
    stats,
    availablePoints,
    level,
    totalStats,
    createCharacter,
    addStatPoint,
    levelUp,
    init
  }
})

