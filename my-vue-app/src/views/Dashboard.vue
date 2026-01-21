<template>
  <div class="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-6">
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left column: widgets, stats, habits -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Gamification widgets -->
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <LevelIndicator />
          <StreakCounter />
          <div class="border-2 border-primary/50 bg-card-solo p-4">
            <XPBar />
          </div>
        </section>

        <!-- Stats -->
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="border-2 border-primary/50 bg-card-solo p-4 hover:border-primary hover:glow-cyan transition-all">
            <p class="text-xs font-solo uppercase tracking-widest text-primary/80 mb-2">Streak atual</p>
            <p class="text-3xl font-bold font-solo text-white text-glow">{{ maxStreak }} 🔥</p>
          </div>
          <div class="border-2 border-primary/50 bg-card-solo p-4 hover:border-primary hover:glow-cyan transition-all">
            <p class="text-xs font-solo uppercase tracking-widest text-primary/80 mb-2">Hábitos ativos</p>
            <p class="text-3xl font-bold font-solo text-white text-glow">{{ habitStore.activeHabits.length }}</p>
          </div>
          <div class="border-2 border-primary/50 bg-card-solo p-4 hover:border-primary hover:glow-cyan transition-all">
            <p class="text-xs font-solo uppercase tracking-widest text-primary/80 mb-2">Conclusão hoje</p>
            <p class="text-3xl font-bold font-solo text-white text-glow">{{ completionRate }}%</p>
          </div>
        </section>

        <!-- Habit list -->
        <section class="space-y-4 flex flex-col items-center">
        <div class="flex items-center justify-between w-full max-w-sm mx-auto">
          <h3 class="text-base font-bold font-solo text-white uppercase tracking-wider">Hábitos de hoje</h3>
          <div v-if="habitStore.activeHabits.length > 0" class="text-xs text-white/80 bg-black/30 border border-primary/40 px-2 py-1 rounded">
            {{ slideIndex + 1 }} / {{ habitStore.activeHabits.length }}
          </div>
        </div>
        <div v-if="habitStore.activeHabits.length === 0" class="border-2 border-primary/30 bg-card-solo p-6 text-center text-white/60 w-full max-w-sm mx-auto">
          <p>Nenhum hábito criado ainda.</p>
          <router-link to="/habits" class="mt-2 inline-block text-primary hover:text-primary/80 transition-colors font-semibold">
            Criar primeiro hábito →
          </router-link>
        </div>
        <div v-else class="relative w-full max-w-sm mx-auto">
          <transition name="slide-fade" mode="out-in">
            <div
              v-if="currentHabit"
              :key="currentHabit.id"
              class="w-full border-2 border-primary/50 bg-card-solo p-2 hover:border-primary hover:glow-cyan transition-all min-h-[72px]"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-sm font-bold text-white mb-1">{{ currentHabit.name }}</h3>
                  <p class="text-xs text-white/70">{{ currentHabit.category }}</p>
                </div>
                <span class="px-2 py-1 text-[10px] font-bold font-solo border-2 border-primary/50 bg-primary/10 text-primary">
                  {{ currentHabit.frequency === 'daily' ? 'Diário' : currentHabit.frequency }}
                </span>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <button
                  @click="toggleHabit(currentHabit.id)"
                  :class="[
                    'inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all',
                    isCompletedToday(currentHabit.id)
                      ? 'border-2 border-xp bg-xp text-[#0f131c] glow-cyan'
                      : 'border-2 border-primary/50 bg-primary/10 hover:border-primary hover:bg-primary/20 text-white'
                  ]"
                >
                  <span class="material-symbols-rounded text-sm">{{ isCompletedToday(currentHabit.id) ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  {{ isCompletedToday(currentHabit.id) ? 'Concluído' : 'Marcar' }}
                </button>
                <router-link
                  :to="`/habits?edit=${currentHabit.id}`"
                  class="inline-flex items-center gap-2 border-2 border-primary/50 bg-primary/10 px-3 py-2 text-xs hover:border-primary hover:bg-primary/20 transition-all text-white font-semibold"
                >
                  <span class="material-symbols-rounded text-sm">edit</span>
                  Editar
                </router-link>
              </div>
            </div>
          </transition>

          <button
            v-if="habitStore.activeHabits.length > 1"
            @click="prevHabit"
            class="absolute -left-6 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border-2 border-primary/50 bg-primary/10 text-white hover:border-primary hover:bg-primary/20 transition-all flex items-center justify-center"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            v-if="habitStore.activeHabits.length > 1"
            @click="nextHabit"
            class="absolute -right-6 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border-2 border-primary/50 bg-primary/10 text-white hover:border-primary hover:bg-primary/20 transition-all flex items-center justify-center"
            aria-label="Seguinte"
          >
            ›
          </button>
        </div>
        </section>
      </div>

      <!-- Right column: calendar heatmap -->
      <section class="border-2 border-primary/50 bg-card-solo p-3 sm:p-4 w-full lg:col-span-1 lg:ml-auto self-start">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold font-solo text-white uppercase tracking-wider">{{ currentMonth }}</h2>
        </div>

        <!-- Weekday labels -->
        <div class="mt-4 grid grid-cols-7 text-center text-xs font-solo text-primary/80 uppercase tracking-wider justify-items-center">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        <!-- Grid -->
        <div class="mt-2 grid grid-cols-7 gap-1 justify-items-center">
          <div
            v-for="day in calendarDays"
            :key="day.date"
            :class="[
              'w-8 h-8 sm:w-9 sm:h-9 text-[11px] flex items-center justify-center font-bold transition-all border-2 rounded-full',
              day.completed 
                ? 'border-xp bg-xp text-[#0f131c] glow-cyan' 
                : day.isToday 
                  ? 'border-primary/70 bg-primary/20 text-primary' 
                  : 'border-primary/20 bg-black/30 text-white/40'
            ]"
            :title="day.date"
          >
            <span v-if="day.date">{{ new Date(day.date).getDate() }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useHabitStore } from '../stores/habit'
import { useUserStore } from '../stores/user'
import { useCharacterStore } from '../stores/character'
import LevelIndicator from '../components/LevelIndicator.vue'
import StreakCounter from '../components/StreakCounter.vue'
import XPBar from '../components/XPBar.vue'

const habitStore = useHabitStore()
const userStore = useUserStore()
const characterStore = useCharacterStore()

onMounted(() => {
  // Atualizar streak ao carregar
  if (habitStore.activeHabits.length > 0) {
    const max = Math.max(...habitStore.activeHabits.map(h => h.streak))
    userStore.updateStreak(max)
  }
})

const today = new Date().toISOString().split('T')[0]

const slideIndex = ref(0)

watch(
  () => habitStore.activeHabits.length,
  (len) => {
    if (len === 0) {
      slideIndex.value = 0
    } else {
      slideIndex.value = Math.min(slideIndex.value, len - 1)
    }
  }
)

const currentHabit = computed(() => {
  if (habitStore.activeHabits.length === 0) return null
  return habitStore.activeHabits[slideIndex.value] || null
})

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

function nextHabit() {
  if (habitStore.activeHabits.length === 0) return
  slideIndex.value = (slideIndex.value + 1) % habitStore.activeHabits.length
}

function prevHabit() {
  if (habitStore.activeHabits.length === 0) return
  slideIndex.value = (slideIndex.value - 1 + habitStore.activeHabits.length) % habitStore.activeHabits.length
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

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 200ms ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>