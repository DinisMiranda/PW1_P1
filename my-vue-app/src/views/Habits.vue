<template>
  <div>
    <div class="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-2xl font-bold font-solo text-white uppercase tracking-wider">Hábitos</h2>
      <div class="flex flex-wrap gap-2">
        <button
          @click="resetFormState(); showForm = true"
          class="inline-flex items-center gap-2 border-2 border-primary bg-primary/20 px-4 py-2 text-white font-bold hover:bg-primary/30 glow-cyan transition-all"
        >
          <span class="material-symbols-rounded">add</span>
          Novo Hábito
        </button>
      </div>
    </div>

    <!-- Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click.self="showForm = false"
    >
      <div class="w-full max-w-md border-2 border-primary bg-card-solo p-6 glow-cyan">
        <h3 class="mb-4 text-xl font-bold font-solo text-primary text-glow uppercase tracking-wider">{{ editingHabit ? 'Editar Hábito' : 'Novo Hábito' }}</h3>
        <form @submit.prevent="saveHabit" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Nome</label>
            <div class="space-y-2">
              <select
                v-model="selectedHabitName"
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 focus:border-primary focus:outline-none text-white transition-all font-semibold"
              >
                <option
                  v-for="name in habitNameOptions"
                  :key="name"
                  :value="name"
                  class="bg-black"
                >
                  {{ name }}
                </option>
                <option :value="customHabitOptionValue" class="bg-black text-white/80">Personalizar...</option>
              </select>
              <input
                v-if="selectedHabitName === customHabitOptionValue"
                v-model="formData.name"
                type="text"
                required
                class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
                placeholder="Escreva o nome do hábito"
              />
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Categoria</label>
            <select
              v-model="formData.category"
              class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 focus:border-primary focus:outline-none text-white transition-all font-semibold"
            >
              <option
                v-for="category in categoryOptions"
                :key="category"
                :value="category"
                class="bg-black"
              >
                {{ category }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Dificuldade</label>
            <p class="w-full border-2 border-primary/30 bg-black/30 px-4 py-2 text-white/80 font-semibold">
              {{ selectedDifficultyLabel }} · +{{ selectedDifficultyXp }} XP 
            </p>
            <p class="mt-1 text-xs text-white/50">A dificuldade é atribuída automaticamente de acordo com o tipo de hábito.</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Frequência</label>
            <select
              v-model="formData.frequency"
              class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 focus:border-primary focus:outline-none text-white transition-all font-semibold"
            >
              <option value="daily" class="bg-black">Diário</option>
              <option value="weekly" class="bg-black">Semanal</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Meta</label>
            <input
              v-model.number="formData.goalCount"
              type="number"
              min="1"
              class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
              placeholder="1"
            />
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              class="flex-1 border-2 border-primary bg-primary/20 px-4 py-2 text-white font-bold font-solo uppercase tracking-wider hover:bg-primary/30 glow-cyan transition-all"
            >
              {{ editingHabit ? 'Atualizar' : 'Criar' }}
            </button>
            <button
              type="button"
              @click="showForm = false; resetFormState()"
              class="flex-1 border-2 border-primary/50 bg-primary/10 px-4 py-2 hover:border-primary hover:bg-primary/20 text-white transition-all font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Habits List -->
    <div v-if="habitStore.habits.length === 0" class="border-2 border-primary/30 bg-card-solo p-12 text-center">
      <p class="text-white/60">Nenhum hábito criado ainda.</p>
      <button
        @click="resetFormState(); showForm = true"
        class="mt-4 inline-flex items-center gap-2 border-2 border-primary bg-primary/20 px-4 py-2 text-white font-bold hover:bg-primary/30 glow-cyan transition-all"
      >
        <span class="material-symbols-rounded">add</span>
        Criar primeiro hábito
      </button>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="habit in habitStore.habits"
        :key="habit.id"
        class="border-2 border-primary/50 bg-card-solo p-4 hover:border-primary hover:glow-cyan transition-all"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-bold text-white mb-1">{{ habit.name }}</h3>
            <p class="text-sm text-white/70">{{ habit.category || 'Geral' }}</p>
            <p class="mt-1 text-xs text-white/60">
              Dificuldade:
              <span class="text-primary font-bold">{{ difficultyLabel(habit.difficulty) }}</span>
              · +{{ habit.xpValue }} XP
            </p>
            <p class="mt-1 text-xs text-white/60">Streak: <span class="text-primary font-bold text-glow">{{ habit.streak }} dias</span></p>
          </div>
          <span class="px-2 py-1 text-xs font-bold font-solo border-2 border-primary/50 bg-primary/10 text-primary">
            {{ habit.frequency === 'daily' ? 'Diário' : 'Semanal' }}
          </span>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <button
            @click="editHabit(habit)"
            class="inline-flex items-center gap-2 border-2 border-primary/50 bg-primary/10 px-3 py-2 text-sm hover:border-primary hover:bg-primary/20 transition-all text-white font-semibold"
          >
            <span class="material-symbols-rounded text-sm">edit</span>
            Editar
          </button>
          <button
            @click="deleteHabit(habit.id)"
            class="inline-flex items-center gap-2 border-2 border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:border-red-500 hover:bg-red-500/20 transition-all font-semibold"
          >
            <span class="material-symbols-rounded text-sm">delete</span>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useHabitStore } from '../stores/habit'
import { useRoute } from 'vue-router'
import { DIFFICULTY_XP_MAP } from '../constants/progression'

const habitStore = useHabitStore()
const route = useRoute()

