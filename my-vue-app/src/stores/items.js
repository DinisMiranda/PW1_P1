import { defineStore } from 'pinia'
import { ref } from 'vue'

const RARITIES = {
  common: { name: 'Comum', color: '#94A3B8', glow: 'rgba(148, 163, 184, 0.3)' },
  uncommon: { name: 'Incomum', color: '#00D9FF', glow: 'rgba(0, 217, 255, 0.3)' },
  rare: { name: 'Raro', color: '#7B2CBF', glow: 'rgba(123, 44, 191, 0.3)' },
  epic: { name: 'Épico', color: '#FF6B00', glow: 'rgba(255, 107, 0, 0.3)' },
  legendary: { name: 'Lendário', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.3)' }
}

const ROLE_KEYS = {
  guerreiro: 'warrior',
  warrior: 'warrior',
  mago: 'mage',
  mage: 'mage',
  arqueiro: 'archer',
  archer: 'archer',
  assassino: 'assassin',
  assassin: 'assassin'
}

const RARITY_TIERS = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5
}

const ROLE_ASSET_DIRS = {
  warrior: 'guerreiro',
  mage: 'mago',
  archer: 'arqueiro',
  assassin: 'assassino'
}

const SLOT_ASSETS = {
  warrior: {
    mainhand: { folder: 'espada', prefix: 'espada' },
    offhand: { folder: 'escudo', prefix: 'escudo' },
    helmet: { folder: 'capacete', prefix: 'capacete' },
    chestplate: { folder: 'peito', prefix: 'peito' },
    boots: { folder: 'bota', prefix: 'bota' },
    belt: { folder: 'acessorio', prefix: 'anel' },
    amulet: { folder: 'amuletos', prefix: 'amuleto' }
  },
  mage: {
    mainhand: { folder: 'cajado', prefix: 'cajado' },
    offhand: { folder: 'orbe', prefix: 'orbe' },
    helmet: { folder: 'capacete', prefix: 'capacete' },
    chestplate: { folder: 'peito', prefix: 'peito' },
    boots: { folder: 'bota', prefix: 'bota' },
    belt: { folder: 'acessorio', prefix: 'anel' },
    amulet: { folder: 'amuletos', prefix: 'amuleto' }
  },
  archer: {
    mainhand: { folder: 'arco', prefix: 'arco' },
    offhand: { folder: 'besta', prefix: 'besta' },
    helmet: { folder: 'capacete', prefix: 'capacete' },
    chestplate: { folder: 'peito', prefix: 'peito' },
    boots: { folder: 'bota', prefix: 'bota' },
    belt: { folder: 'acessorio', prefix: 'anel' },
    amulet: { folder: 'amuletos', prefix: 'amuleto' }
  },
  assassin: {
    mainhand: { folder: 'adaga', prefix: 'adaga' },
    offhand: { folder: 'faca', prefix: 'faca' },
    helmet: { folder: 'capacete', prefix: 'capacete' },
    chestplate: { folder: 'peito', prefix: 'peito' },
    boots: { folder: 'bota', prefix: 'bota' },
    belt: { folder: 'acessorio', prefix: 'anel' },
    amulet: { folder: 'amuletos', prefix: 'amuleto' }
  }
}

const ROLE_SLOT_NAMES = {
  mage: {
    mainhand: 'Cajado',
    offhand: 'Orbe',
    helmet: 'Capuz Arcano',
    chestplate: 'Manto Arcano',
    boots: 'Botas Etéreas',
    belt: 'Anel Rúnico',
    amulet: 'Amuleto Arcano'
  },
  assassin: {
    mainhand: 'Adaga',
    offhand: 'Lâmina',
    helmet: 'Capuz Sombrio',
    chestplate: 'Couraça Leve',
    boots: 'Botas Silenciosas',
    belt: 'Anel Oculto',
    amulet: 'Amuleto Sombrio'
  },
  archer: {
    mainhand: 'Arco',
    offhand: 'Besta',
    helmet: 'Capuz do Caçador',
    chestplate: 'Peitoral de Couro',
    boots: 'Botas do Ranger',
    belt: 'Anel do Ranger',
    amulet: 'Amuleto do Caçador'
  },
  warrior: {
    mainhand: 'Espada',
    offhand: 'Escudo',
    helmet: 'Capacete de Guerra',
    chestplate: 'Peitoral Reforçado',
    boots: 'Botas Blindadas',
    belt: 'Anel de Batalha',
    amulet: 'Amuleto do Guerreiro'
  }
}

function normalizeRole(role) {
  if (!role) return 'generic'
  const key = role.toString().trim().toLowerCase()
  return ROLE_KEYS[key] || 'generic'
}

