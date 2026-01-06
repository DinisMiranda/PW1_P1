<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold font-solo text-white uppercase tracking-wider">Hábitos</h2>
      <button
        @click="showForm = true; editingHabit = null"
        class="inline-flex items-center gap-2 border-2 border-primary bg-primary/20 px-4 py-2 text-white font-bold hover:bg-primary/30 glow-cyan transition-all"
      >
        <span class="material-symbols-rounded">add</span>
        Novo Hábito
      </button>
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
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
              placeholder="Ex: Beber água"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold font-solo text-primary/80 uppercase tracking-wider">Categoria</label>
            <input
              v-model="formData.category"
              type="text"
              class="w-full border-2 border-primary/50 bg-black/50 px-4 py-2 focus:border-primary focus:outline-none text-white placeholder:text-white/40 transition-all font-semibold"
              placeholder="Ex: Saúde"
            />
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
              @click="showForm = false; editingHabit = null; formData = getDefaultForm()"
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
        @click="showForm = true"
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
import { ref, onMounted } from 'vue'
import { useHabitStore } from '../stores/habit'
import { useRoute } from 'vue-router'

const habitStore = useHabitStore()
const route = useRoute()

const showForm = ref(false)
const editingHabit = ref(null)
const formData = ref(getDefaultForm())

function getDefaultForm() {
  return {
    name: '',
    category: '',
    frequency: 'daily',
    goalCount: 1
  }
}

function editHabit(habit) {
  editingHabit.value = habit
  formData.value = {
    name: habit.name,
    category: habit.category,
    frequency: habit.frequency,
    goalCount: habit.goalCount
  }
  showForm.value = true
}

function saveHabit() {
  if (editingHabit.value) {
    habitStore.updateHabit(editingHabit.value.id, formData.value)
  } else {
    habitStore.createHabit(formData.value)
  }
  showForm.value = false
  editingHabit.value = null
  formData.value = getDefaultForm()
}

function deleteHabit(id) {
  if (confirm('Tem a certeza que deseja eliminar este hábito?')) {
    habitStore.deleteHabit(id)
  }
}

onMounted(() => {
  // Verificar se há parâmetro de edição na URL
  const editId = route.query.edit
  if (editId) {
    const habit = habitStore.habits.find(h => h.id === parseInt(editId))
    if (habit) {
      editHabit(habit)
    }
  }
})
</script>

<style scoped></style>

