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

const ITEM_IMAGES = {
  warrior: {
    mainhand: new URL('../imagens/personagens/guerreiro/espada.png', import.meta.url).href,
    offhand: new URL('../imagens/personagens/guerreiro/escudo.png', import.meta.url).href,
    helmet: new URL('../imagens/personagens/guerreiro/capacete.png', import.meta.url).href,
    chestplate: new URL('../imagens/personagens/guerreiro/peitoral.png', import.meta.url).href,
    leggings: new URL('../imagens/personagens/guerreiro/calcas.png', import.meta.url).href,
    boots: new URL('../imagens/personagens/guerreiro/botas.png', import.meta.url).href,
    belt: new URL('../imagens/personagens/guerreiro/cinto.png', import.meta.url).href
  },
  mage: {
    mainhand: new URL('../imagens/personagens/mago/cajado.png', import.meta.url).href,
    offhand: new URL('../imagens/personagens/mago/orbe.png', import.meta.url).href,
    helmet: new URL('../imagens/personagens/mago/capuz arcano.png', import.meta.url).href,
    chestplate: new URL('../imagens/personagens/mago/manto arcano.png', import.meta.url).href,
    leggings: new URL('../imagens/personagens/mago/calcas arcanas.png', import.meta.url).href,
    boots: new URL('../imagens/personagens/mago/botas arcanas.png', import.meta.url).href,
    belt: new URL('../imagens/personagens/mago/cinto arcano.png', import.meta.url).href
  },
  archer: {
    mainhand: new URL('../imagens/personagens/arqueiro/arco.png', import.meta.url).href,
    offhand: new URL('../imagens/personagens/arqueiro/besta.png', import.meta.url).href,
    helmet: new URL('../imagens/personagens/arqueiro/capuz cacador.png', import.meta.url).href,
    chestplate: new URL('../imagens/personagens/arqueiro/peitural cacador.png', import.meta.url).href,
    leggings: new URL('../imagens/personagens/arqueiro/calcas cacador.png', import.meta.url).href,
    boots: new URL('../imagens/personagens/arqueiro/botas cacador.png', import.meta.url).href,
    belt: new URL('../imagens/personagens/arqueiro/cinto cacador.png', import.meta.url).href
  },
  assassin: {
    mainhand: new URL('../imagens/personagens/assassino/adaga.png', import.meta.url).href,
    offhand: new URL('../imagens/personagens/assassino/lamina curta.png', import.meta.url).href,
    helmet: new URL('../imagens/personagens/assassino/capuz sombrio.png', import.meta.url).href,
    chestplate: new URL('../imagens/personagens/assassino/peitural sombrio.png', import.meta.url).href,
    leggings: new URL('../imagens/personagens/assassino/calcas sobrio.png', import.meta.url).href,
    boots: new URL('../imagens/personagens/assassino/botas sobrio.png', import.meta.url).href,
    belt: new URL('../imagens/personagens/assassino/cinto leve.png', import.meta.url).href
  }
}

const ROLE_SLOT_NAMES = {
  mage: {
    mainhand: 'Cajado',
    offhand: 'Orbe',
    helmet: 'Capuz Arcano',
    chestplate: 'Manto Arcano',
    leggings: 'Calças Arcanas',
    boots: 'Botas Etéreas',
    belt: 'Faixa Rúnica'
  },
  assassin: {
    mainhand: 'Adaga',
    offhand: 'Lâmina Curta',
    helmet: 'Capuz Sombrio',
    chestplate: 'Couraça Leve',
    leggings: 'Calças Ágeis',
    boots: 'Botas Silenciosas',
    belt: 'Cinto Oculto'
  },
  archer: {
    mainhand: 'Arco',
    offhand: 'Besta',
    helmet: 'Capuz do Caçador',
    chestplate: 'Peitoral de Couro',
    leggings: 'Calças do Ranger',
    boots: 'Botas do Ranger',
    belt: 'Cinto de Flechas'
  },
  warrior: {
    mainhand: 'Espada',
    offhand: 'Escudo',
    helmet: 'Capacete de Guerra',
    chestplate: 'Peitoral Reforçado',
    leggings: 'Calças de Placas',
    boots: 'Botas Blindadas',
    belt: 'Cinto de Batalha'
  }
}

function normalizeRole(role) {
  if (!role) return 'generic'
  const key = role.toString().trim().toLowerCase()
  return ROLE_KEYS[key] || 'generic'
}

function getItemImage(role, slot) {
  const roleKey = normalizeRole(role)
  return ITEM_IMAGES[roleKey]?.[slot] || null
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

  function resolveSlotName(slot, role = 'generic') {
    const genericMap = {
      mainhand: 'Mão Principal',
      offhand: 'Mão Secundária',
      helmet: 'Capacete',
      chestplate: 'Peitoral',
      leggings: 'Calças',
      boots: 'Botas',
      belt: 'Cinto'
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

    const slots = ['mainhand', 'offhand', 'helmet', 'chestplate', 'leggings', 'boots', 'belt']
    const slot = slots[Math.floor(Math.random() * slots.length)]

    const roleKey = normalizeRole(role)
    const slotName = resolveSlotName(slot, roleKey)

    const item = enrichItem({
      id: Date.now() + Math.random(),
      name: slotName,
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

    const upgraded = enrichItem({
      id: Date.now() + Math.random(),
      name: base.name, // mantém o nome original
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
      image: item.image || getItemImage(roleKey, item.slot)
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
      leggings: 'Calças',
      boots: 'Botas',
      belt: 'Cinto'
    }
    return slotNames[slot] || slot
  }

  function init() {
    inventory.value = inventory.value.map(enrichItem)
    equippedItems.value = equippedItems.value.map(enrichItem)
    saveState()
  }

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

