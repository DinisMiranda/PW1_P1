import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const RARITIES = {
  common: { name: 'Comum', color: '#94A3B8', glow: 'rgba(148, 163, 184, 0.3)' },
  uncommon: { name: 'Incomum', color: '#00D9FF', glow: 'rgba(0, 217, 255, 0.3)' },
  rare: { name: 'Raro', color: '#7B2CBF', glow: 'rgba(123, 44, 191, 0.3)' },
  epic: { name: 'Épico', color: '#FF6B00', glow: 'rgba(255, 107, 0, 0.3)' },
  legendary: { name: 'Lendário', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.3)' }
}

export const useItemStore = defineStore('items', () => {
  const inventory = ref(JSON.parse(localStorage.getItem('inventory') || '[]'))
  const equippedItems = ref(JSON.parse(localStorage.getItem('equippedItems') || '[]'))

  function saveState() {
    localStorage.setItem('inventory', JSON.stringify(inventory.value))
    localStorage.setItem('equippedItems', JSON.stringify(equippedItems.value))
  }

  function generateItem(rarity = null) {
    // Se não especificar raridade, escolhe aleatoriamente (mais comum = mais provável)
    if (!rarity) {
      const rand = Math.random()
      if (rand < 0.5) rarity = 'common'
      else if (rand < 0.75) rarity = 'uncommon'
      else if (rand < 0.9) rarity = 'rare'
      else if (rand < 0.98) rarity = 'epic'
      else rarity = 'legendary'
    }

    const rarityData = RARITIES[rarity]
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
    const slotNames = {
      mainhand: 'Mão Principal',
      offhand: 'Mão Secundária',
      helmet: 'Capacete',
      chestplate: 'Peitoral',
      leggings: 'Calças',
      boots: 'Botas',
      belt: 'Cinto'
    }
    
    const slot = slots[Math.floor(Math.random() * slots.length)]
    
    const item = {
      id: Date.now() + Math.random(),
      name: `${slotNames[slot]} ${rarityData.name}`,
      rarity,
      stats,
      slot
    }

    inventory.value.push(item)
    saveState()
    return item
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
    saveState()
  }

  return {
    inventory,
    equippedItems,
    generateItem,
    equipItem,
    unequipItem,
    getRarityInfo,
    getSlotName,
    init
  }
})