// Opções base para popular selects e sugestões rápidos
const baseCategories = Object.freeze(['Saúde', 'Educação', 'Trabalho', 'Bem-estar', 'Produtividade', 'Finanças', 'Criatividade'])
const categoryOptions = ref([...baseCategories])
const customHabitOptionValue = '__custom_habit__'
const baseHabitTemplates = Object.freeze([
  { name: 'Beber água', difficulty: 'easy' },
  { name: 'Meditar', difficulty: 'medium' },
  { name: 'Ler 30 minutos', difficulty: 'hard' },
  { name: 'Exercitar', difficulty: 'hard' },
  { name: 'Alongar', difficulty: 'easy' },
  { name: 'Escrever um diário', difficulty: 'medium' },
  { name: 'Planejar o dia', difficulty: 'medium' },
  { name: 'Rever objetivos', difficulty: 'hard' },
  { name: 'Caminhar 10k passos', difficulty: 'medium' },
  { name: 'Dormir 8 horas', difficulty: 'medium' },
  { name: 'Limpeza expressa', difficulty: 'easy' },
  { name: 'Café da manhã saudável', difficulty: 'easy' },
  { name: 'Revisar finanças', difficulty: 'medium' },
  { name: 'Estudar um idioma', difficulty: 'hard' },
  { name: 'Desconectar da tela', difficulty: 'medium' },
  { name: 'Organizar tarefas', difficulty: 'medium' },
  { name: 'Praticar gratidão', difficulty: 'easy' }
])
const habitNameOptions = ref(baseHabitTemplates.map((template) => template.name))
const selectedHabitName = ref(habitNameOptions.value[0] || customHabitOptionValue)
const difficultyLabelMap = Object.freeze({ easy: 'Fácil', medium: 'Médio', hard: 'Difícil' })
const showForm = ref(false)
const editingHabit = ref(null)
const formData = ref(getDefaultForm())
const selectedDifficultyLabel = computed(() => difficultyLabel(formData.value.difficulty))
const selectedDifficultyXp = computed(() => getXpForDifficulty(formData.value.difficulty))

// Garante que categorias/hábitos personalizados aparecem nas dropdowns futuras
function ensureCategoryOption(value) {
  if (!value) return
  if (!categoryOptions.value.includes(value)) {
    categoryOptions.value.push(value)
  }
}

function getDefaultForm() {
  const defaultName = habitNameOptions.value[0] || ''
  const defaultDifficulty = defaultName ? getTemplateDifficulty(defaultName) : 'medium'
  selectedHabitName.value = defaultName || customHabitOptionValue
  return {
    name: defaultName,
    category: categoryOptions.value[0] || '',
    frequency: 'daily',
    goalCount: 1,
    difficulty: defaultDifficulty
  }
}

function ensureHabitNameOption(value) {
  if (!value) return
  if (!habitNameOptions.value.includes(value)) {
    habitNameOptions.value.push(value)
  }
}

function getTemplateByName(name) {
  return baseHabitTemplates.find((template) => template.name === name)
}

function getTemplateDifficulty(name) {
  return getTemplateByName(name)?.difficulty || 'medium'
}

function getXpForDifficulty(difficulty) {
  return DIFFICULTY_XP_MAP[difficulty] ?? DIFFICULTY_XP_MAP.medium
}

function difficultyLabel(value) {
  return difficultyLabelMap[value] || difficultyLabelMap.medium
}

// Preenche o formulário com os dados existentes para edição rápida
function editHabit(habit) {
  editingHabit.value = habit
  ensureHabitNameOption(habit.name)
  ensureCategoryOption(habit.category)
  selectedHabitName.value = habitNameOptions.value.includes(habit.name) ? habit.name : customHabitOptionValue
  formData.value = {
    name: habit.name,
    category: habit.category,
    frequency: habit.frequency,
    goalCount: habit.goalCount,
    difficulty: habit.difficulty || 'medium'
  }
  showForm.value = true
}

// Decide entre criar novo hábito ou atualizar um existente
function saveHabit() {
  if (editingHabit.value) {
    habitStore.updateHabit(editingHabit.value.id, formData.value)
  } else {
    const created = habitStore.createHabit(formData.value)
    ensureHabitNameOption(created.name)
  }
  showForm.value = false
  resetFormState()
}

function deleteHabit(id) {
  if (confirm('Tem a certeza que deseja eliminar este hábito?')) {
    habitStore.deleteHabit(id)
  }
}

function resetFormState() {
  editingHabit.value = null
  formData.value = getDefaultForm()
}

onMounted(() => {
  habitStore.habits.forEach((habit) => {
    ensureHabitNameOption(habit.name)
    ensureCategoryOption(habit.category)
  })
  // Verificar se há parâmetro de edição na URL
  const editId = route.query.edit
  if (editId) {
    const habit = habitStore.habits.find(h => h.id === parseInt(editId))
    if (habit) {
      editHabit(habit)
    }
  }
})

watch(
  () => habitStore.habits.map(habit => habit.category),
  (categories) => {
    categories.forEach((category) => ensureCategoryOption(category))
  },
  { immediate: true }
)

watch(
  () => habitStore.habits.map(habit => habit.name),
  (names) => {
    names.forEach((name) => ensureHabitNameOption(name))
  },
  { immediate: true }
)

watch(
  selectedHabitName,
  (value, oldValue) => {
    if (value === customHabitOptionValue) {
      if (oldValue !== customHabitOptionValue && !editingHabit.value) {
        formData.value.name = ''
      }
      return
    }
    formData.value.name = value
    if (!editingHabit.value || editingHabit.value.name !== value) {
      formData.value.difficulty = getTemplateDifficulty(value)
    }
  }
)
</script>

<style scoped></style>

