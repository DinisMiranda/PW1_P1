<template>
  <div class="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold font-solo text-white uppercase tracking-wider">Painel de Administração</h2>
      <div class="flex items-center gap-2 text-sm text-white/60">
        <span class="material-symbols-rounded text-primary">admin_panel_settings</span>
        <span>Modo Admin</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex gap-2 border-b-2 border-primary/30">
          <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 font-semibold transition-all',
          activeTab === tab.id
            ? 'border-b-2 border-primary text-primary bg-primary/10'
            : 'text-white/60 hover:text-white'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Dashboard Tab -->
    <div v-if="activeTab === 'dashboard'" class="space-y-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="border-2 border-primary/50 bg-card-solo p-4">
          <p class="text-xs font-solo uppercase tracking-widest text-primary/80 mb-2">Nível do Utilizador</p>
          <p class="text-3xl font-bold font-solo text-white text-glow">{{ userStore.level }}</p>
        </div>
        <div class="border-2 border-primary/50 bg-card-solo p-4">
          <p class="text-xs font-solo uppercase tracking-widest text-primary/80 mb-2">XP Total</p>
          <p class="text-3xl font-bold font-solo text-white text-glow">{{ userStore.xp }}</p>
        </div>
        <div class="border-2 border-primary/50 bg-card-solo p-4">
          <p class="text-xs font-solo uppercase tracking-widest text-primary/80 mb-2">Hábitos Ativos</p>
          <p class="text-3xl font-bold font-solo text-white text-glow">{{ habitStore.activeHabits.length }}</p>
        </div>
        <div class="border-2 border-primary/50 bg-card-solo p-4">
          <p class="text-xs font-solo uppercase tracking-widest text-primary/80 mb-2">Fase Atual</p>
          <p class="text-3xl font-bold font-solo text-white text-glow">{{ battleStore.currentPhase }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="border-2 border-primary/50 bg-card-solo p-6">
          <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Estatísticas de Hábitos</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-white">
              <span>Total de hábitos:</span>
              <span class="font-bold">{{ habitStore.totalHabits }}</span>
            </div>
            <div class="flex justify-between text-white">
              <span>Hábitos ativos:</span>
              <span class="font-bold text-primary">{{ habitStore.activeHabits.length }}</span>
            </div>
            <div class="flex justify-between text-white">
              <span>XP total ganho:</span>
              <span class="font-bold text-xp">{{ habitStore.habits.reduce((sum, h) => sum + h.xpEarned, 0) }}</span>
            </div>
          </div>
        </div>

        <div class="border-2 border-primary/50 bg-card-solo p-6">
          <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Inventário</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-white">
              <span>Itens no inventário:</span>
              <span class="font-bold">{{ itemStore.inventory.length }}</span>
            </div>
            <div class="flex justify-between text-white">
              <span>Itens equipados:</span>
              <span class="font-bold text-primary">{{ itemStore.equippedItems.length }}</span>
            </div>
            <div class="flex justify-between text-white">
              <span>Loot boxes:</span>
              <span class="font-bold text-xp">{{ Object.values(itemStore.lootBoxes).reduce((a, b) => a + b, 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gerir Fases Tab -->
    <div v-if="activeTab === 'phases'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold font-solo text-white uppercase tracking-wider">Fases de Batalha</h3>
        <button
          @click="showAddPhase = true"
          class="inline-flex items-center gap-2 border-2 border-primary bg-primary/20 px-4 py-2 text-white font-bold hover:bg-primary/30 transition-all"
        >
          <span class="material-symbols-rounded text-sm">add</span>
          Nova Fase
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="phase in battleStore.phases"
          :key="phase.id"
          class="border-2 border-primary/50 bg-card-solo p-4 hover:border-primary transition-all"
        >
          <div class="mb-2 flex items-center justify-between">
            <h4 class="font-bold text-white">{{ phase.name }}</h4>
            <span class="text-xs text-primary">ID: {{ phase.id }}</span>
          </div>
          <div class="space-y-1 text-sm text-white/80">
            <div class="flex justify-between">
              <span>HP Inimigo:</span>
              <span class="font-bold text-white">{{ phase.enemyHP }}</span>
            </div>
            <div class="flex justify-between">
              <span>Ataque Inimigo:</span>
              <span class="font-bold text-white">{{ phase.enemyAttack }}</span>
            </div>
            <div class="flex justify-between">
              <span>Recompensa:</span>
              <span class="font-bold capitalize" :style="{ color: getRarityColor(phase.reward) }">
                {{ phase.reward }}
              </span>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button
              @click="editPhase(phase)"
              class="flex-1 border-2 border-primary/50 bg-primary/10 px-3 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white"
            >
              Editar
            </button>
              <button
                @click="deletePhase(phase.id)"
                class="flex-1 border-2 border-red-500/50 bg-red-500/10 px-3 py-2 text-sm hover:border-red-500 hover:bg-red-500/20 transition-all text-white"
              >
                Eliminar
              </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gerir Itens Tab -->
    <div v-if="activeTab === 'items'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold font-solo text-white uppercase tracking-wider">Criar Item Personalizado</h3>
      </div>

      <div class="border-2 border-primary/50 bg-card-solo p-6">
        <form @submit.prevent="createCustomItem" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Nome do Item</label>
              <input
                v-model="newItem.name"
                type="text"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Ex: Espada Lendária"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Slot</label>
              <select
                v-model="newItem.slot"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
                <option value="mainhand">Mão Principal</option>
                <option value="offhand">Mão Secundária</option>
                <option value="helmet">Capacete</option>
                <option value="chestplate">Peitoral</option>
                <option value="boots">Botas</option>
                <option value="belt">Acessório (Anel)</option>
                <option value="amulet">Amuleto</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Raridade</label>
              <select
                v-model="newItem.rarity"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
                <option value="common">Comum</option>
                <option value="uncommon">Incomum</option>
                <option value="rare">Raro</option>
                <option value="epic">Épico</option>
                <option value="legendary">Lendário</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Força (STR)</label>
              <input
                v-model.number="newItem.stats.str"
                type="number"
                min="0"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Vitalidade (VIT)</label>
              <input
                v-model.number="newItem.stats.vit"
                type="number"
                min="0"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Agilidade (AGI)</label>
              <input
                v-model.number="newItem.stats.agi"
                type="number"
                min="0"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Inteligência (INT)</label>
              <input
                v-model.number="newItem.stats.int"
                type="number"
                min="0"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            class="w-full border-2 border-primary bg-primary/20 px-6 py-3 text-white font-bold hover:bg-primary/30 transition-all"
          >
            Criar Item
          </button>
        </form>
      </div>

      <div class="border-2 border-primary/50 bg-card-solo p-6">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Ações Rápidas</h3>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            @click="addLootBoxes(5)"
            class="border-2 border-primary/50 bg-primary/10 px-4 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white"
          >
            +5 Loot Boxes
          </button>
          <button
            @click="generateRandomItem('common')"
            class="border-2 border-primary/50 bg-primary/10 px-4 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white"
          >
            Gerar Item Comum
          </button>
          <button
            @click="generateRandomItem('epic')"
            class="border-2 border-primary/50 bg-primary/10 px-4 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white"
          >
            Gerar Item Épico
          </button>
          <button
            @click="generateRandomItem('legendary')"
            class="border-2 border-primary/50 bg-primary/10 px-4 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white"
          >
            Gerar Item Lendário
          </button>
        </div>
      </div>
    </div>

    <!-- Ajustes de Utilizador Tab -->
    <div v-if="activeTab === 'user'" class="space-y-6">
      <div class="border-2 border-primary/50 bg-card-solo p-6">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Ajustar XP e Nível</h3>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-semibold text-white">XP Atual: {{ userStore.xp }}</label>
            <div class="flex gap-2">
              <input
                v-model.number="xpAdjustment"
                type="number"
                class="flex-1 border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Valor de XP"
              />
              <button
                @click="adjustXP(xpAdjustment)"
                class="border-2 border-primary bg-primary/20 px-6 py-2 text-white font-bold hover:bg-primary/30 transition-all"
              >
                Aplicar
              </button>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-white">Nível Atual: {{ userStore.level }}</label>
            <div class="flex gap-2">
              <input
                v-model.number="levelAdjustment"
                type="number"
                min="1"
                class="flex-1 border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Novo nível"
              />
              <button
                @click="setLevel(levelAdjustment)"
                class="border-2 border-primary bg-primary/20 px-6 py-2 text-white font-bold hover:bg-primary/30 transition-all"
              >
                Definir Nível
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="border-2 border-primary/50 bg-card-solo p-6">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Gerir Badges</h3>
        <div class="space-y-4">
          <div>
            <p class="mb-2 text-sm text-white/80">Badges desbloqueadas: {{ userStore.badges.length }}</p>
            <div class="mb-4 flex flex-wrap gap-2">
              <span
                v-for="badge in userStore.badges"
                :key="badge"
                class="px-3 py-1 text-sm font-bold border-2 border-primary/50 bg-primary/10 text-primary"
              >
                {{ badge }}
              </span>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-white">Adicionar Badge</label>
            <div class="flex gap-2">
              <input
                v-model="newBadge"
                type="text"
                class="flex-1 border-2 border-primary/50 bg-black/50 px-4 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="ID da badge (ex: primeiro-passo)"
              />
              <button
                @click="addBadge(newBadge)"
                class="border-2 border-primary bg-primary/20 px-6 py-2 text-white font-bold hover:bg-primary/30 transition-all"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sistema Tab -->
    <div v-if="activeTab === 'system'" class="space-y-6">
      <div class="border-2 border-red-500/50 bg-red-500/10 p-6">
        <h3 class="mb-4 font-bold font-solo text-red-500 uppercase tracking-wider">Zona de Perigo</h3>
        <div class="space-y-4">
          <div>
            <p class="mb-4 text-sm text-white/80">
              Estas ações são irreversíveis. Use com cuidado!
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                @click="resetAllData"
                class="border-2 border-red-500 bg-red-500/20 px-6 py-3 text-white font-bold hover:bg-red-500/30 transition-all"
              >
                Reiniciar Todos os Dados
              </button>
              <button
                @click="resetHabits"
                class="border-2 border-red-500 bg-red-500/20 px-6 py-3 text-white font-bold hover:bg-red-500/30 transition-all"
              >
                Reiniciar Hábitos
              </button>
              <button
                @click="resetInventory"
                class="border-2 border-red-500 bg-red-500/20 px-6 py-3 text-white font-bold hover:bg-red-500/30 transition-all"
              >
                Reiniciar Inventário
              </button>
              <button
                @click="resetBattle"
                class="border-2 border-red-500 bg-red-500/20 px-6 py-3 text-white font-bold hover:bg-red-500/30 transition-all"
              >
                Reiniciar Batalhas
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="border-2 border-primary/50 bg-card-solo p-6">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Informações do Sistema</h3>
        <div class="space-y-2 text-sm text-white/80">
          <div class="flex justify-between">
            <span>Armazenamento usado:</span>
            <span class="font-bold text-white">{{ storageSize }}</span>
          </div>
          <div class="flex justify-between">
            <span>Itens no localStorage:</span>
            <span class="font-bold text-white">{{ localStorageKeys.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useHabitStore } from '../stores/habit'
import { useItemStore } from '../stores/items'
import { useBattleStore } from '../stores/battle'

const userStore = useUserStore()
const habitStore = useHabitStore()
const itemStore = useItemStore()
const battleStore = useBattleStore()

const activeTab = ref('dashboard')
const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'phases', label: 'Fases' },
  { id: 'items', label: 'Itens' },
  { id: 'user', label: 'Utilizador' },
  { id: 'system', label: 'Sistema' }
]

const showAddPhase = ref(false)
const xpAdjustment = ref(0)
const levelAdjustment = ref(1)
const newBadge = ref('')
const newItem = ref({
  name: '',
  slot: 'mainhand',
  rarity: 'common',
  stats: { str: 0, vit: 0, agi: 0, int: 0 }
})

const storageSize = computed(() => {
  let total = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return (total / 1024).toFixed(2) + ' KB'
})

const localStorageKeys = computed(() => {
  return Object.keys(localStorage)
})

function getRarityColor(rarity) {
  const colors = {
    common: '#94A3B8',
    uncommon: '#00D9FF',
    rare: '#7B2CBF',
    epic: '#FF6B00',
    legendary: '#FFD700'
  }
  return colors[rarity] || colors.common
}

function editPhase(phase) {
  // Implementar edição de fase
  const newHP = prompt(`Novo HP para ${phase.name}:`, phase.enemyHP)
  const newAttack = prompt(`Novo Ataque para ${phase.name}:`, phase.enemyAttack)
  if (newHP && newAttack) {
    const index = battleStore.phases.findIndex(p => p.id === phase.id)
    if (index !== -1) {
      battleStore.phases[index].enemyHP = parseInt(newHP)
      battleStore.phases[index].enemyAttack = parseInt(newAttack)
      battleStore.saveState()
    }
  }
}

function deletePhase(phaseId) {
  if (confirm('Tem a certeza que deseja eliminar esta fase?')) {
    battleStore.phases = battleStore.phases.filter(p => p.id !== phaseId)
    battleStore.saveState()
  }
}

function createCustomItem() {
  const item = {
    id: Date.now() + Math.random(),
    name: newItem.value.name,
    slot: newItem.value.slot,
    rarity: newItem.value.rarity,
    stats: { ...newItem.value.stats }
  }
  itemStore.inventory.push(item)
  itemStore.saveState()
  
  // Reset form
  newItem.value = {
    name: '',
    slot: 'mainhand',
    rarity: 'common',
    stats: { str: 0, vit: 0, agi: 0, int: 0 }
  }
  
  alert('Item criado com sucesso!')
}

function generateRandomItem(rarity) {
  const item = itemStore.generateItem(rarity)
  alert(`Item ${rarity} gerado: ${item.name}`)
}

function addLootBoxes(count) {
  itemStore.addBox('phase1', count)
  alert(`${count} loot boxes adicionadas!`)
}

function adjustXP(amount) {
  if (amount > 0) {
    userStore.gainXP(amount)
  } else if (amount < 0) {
    userStore.loseXP(Math.abs(amount))
  }
  xpAdjustment.value = 0
}

function setLevel(level) {
  if (level < 1) level = 1
  const currentXP = userStore.xp
  const targetXP = (level - 1) * 100
  const difference = targetXP - currentXP
  if (difference > 0) {
    userStore.gainXP(difference)
  } else if (difference < 0) {
    userStore.loseXP(Math.abs(difference))
  }
  levelAdjustment.value = 1
}

function addBadge(badgeId) {
  if (badgeId && !userStore.badges.includes(badgeId)) {
    userStore.badges.push(badgeId)
    userStore.saveState()
    newBadge.value = ''
    alert('Badge adicionada!')
  }
}

function resetAllData() {
  if (confirm('Tem a certeza que deseja reiniciar TODOS os dados? Esta ação é irreversível!')) {
    localStorage.clear()
    location.reload()
  }
}

function resetHabits() {
  if (confirm('Reiniciar todos os hábitos?')) {
    habitStore.habits = []
    habitStore.saveHabits()
    alert('Hábitos reiniciados!')
  }
}

function resetInventory() {
  if (confirm('Reiniciar inventário e itens equipados?')) {
    itemStore.inventory = []
    itemStore.equippedItems = []
    itemStore.saveState()
    alert('Inventário reiniciado!')
  }
}

function resetBattle() {
  if (confirm('Reiniciar progresso de batalhas?')) {
    battleStore.currentPhase = 1
    battleStore.phases = []
    battleStore.initPhases()
    battleStore.saveState()
    alert('Batalhas reiniciadas!')
  }
}

onMounted(() => {
  battleStore.initPhases()
})
</script>

<style scoped></style>

