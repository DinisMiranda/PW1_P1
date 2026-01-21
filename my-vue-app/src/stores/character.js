import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { get, post, patch } from '../api/client'

const ROLE_BASE_STATS = {
  warrior: { str: 14, vit: 12, agi: 8, int: 6 },
  mage: { str: 6, vit: 8, agi: 10, int: 14 },
  archer: { str: 10, vit: 9, agi: 13, int: 8 },
  assassin: { str: 11, vit: 8, agi: 14, int: 7 },
  generic: { str: 10, vit: 10, agi: 10, int: 10 }
}

const ROLE_ALIASES = {
  guerreiro: 'warrior',
  warrior: 'warrior',
  mago: 'mage',
  mage: 'mage',
  arqueiro: 'archer',
  archer: 'archer',
  assassino: 'assassin',
  assassin: 'assassin'
}

function normalizeRole(type) {
  if (!type) return 'generic'
  const key = type.toString().trim().toLowerCase()
  return ROLE_ALIASES[key] || 'generic'
}

function baseStatsFor(type) {
  const key = normalizeRole(type)
  return ROLE_BASE_STATS[key] || ROLE_BASE_STATS.generic
}

export const useCharacterStore = defineStore('character', () => {
  // Personagem
  const characterType = ref(localStorage.getItem('characterType') || null)
  const recordId = ref(null)
  const stats = ref({
    str: parseInt(localStorage.getItem('stat_str') || ROLE_BASE_STATS.generic.str.toString()),
    vit: parseInt(localStorage.getItem('stat_vit') || ROLE_BASE_STATS.generic.vit.toString()),
    agi: parseInt(localStorage.getItem('stat_agi') || ROLE_BASE_STATS.generic.agi.toString()),
    int: parseInt(localStorage.getItem('stat_int') || ROLE_BASE_STATS.generic.int.toString())
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

  async function persistCharacter(userId) {
    if (!userId) return

    // tentar descobrir id existente
    if (!recordId.value) {
      try {
        const existing = await get('/characters', { userId })
        const found = existing?.[0]
        if (found?.id) recordId.value = found.id
      } catch (err) {
        console.warn('Não foi possível obter personagem existente', err)
      }
    }

    const payload = {
      userId,
      characterType: characterType.value,
      stats: stats.value,
      availablePoints: availablePoints.value,
      level: level.value
    }

    try {
      if (recordId.value) {
        await patch(`/characters/${recordId.value}`, payload)
      } else {
        const created = await post('/characters', payload)
        if (created?.id) recordId.value = created.id
      }
    } catch (err) {
      console.warn('Não foi possível guardar o personagem no servidor', err)
    }
  }

  async function createCharacter(type, userId = null) {
    const normalized = normalizeRole(type)
    characterType.value = normalized
    stats.value = { ...baseStatsFor(normalized) }
    availablePoints.value = 0
    level.value = 1
    saveState()

    if (userId) {
      await persistCharacter(userId)
    }
  }

  function setFromServer(record) {
    if (!record) return
    recordId.value = record.id || null
    characterType.value = normalizeRole(record.characterType) || null
    stats.value = {
      str: record.stats?.str ?? baseStatsFor(record.characterType).str,
      vit: record.stats?.vit ?? baseStatsFor(record.characterType).vit,
      agi: record.stats?.agi ?? baseStatsFor(record.characterType).agi,
      int: record.stats?.int ?? baseStatsFor(record.characterType).int
    }
    availablePoints.value = record.availablePoints ?? 0
    level.value = record.level ?? 1
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
    recordId,
    stats,
    availablePoints,
    level,
    totalStats,
    createCharacter,
    addStatPoint,
    levelUp,
    persistCharacter,
    setFromServer,
    init
  }
})

