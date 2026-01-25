<template>
  <div>
    <h2 class="mb-6 text-2xl font-bold font-solo text-white uppercase tracking-wider">Estatísticas</h2>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- XP Stats -->
      <div class="border-2 border-primary/50 bg-card-solo p-6 hover:border-primary hover:glow-cyan transition-all">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Progresso de XP</h3>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-white/70 font-semibold">XP Total</span>
            <span class="font-bold font-solo text-white text-glow">{{ userStore.xp }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-white/70 font-semibold">Nível Atual</span>
            <span class="font-bold font-solo text-white text-glow">{{ userStore.level }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-white/70 font-semibold">XP para próximo nível</span>
            <span class="font-bold font-solo text-white text-glow">{{ userStore.xpRemainingToNextLevel }}</span>
          </div>
        </div>
      </div>

      <!-- Habits Stats -->
      <div class="border-2 border-primary/50 bg-card-solo p-6 hover:border-primary hover:glow-cyan transition-all">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Hábitos</h3>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-white/70 font-semibold">Total de hábitos</span>
            <span class="font-bold font-solo text-white text-glow">{{ habitStore.totalHabits }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-white/70 font-semibold">Hábitos ativos</span>
            <span class="font-bold font-solo text-white text-glow">{{ habitStore.activeHabits.length }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-white/70 font-semibold">Streak máximo</span>
            <span class="font-bold font-solo text-white text-glow">{{ maxStreak }} dias</span>
          </div>
        </div>
      </div>

      <!-- Completion Rate -->
      <div class="border-2 border-primary/50 bg-card-solo p-6 hover:border-primary hover:glow-cyan transition-all">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Taxa de Conclusão</h3>
        <div class="text-center">
          <div class="text-5xl font-bold font-solo text-white text-glow">{{ completionRate }}%</div>
          <p class="mt-2 text-sm text-white/70 font-semibold">Esta semana</p>
        </div>
      </div>

      <!-- Top Habits -->
      <div class="border-2 border-primary/50 bg-card-solo p-6 hover:border-primary hover:glow-cyan transition-all">
        <h3 class="mb-4 font-bold font-solo text-primary uppercase tracking-wider">Hábitos com maior streak</h3>
        <div class="space-y-2">
          <div
            v-for="habit in topHabits"
            :key="habit.id"
            class="flex items-center justify-between border-2 border-primary/30 bg-black/30 p-3 hover:border-primary/50 transition-all"
          >
            <span class="text-sm text-white font-semibold">{{ habit.name }}</span>
            <span class="text-sm font-bold font-solo text-primary text-glow">{{ habit.streak }} dias</span>
          </div>
          <p v-if="topHabits.length === 0" class="text-sm text-white/60">Nenhum hábito ainda</p>
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

