<template>
  <div>
    <h2 class="mb-6 text-2xl font-semibold font-display">Estatísticas</h2>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- XP Stats -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 class="mb-4 font-semibold">Progresso de XP</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>XP Total</span>
            <span class="font-semibold">{{ userStore.xp }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Nível Atual</span>
            <span class="font-semibold">{{ userStore.level }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>XP para próximo nível</span>
            <span class="font-semibold">{{ userStore.xpForNextLevel - (userStore.xp % 100) }}</span>
          </div>
        </div>
      </div>

      <!-- Habits Stats -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 class="mb-4 font-semibold">Hábitos</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Total de hábitos</span>
            <span class="font-semibold">{{ habitStore.totalHabits }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Hábitos ativos</span>
            <span class="font-semibold">{{ habitStore.activeHabits.length }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Streak máximo</span>
            <span class="font-semibold">{{ maxStreak }} dias</span>
          </div>
        </div>
      </div>

      <!-- Completion Rate -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 class="mb-4 font-semibold">Taxa de Conclusão</h3>
        <div class="text-center">
          <div class="text-4xl font-bold text-primary">{{ completionRate }}%</div>
          <p class="mt-2 text-sm text-slate-500">Esta semana</p>
        </div>
      </div>

      <!-- Top Habits -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 class="mb-4 font-semibold">Hábitos com maior streak</h3>
        <div class="space-y-2">
          <div
            v-for="habit in topHabits"
            :key="habit.id"
            class="flex items-center justify-between rounded-lg bg-slate-50 p-2"
          >
            <span class="text-sm">{{ habit.name }}</span>
            <span class="text-sm font-semibold text-primary">{{ habit.streak }} dias</span>
          </div>
          <p v-if="topHabits.length === 0" class="text-sm text-slate-500">Nenhum hábito ainda</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHabitStore } from '../stores/habit'
import { useUserStore } from '../stores/user'

const habitStore = useHabitStore()
const userStore = useUserStore()

const maxStreak = computed(() => {
  if (habitStore.activeHabits.length === 0) return 0
  return Math.max(...habitStore.activeHabits.map(h => h.streak))
})

const completionRate = computed(() => {
  if (habitStore.activeHabits.length === 0) return 0
  const today = new Date().toISOString().split('T')[0]
  const completed = habitStore.activeHabits.filter(h => h.completedDays.includes(today)).length
  return Math.round((completed / habitStore.activeHabits.length) * 100)
})

const topHabits = computed(() => {
  return [...habitStore.activeHabits]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)
})
</script>

<style scoped></style>

