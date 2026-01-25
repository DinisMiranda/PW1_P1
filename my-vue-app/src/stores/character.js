import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { post, patch } from '../api/client'

const ROLE_BASE_STATS = {
  warrior: { str: 14, vit: 12, agi: 8, int: 6 },
  mage: { str: 6, vit: 8, agi: 10, int: 14 },
  archer: { str: 10, vit: 9, agi: 13, int: 8 },
  barbaro: { str: 11, vit: 8, agi: 14, int: 7 },
  generic: { str: 10, vit: 10, agi: 10, int: 10 }
}

const ROLE_ALIASES = {
  guerreiro: 'warrior',
  warrior: 'warrior',
  mago: 'mage',
  mage: 'mage',
  arqueiro: 'archer',
  archer: 'archer',
  barbaro: 'barbaro',
  'bárbaro': 'barbaro',
  barbarian: 'barbaro'
}

function normalizeRole(type) {
  if (!type) return 'generic'
  const key = type.toString().trim().toLowerCase()
  if (key.includes('assin')) return 'barbaro'
  return ROLE_ALIASES[key] || 'generic'
}

function baseStatsFor(type) {
  const key = normalizeRole(type)
  return ROLE_BASE_STATS[key] || ROLE_BASE_STATS.generic
}

export const useCharacterStore = defineStore('character', () => {
  // Personagem
  const storedType = localStorage.getItem('characterType')
  const normalizedStoredType = storedType && storedType.toString().toLowerCase().includes('assin') ? 'barbaro' : storedType
  if (normalizedStoredType && normalizedStoredType !== storedType) {
    localStorage.setItem('characterType', normalizedStoredType)
  }
  const characterType = ref(normalizedStoredType || null)
  const stats = ref({
    str: parseInt(localStorage.getItem('stat_str') || ROLE_BASE_STATS.generic.str.toString()),
    vit: parseInt(localStorage.getItem('stat_vit') || ROLE_BASE_STATS.generic.vit.toString()),
    agi: parseInt(localStorage.getItem('stat_agi') || ROLE_BASE_STATS.generic.agi.toString()),
    int: parseInt(localStorage.getItem('stat_int') || ROLE_BASE_STATS.generic.int.toString())
  })
  const availablePoints = ref(parseInt(localStorage.getItem('availablePoints') || '0'))
  const level = ref(parseInt(localStorage.getItem('characterLevel') || '1'))
  const currentUserId = ref(localStorage.getItem('characterUserId') || null)
  const characterRecordId = ref(localStorage.getItem('characterRecordId') || null)

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
    if (currentUserId.value) localStorage.setItem('characterUserId', currentUserId.value)
    else localStorage.removeItem('characterUserId')
    if (characterRecordId.value) localStorage.setItem('characterRecordId', characterRecordId.value)
    else localStorage.removeItem('characterRecordId')
  }

  function setFromServer(record, userId) {
    if (userId) currentUserId.value = userId.toString()
    else if (record?.userId) currentUserId.value = record.userId.toString()

    if (record?.id !== undefined && record?.id !== null) {
      characterRecordId.value = record.id.toString()
    }

    if (record) {
      const normalized = record.characterType ? normalizeRole(record.characterType) : null
      characterType.value = record.characterType ? normalized : null
      stats.value = {
        str: parseInt(record.stats?.str ?? ROLE_BASE_STATS.generic.str, 10),
        vit: parseInt(record.stats?.vit ?? ROLE_BASE_STATS.generic.vit, 10),
        agi: parseInt(record.stats?.agi ?? ROLE_BASE_STATS.generic.agi, 10),
        int: parseInt(record.stats?.int ?? ROLE_BASE_STATS.generic.int, 10)
      }
      availablePoints.value = parseInt(record.availablePoints ?? 0, 10)
      level.value = parseInt(record.level ?? 1, 10)
    } else {
      characterType.value = null
      stats.value = { ...ROLE_BASE_STATS.generic }
      availablePoints.value = 0
      level.value = 1
    }

    saveState()
  }

  async function persistToServer() {
    if (!currentUserId.value) return

    const payload = {
      userId: currentUserId.value,
      characterType: characterType.value,
      stats: {
        str: stats.value.str,
        vit: stats.value.vit,
        agi: stats.value.agi,
        int: stats.value.int
      },
      availablePoints: availablePoints.value,
      level: level.value
    }

    try {
      if (characterRecordId.value) {
        await patch(`/characters/${characterRecordId.value}`, payload)
      } else {
        const created = await post('/characters', payload)
        if (created?.id !== undefined && created?.id !== null) {
          characterRecordId.value = created.id.toString()
        }
      }
      saveState()
    } catch (err) {
      console.warn('Falha ao sincronizar personagem', err)
    }
  }

  async function createCharacter(type) {
    const normalized = normalizeRole(type)
    characterType.value = normalized
    stats.value = { ...baseStatsFor(normalized) }
    availablePoints.value = 0
    level.value = 1
    saveState()
    await persistToServer()
  }

  function reset() {
    characterType.value = null
    stats.value = { ...ROLE_BASE_STATS.generic }
    availablePoints.value = 0
    level.value = 1
    currentUserId.value = null
    characterRecordId.value = null
    saveState()
  }

  function addStatPoint(stat) {
    if (availablePoints.value > 0 && stats.value[stat] !== undefined) {
      stats.value[stat]++
      availablePoints.value--
      saveState()
      persistToServer()
    }
  }

  function levelUp() {
    level.value++
    availablePoints.value += 3
    saveState()
    persistToServer()
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
    currentUserId,
    characterRecordId,
    createCharacter,
    addStatPoint,
    levelUp,
    reset,
    init,
    setFromServer,
    persistToServer
  }
})