function extractTierFromName(name) {
  if (!name) return null
  const match = name.toString().match(/([1-5])/)
  if (!match) return null
  const tier = parseInt(match[1], 10)
  return Math.min(5, Math.max(1, tier))
}

function resolveTierFromNameOrRarity(name, rarity) {
  const tierFromName = extractTierFromName(name)
  if (tierFromName) return tierFromName
  return Math.min(5, Math.max(1, RARITY_TIERS[rarity] || 1))
}

function getItemImage(role, slot, name = '', rarity = 'common') {
  const roleKey = normalizeRole(role)
  const resolvedRole = SLOT_ASSETS[roleKey] ? roleKey : 'warrior'
  const slotConfig = SLOT_ASSETS[resolvedRole]?.[slot] || SLOT_ASSETS.warrior?.[slot]
  if (!slotConfig) return null

  const tier = resolveTierFromNameOrRarity(name, rarity)
  const roleDir = ROLE_ASSET_DIRS[resolvedRole] || ROLE_ASSET_DIRS.warrior
  return new URL(`../imagens/personagens/${roleDir}/${slotConfig.folder}/${slotConfig.prefix}${tier}.png`, import.meta.url).href
}

export const useItemStore = defineStore('items', () => {
  const inventory = ref(JSON.parse(localStorage.getItem('inventory') || '[]'))
  const equippedItems = ref(JSON.parse(localStorage.getItem('equippedItems') || '[]'))
  const lootBoxes = ref(JSON.parse(localStorage.getItem('lootBoxes') || '{"phase1":2}'))

  function saveState() {
    localStorage.setItem('inventory', JSON.stringify(inventory.value))
    localStorage.setItem('equippedItems', JSON.stringify(equippedItems.value))
    localStorage.setItem('lootBoxes', JSON.stringify(lootBoxes.value))
  }

  function cleanupLegacySlots() {
    const beforeInv = inventory.value.length
    const beforeEq = equippedItems.value.length
    inventory.value = inventory.value.filter(i => i.slot !== 'leggings')
    equippedItems.value = equippedItems.value.filter(i => i.slot !== 'leggings')
    if (beforeInv !== inventory.value.length || beforeEq !== equippedItems.value.length) {
      saveState()
    }
  }

  function resolveSlotName(slot, role = 'generic') {
    const genericMap = {
      mainhand: 'Mão Principal',
      offhand: 'Mão Secundária',
      helmet: 'Capacete',
      chestplate: 'Peitoral',
      boots: 'Botas',
      belt: 'Acessório',
      amulet: 'Amuleto'
    }

    const roleKey = normalizeRole(role)
    const map = ROLE_SLOT_NAMES[roleKey] || genericMap
    return map[slot] || genericMap[slot] || slot
  }

  function generateItem(rarity = null, role = 'generic') {
    // Se não especificar raridade, escolhe aleatoriamente (mais comum = mais provável)
    if (!rarity) {
      const rand = Math.random()
      if (rand < 0.5) rarity = 'common'
      else if (rand < 0.75) rarity = 'uncommon'
      else if (rand < 0.9) rarity = 'rare'
      else if (rand < 0.98) rarity = 'epic'
      else rarity = 'legendary'
    }

    const statPoints = {
      common: 2,
      uncommon: 4,
      rare: 6,
      epic: 10,
      legendary: 15
    }

    const points = statPoints[rarity]
    const stats = { str: 0, vit: 0, agi: 0, int: 0 }
    
    // Distribuir pontos aleatoriamente
    for (let i = 0; i < points; i++) {
      const stat = ['str', 'vit', 'agi', 'int'][Math.floor(Math.random() * 4)]
      stats[stat]++
    }

    const slots = ['mainhand', 'offhand', 'helmet', 'chestplate', 'boots', 'belt', 'amulet']
    const slot = slots[Math.floor(Math.random() * slots.length)]

    const roleKey = normalizeRole(role)
    const slotName = resolveSlotName(slot, roleKey)
    const tier = RARITY_TIERS[rarity] || 1

    const item = enrichItem({
      id: Date.now() + Math.random(),
      name: `${slotName} ${tier}`,
      rarity,
      stats,
      slot,
      role: roleKey
    })

    inventory.value.push(item)
    saveState()
    return item
  }

  function removeItem(itemId) {
    const beforeInv = inventory.value.length
    const beforeEq = equippedItems.value.length
    inventory.value = inventory.value.filter(i => i.id !== itemId)
    equippedItems.value = equippedItems.value.filter(i => i.id !== itemId)
    const changed = (beforeInv !== inventory.value.length) || (beforeEq !== equippedItems.value.length)
    if (changed) saveState()
    return changed
  }

  const NEXT_RARITY = { common: 'uncommon', uncommon: 'rare', rare: 'epic', epic: 'legendary' }

  function upgradeItems(baseId, materialId) {
    if (baseId === materialId) return null
    const baseIdx = inventory.value.findIndex(i => i.id === baseId)
    const matIdx = inventory.value.findIndex(i => i.id === materialId)
    if (baseIdx === -1 || matIdx === -1) return null

    const base = inventory.value[baseIdx]
    const material = inventory.value[matIdx]

    if (base.slot !== material.slot) return null
    if (base.rarity !== material.rarity) return null

    const nextRarity = NEXT_RARITY[base.rarity]
    if (!nextRarity) return null

    const roleKey = normalizeRole(base.role || 'generic')
    const mergedStats = {
      str: (base.stats.str || 0) + (material.stats.str || 0) + 1,
      vit: (base.stats.vit || 0) + (material.stats.vit || 0) + 1,
      agi: (base.stats.agi || 0) + (material.stats.agi || 0) + 1,
      int: (base.stats.int || 0) + (material.stats.int || 0) + 1
    }

    const slotLabel = resolveSlotName(base.slot, roleKey)
    const tier = RARITY_TIERS[nextRarity] || resolveTierFromNameOrRarity(base.name, nextRarity)
    const shouldRefreshName = (base.name || '').toLowerCase().startsWith(slotLabel.toLowerCase())
    const upgradedName = shouldRefreshName ? `${slotLabel} ${tier}` : base.name

    const upgraded = enrichItem({
      id: Date.now() + Math.random(),
      name: upgradedName,
      rarity: nextRarity,
      stats: mergedStats,
      slot: base.slot,
      role: roleKey
    })

    // Remove material and replace base
    const kept = inventory.value.filter((_, idx) => idx !== matIdx && idx !== baseIdx)
    kept.push(upgraded)
    inventory.value = kept
    saveState()
    return upgraded
  }

  function addBox(type = 'phase1', count = 1, max = null) {
    const current = lootBoxes.value[type] || 0
    const next = max !== null ? Math.min(max, current + count) : current + count
    lootBoxes.value = { ...lootBoxes.value, [type]: next }
    saveState()
    return { added: next - current, total: next }
  }

  function openBox(type = 'phase1', rarity = 'common', role = 'generic') {
    const current = lootBoxes.value[type] || 0
    if (current <= 0) return null
    lootBoxes.value = { ...lootBoxes.value, [type]: current - 1 }
    const item = generateItem(rarity, role)
    saveState()
    return item
  }

  function enrichItem(item) {
    const roleKey = normalizeRole(item.role || 'generic')
    return {
      ...item,
      role: roleKey,
      image: item.image || getItemImage(roleKey, item.slot, item.name, item.rarity)
    }
  }

  function equipItem(itemId) {
    const item = inventory.value.find(i => i.id === itemId)
    if (!item) return false

    // Remove item do inventário
    inventory.value = inventory.value.filter(i => i.id !== itemId)
    
    // Remove item equipado do mesmo slot se existir
    const existing = equippedItems.value.find(i => i.slot === item.slot)
    if (existing) {
      inventory.value.push(existing)
    }

    equippedItems.value = equippedItems.value.filter(i => i.slot !== item.slot)
    equippedItems.value.push(item)
    saveState()
    return true
  }

  function unequipItem(itemId) {
    const item = equippedItems.value.find(i => i.id === itemId)
    if (!item) return false

    equippedItems.value = equippedItems.value.filter(i => i.id !== itemId)
    inventory.value.push(item)
    saveState()
    return true
  }

  function getRarityInfo(rarity) {
    return RARITIES[rarity] || RARITIES.common
  }

  function getSlotName(slot) {
    const slotNames = {
      mainhand: 'Mão Principal',
      offhand: 'Mão Secundária',
      helmet: 'Capacete',
      chestplate: 'Peitoral',
      boots: 'Botas',
      belt: 'Acessório',
      amulet: 'Amuleto'
    }
    return slotNames[slot] || slot
  }

  function init() {
    cleanupLegacySlots()
    inventory.value = inventory.value.map(enrichItem)
    equippedItems.value = equippedItems.value.map(enrichItem)
    saveState()
  }

  cleanupLegacySlots()

  return {
    inventory,
    equippedItems,
    lootBoxes,
    generateItem,
    removeItem,
    upgradeItems,
    addBox,
    openBox,
    equipItem,
    unequipItem,
    getRarityInfo,
    getSlotName,
    init
  }
})

