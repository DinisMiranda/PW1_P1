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
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 flex items-center justify-center">
                <img v-if="maxStreakImage" :src="maxStreakImage" alt="Streak" class="h-12 w-12 object-contain" />
              </div>
              <p class="text-3xl font-bold font-solo text-white text-glow">{{ maxStreak }} dias</p>
            </div>
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
        <div class="flex items-center justify-between w-full max-w-4xl mx-auto">
          <h3 class="text-xl font-bold font-solo text-white uppercase tracking-wider">Hábitos de hoje</h3>
          <div v-if="habitStore.activeHabits.length > 0" class="text-base text-white/80 bg-black/30 border border-primary/40 px-4 py-2 rounded">
            {{ slideIndex + 1 }} / {{ habitStore.activeHabits.length }}
          </div>
        </div>
        <div v-if="habitStore.activeHabits.length === 0" class="border-2 border-primary/30 bg-card-solo p-8 text-center text-white/60 w-full max-w-4xl mx-auto">
          <p>Nenhum hábito criado ainda.</p>
          <router-link to="/habits" class="mt-2 inline-block text-primary hover:text-primary/80 transition-colors font-semibold">
            Criar primeiro hábito →
          </router-link>
        </div>
        <div v-else class="relative w-full max-w-4xl mx-auto">
          <transition name="slide-fade" mode="out-in">
            <div
              v-if="currentHabit"
              :key="currentHabit.id"
              class="w-full border-2 border-primary/50 bg-card-solo p-6 hover:border-primary hover:glow-cyan transition-all min-h-[140px]"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-xl font-bold text-white mb-2">{{ currentHabit.name }}</h3>
                  <p class="text-base text-white/70">{{ currentHabit.category }}</p>
                </div>
                <span class="px-3 py-1.5 text-xs font-bold font-solo border-2 border-primary/50 bg-primary/10 text-primary">
                  {{ currentHabit.frequency === 'daily' ? 'Diário' : currentHabit.frequency }}
                </span>
              </div>
              <div class="mt-5 flex items-center gap-3">
                <button
                  @click="toggleHabit(currentHabit.id)"
                  :class="[
                    'inline-flex items-center gap-2 px-5 py-3 text-base font-semibold transition-all',
                    isCompletedToday(currentHabit.id)
                      ? 'border-2 border-xp bg-xp text-[#0f131c] glow-cyan'
                      : 'border-2 border-primary/50 bg-primary/10 hover:border-primary hover:bg-primary/20 text-white'
                  ]"
                >
                  <span class="material-symbols-rounded text-lg">{{ isCompletedToday(currentHabit.id) ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  {{ isCompletedToday(currentHabit.id) ? 'Concluído' : 'Marcar' }}
                </button>
                <router-link
                  :to="`/habits?edit=${currentHabit.id}`"
                  class="inline-flex items-center gap-2 border-2 border-primary/50 bg-primary/10 px-5 py-3 text-base hover:border-primary hover:bg-primary/20 transition-all text-white font-semibold"
                >
                  <span class="material-symbols-rounded text-lg">edit</span>
                  Editar
                </router-link>
              </div>
              <p
                v-if="currentHabitProgress.goal > 1 && currentHabitProgress.progress > 0 && !isCompletedToday(currentHabit.id)"
                class="mt-2 text-[11px] text-amber-300"
              >
                Faltam {{ currentHabitProgress.remaining }} registos para cumprir a meta de {{ currentHabitProgress.goal }} hoje.
              </p>
            </div>
          </transition>

          <button
            v-if="habitStore.activeHabits.length > 1"
            @click="prevHabit"
            class="absolute -left-10 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border-2 border-primary/50 bg-primary/10 text-white hover:border-primary hover:bg-primary/20 transition-all flex items-center justify-center text-xl"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            v-if="habitStore.activeHabits.length > 1"
            @click="nextHabit"
            class="absolute -right-10 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border-2 border-primary/50 bg-primary/10 text-white hover:border-primary hover:bg-primary/20 transition-all flex items-center justify-center text-xl"
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

    <!-- Bottom section: Recent Activity, Weekly Stats, and Featured Badges -->
    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <!-- Recent Activity Feed -->
      <section class="border-2 border-primary/50 bg-card-solo p-4 lg:col-span-2">
        <h3 class="text-lg font-bold font-solo text-white uppercase tracking-wider mb-4">Atividades Recentes</h3>
        <div v-if="recentActivities.length === 0" class="text-center py-8 text-white/60">
          <span class="material-symbols-rounded text-4xl mb-2 block">history</span>
          <p>Nenhuma atividade recente</p>
          <p class="text-sm mt-1">Completa hábitos para ver o teu histórico aqui!</p>
        </div>
        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center gap-3 p-3 border-2 border-primary/30 bg-black/20 hover:border-primary/50 hover:bg-black/30 transition-all rounded"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-full border-2 border-xp bg-xp/20 flex items-center justify-center">
              <span class="material-symbols-rounded text-xp text-xl">check_circle</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white">{{ activity.habitName }}</p>
              <p class="text-xs text-white/60">{{ activity.dateFormatted }}</p>
            </div>
            <div class="flex-shrink-0 text-right">
              <p class="text-xs font-bold text-xp">+{{ activity.xp }} XP</p>
              <p class="text-xs text-white/50">{{ activity.category }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Weekly Stats & Featured Badges -->
      <div class="space-y-6">
        <!-- Weekly Stats -->
        <section class="border-2 border-primary/50 bg-card-solo p-4">
          <h3 class="text-lg font-bold font-solo text-white uppercase tracking-wider mb-4">Esta Semana</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 border-2 border-primary/30 bg-black/20 rounded">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-primary">calendar_today</span>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-white">{{ weeklyStats.completed }}</p>
                <p class="text-xs text-white/60">Hábitos completados</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 border-2 border-primary/30 bg-black/20 rounded">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-xp">trending_up</span>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-white">{{ weeklyStats.xpGained }}</p>
                <p class="text-xs text-white/60">XP ganho</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 border-2 border-primary/30 bg-black/20 rounded">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-primary">local_fire_department</span>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-white">{{ weeklyStats.bestStreak }}</p>
                <p class="text-xs text-white/60">Melhor streak</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Next Objectives -->
        <section class="border-2 border-primary/50 bg-card-solo p-4">
          <h3 class="text-lg font-bold font-solo text-white uppercase tracking-wider mb-4">Próximos Objetivos</h3>
          <div v-if="nextObjectives.length === 0" class="text-center py-4 text-white/60 text-sm">
            <p>Nenhum objetivo disponível</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="objective in nextObjectives"
              :key="objective.id"
              class="p-3 border-2 rounded transition-all"
              :class="[
                objective.completed
                  ? 'border-xp bg-xp/10 hover:border-xp hover:glow-cyan'
                  : 'border-primary/30 bg-black/20 hover:border-primary/50'
              ]"
            >
              <div class="flex items-start gap-3">
                <div :class="[
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                  objective.completed
                    ? 'border-xp bg-xp/20'
                    : 'border-primary/30 bg-black/30'
                ]">
                  <span class="material-symbols-rounded text-lg" :class="objective.completed ? 'text-xp' : 'text-primary'">
                    {{ objective.completed ? 'check_circle' : objective.icon }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p :class="['font-semibold text-sm mb-1', objective.completed ? 'text-white' : 'text-white/90']">
                    {{ objective.title }}
                  </p>
                  <div v-if="objective.progress !== null && !objective.completed" class="mt-2">
                    <div class="flex items-center justify-between text-xs mb-1">
                      <span class="text-white/60">Progresso</span>
                      <span class="text-primary font-semibold">{{ objective.progress }}%</span>
                    </div>
                    <div class="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full bg-gradient-to-r from-primary to-xp transition-all duration-300"
                        :style="{ width: `${Math.min(objective.progress, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                  <p v-else-if="objective.completed" class="text-xs text-xp font-semibold mt-1">
                    ✓ Concluído!
                  </p>
                  <p v-else class="text-xs text-white/60 mt-1">{{ objective.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
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

const streakImages = {
  1: new URL('../imagens/streak/streak1.png', import.meta.url).href,
  2: new URL('../imagens/streak/streak2.png', import.meta.url).href,
  3: new URL('../imagens/streak/streak3.png', import.meta.url).href
}

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

function resolveStreakLevel(days) {
  if (days >= 8) return 3
  if (days >= 4) return 2
  if (days >= 1) return 1
  return 0
}

const maxStreakImage = computed(() => {
  const level = resolveStreakLevel(maxStreak.value)
  return level ? streakImages[level] : null
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

function progressForToday(habit) {
  if (!habit) return 0
  if (!habit.progressLog || typeof habit.progressLog !== 'object') return 0
  return habit.progressLog[today] || 0
}

function goalForHabit(habit) {
  if (!habit) return 1
  const value = parseInt(habit.goalCount, 10)
  return Number.isNaN(value) || value < 1 ? 1 : value
}

const currentHabitProgress = computed(() => {
  const habit = currentHabit.value
  if (!habit) {
    return { goal: 1, progress: 0, remaining: 0 }
  }
  const goal = goalForHabit(habit)
  const completed = habit.completedDays.includes(today)
  const progress = completed ? goal : progressForToday(habit)
  const remaining = completed ? 0 : Math.max(goal - progress, 0)
  return { goal, progress, remaining }
})

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

// Recent Activities
const recentActivities = computed(() => {
  const activities = []
  const today = new Date()
  
  // Coletar atividades dos últimos 7 dias
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    habitStore.habits.forEach(habit => {
      if (habit.completedDays.includes(dateStr)) {
        const dateFormatted = date.toLocaleDateString('pt-PT', {
          day: 'numeric',
          month: 'short',
          ...(i === 0 ? {} : {})
        })
        
        activities.push({
          id: `${habit.id}-${dateStr}`,
          habitName: habit.name,
          category: habit.category,
          date: dateStr,
          dateFormatted: i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : dateFormatted,
          xp: 10
        })
      }
    })
  }
  
  // Ordenar por data (mais recente primeiro)
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
})

// Weekly Stats
const weeklyStats = computed(() => {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay()) // Domingo
  weekStart.setHours(0, 0, 0, 0)
  
  let completed = 0
  let xpGained = 0
  let bestStreak = 0
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    habitStore.habits.forEach(habit => {
      if (habit.completedDays.includes(dateStr)) {
        completed++
        xpGained += 10
      }
    })
  }
  
  // Melhor streak da semana
  habitStore.activeHabits.forEach(habit => {
    if (habit.streak > bestStreak) {
      bestStreak = habit.streak
    }
  })
  
  return { completed, xpGained, bestStreak }
})

// Next Objectives
const nextObjectives = computed(() => {
  const objectives = []
  const today = new Date().toISOString().split('T')[0]
  const completedToday = habitStore.activeHabits.filter(h => isCompletedToday(h.id)).length
  const totalActive = habitStore.activeHabits.length
  const currentStreak = maxStreak.value
  const currentLevel = userStore.level
  
  // Objetivo 1: Completar todos os hábitos hoje
  if (totalActive > 0) {
    const progress = Math.round((completedToday / totalActive) * 100)
    objectives.push({
      id: 'complete-all-today',
      title: `Completa todos os hábitos hoje`,
      description: `${completedToday}/${totalActive} completados`,
      icon: 'task_alt',
      progress: progress,
      completed: completedToday === totalActive && totalActive > 0
    })
  }
  
  // Objetivo 2: Atingir streak de 7 dias
  const streakTarget = 7
  const streakProgress = Math.round((currentStreak / streakTarget) * 100)
  objectives.push({
    id: 'streak-7',
    title: `Atinge streak de ${streakTarget} dias`,
    description: `${currentStreak}/${streakTarget} dias`,
    icon: 'local_fire_department',
    progress: Math.min(streakProgress, 100),
    completed: currentStreak >= streakTarget
  })
  
  // Objetivo 3: Subir de nível
  const xpInCurrentLevel = userStore.xp % 100
  const xpNeededForNextLevel = 100
  const xpProgress = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100)
  objectives.push({
    id: 'next-level',
    title: `Atinge nível ${currentLevel + 1}`,
    description: `${xpNeededForNextLevel - xpInCurrentLevel} XP restantes`,
    icon: 'trending_up',
    progress: Math.min(xpProgress, 100),
    completed: false
  })
  
  // Objetivo 4: Completar 5 hábitos num dia
  const dailyTarget = 5
  if (totalActive >= dailyTarget) {
    const dailyProgress = Math.round((completedToday / dailyTarget) * 100)
    objectives.push({
      id: 'daily-5',
      title: `Completa ${dailyTarget} hábitos num dia`,
      description: `${completedToday}/${dailyTarget} hoje`,
      icon: 'workspace_premium',
      progress: Math.min(dailyProgress, 100),
      completed: completedToday >= dailyTarget
    })
  }
  
  // Ordenar: completados primeiro, depois por progresso
  return objectives.sort((a, b) => {
    if (a.completed && !b.completed) return -1
    if (!a.completed && b.completed) return 1
    return (b.progress || 0) - (a.progress || 0)
  }).slice(0, 3)
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