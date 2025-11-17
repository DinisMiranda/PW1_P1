<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-semibold font-display">Hábitos</h2>
      <button
        @click="showForm = true; editingHabit = null"
        class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white hover:brightness-95"
      >
        <span class="material-symbols-rounded">add</span>
        Novo Hábito
      </button>
    </div>

    <!-- Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showForm = false"
    >
      <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <h3 class="mb-4 text-xl font-semibold">{{ editingHabit ? 'Editar Hábito' : 'Novo Hábito' }}</h3>
        <form @submit.prevent="saveHabit" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium">Nome</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="Ex: Beber água"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Categoria</label>
            <input
              v-model="formData.category"
              type="text"
              class="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="Ex: Saúde"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Frequência</label>
            <select
              v-model="formData.frequency"
              class="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
            >
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Meta</label>
            <input
              v-model.number="formData.goalCount"
              type="number"
              min="1"
              class="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="1"
            />
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              class="flex-1 rounded-xl bg-primary px-4 py-2 text-white hover:brightness-95"
            >
              {{ editingHabit ? 'Atualizar' : 'Criar' }}
            </button>
            <button
              type="button"
              @click="showForm = false; editingHabit = null; formData = getDefaultForm()"
              class="flex-1 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Habits List -->
    <div v-if="habitStore.habits.length === 0" class="rounded-xl border border-slate-200 bg-white p-12 text-center">
      <p class="text-slate-500">Nenhum hábito criado ainda.</p>
      <button
        @click="showForm = true"
        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white hover:brightness-95"
      >
        <span class="material-symbols-rounded">add</span>
        Criar primeiro hábito
      </button>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="habit in habitStore.habits"
        :key="habit.id"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-card"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-medium">{{ habit.name }}</h3>
            <p class="text-sm text-slate-500">{{ habit.category || 'Geral' }}</p>
            <p class="mt-1 text-xs text-slate-400">Streak: {{ habit.streak }} dias</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            {{ habit.frequency === 'daily' ? 'Diário' : 'Semanal' }}
          </span>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <button
            @click="editHabit(habit)"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            <span class="material-symbols-rounded">edit</span>
            Editar
          </button>
          <button
            @click="deleteHabit(habit.id)"
            class="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <span class="material-symbols-rounded">delete</span>
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

