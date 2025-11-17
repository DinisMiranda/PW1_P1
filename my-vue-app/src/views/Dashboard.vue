<template>
  <div>
    <!-- Gamification widgets -->
    <section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <LevelIndicator />
      <StreakCounter />
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <XPBar />
      </div>
    </section>

    <!-- Stats -->
    <section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <p class="text-xs uppercase tracking-wide text-slate-500">Streak atual</p>
        <p class="mt-2 text-3xl font-bold">{{ maxStreak }} 🔥</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <p class="text-xs uppercase tracking-wide text-slate-500">Hábitos ativos</p>
        <p class="mt-2 text-3xl font-bold">{{ habitStore.activeHabits.length }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <p class="text-xs uppercase tracking-wide text-slate-500">Conclusão hoje</p>
        <p class="mt-2 text-3xl font-bold">{{ completionRate }}%</p>
      </div>
    </section>

    <!-- Habit list + Calendar -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Habit list -->
      <section class="lg:col-span-1 space-y-3">
        <h3 class="mb-3 text-sm font-semibold text-slate-600">Hábitos de hoje</h3>
        <div v-if="habitStore.activeHabits.length === 0" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          <p>Nenhum hábito criado ainda.</p>
          <router-link to="/habits" class="mt-2 inline-block text-primary hover:underline">
            Criar primeiro hábito →
          </router-link>
        </div>
        <div
          v-for="habit in habitStore.activeHabits.slice(0, 5)"
          :key="habit.id"
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-card"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-medium">{{ habit.name }}</h3>
              <p class="text-sm text-slate-500">{{ habit.category }}</p>
            </div>
            <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              {{ habit.frequency === 'daily' ? 'Diário' : habit.frequency }}
            </span>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <button
              @click="toggleHabit(habit.id)"
              :class="[
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
                isCompletedToday(habit.id)
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 hover:bg-slate-50'
              ]"
            >
              <span class="material-symbols-rounded">{{ isCompletedToday(habit.id) ? 'check_circle' : 'radio_button_unchecked' }}</span>
              {{ isCompletedToday(habit.id) ? 'Concluído' : 'Marcar' }}
            </button>
            <router-link
              :to="`/habits?edit=${habit.id}`"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              <span class="material-symbols-rounded">edit</span>
              Editar
            </router-link>
          </div>
        </div>
      </section>

      <!-- Calendar heatmap -->
      <section class="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ currentMonth }}</h2>
        </div>

        <!-- Weekday labels -->
        <div class="mt-4 grid grid-cols-7 text-center text-xs text-slate-500">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        <!-- Grid -->
        <div class="mt-2 grid grid-cols-7 gap-2">
          <div
            v-for="day in calendarDays"
            :key="day.date"
            :class="[
              'aspect-square rounded-xl',
              day.completed ? 'bg-primary' : day.isToday ? 'bg-slate-200' : 'bg-slate-100'
            ]"
            :title="day.date"
          ></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useHabitStore } from '../stores/habit'
import { useUserStore } from '../stores/user'
import LevelIndicator from '../components/LevelIndicator.vue'
import StreakCounter from '../components/StreakCounter.vue'
import XPBar from '../components/XPBar.vue'

const habitStore = useHabitStore()
const userStore = useUserStore()

onMounted(() => {
  // Atualizar streak ao carregar
  if (habitStore.activeHabits.length > 0) {
    const max = Math.max(...habitStore.activeHabits.map(h => h.streak))
    userStore.updateStreak(max)
  }
})

const today = new Date().toISOString().split('T')[0]

const maxStreak = computed(() => {
  if (habitStore.activeHabits.length === 0) return 0
  return Math.max(...habitStore.activeHabits.map(h => h.streak))
})

const completionRate = computed(() => {
  if (habitStore.activeHabits.length === 0) return 0
  const completed = habitStore.activeHabits.filter(h => isCompletedToday(h.id)).length
  return Math.round((completed / habitStore.activeHabits.length) * 100)
})

function isCompletedToday(habitId) {
  const habit = habitStore.habits.find(h => h.id === habitId)
  return habit?.completedDays.includes(today) || false
}

function toggleHabit(habitId) {
  habitStore.toggleHabitDone(habitId, today)
  // Atualizar streak global
  const max = Math.max(...habitStore.activeHabits.map(h => h.streak), 0)
  userStore.updateStreak(max)
}

const currentMonth = computed(() => {
  return new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  // Preencher dias vazios no início
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: '', completed: false, isToday: false })
  }
  
  // Dias do mês
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day)
    const dateStr = date.toISOString().split('T')[0]
    const completed = habitStore.habits.some(h => h.completedDays.includes(dateStr))
    const isToday = dateStr === today.toISOString().split('T')[0]
    days.push({ date: dateStr, completed, isToday })
  }
  
  return days.slice(0, 35) // Mostrar ~5 semanas
})
</script>

<style scoped></style>

