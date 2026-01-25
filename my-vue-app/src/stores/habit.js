import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { fetchHabits } from '../api/habits'
import { DIFFICULTY_XP_MAP } from '../constants/progression'

export const useHabitStore = defineStore('habit', () => {
  const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]')
  const habits = ref((storedHabits || []).map((habit) => normalizeHabit(habit)))

  function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits.value))
  }

  async function loadHabits(userId) {
    const data = await fetchHabits(userId)
    habits.value = (data || []).map((habit) => normalizeHabit(habit))
    saveHabits()
  }

  function createHabit(habitData) {
    const newHabit = normalizeHabit({
      id: Date.now(),
      name: habitData.name,
      category: habitData.category || 'Geral',
      frequency: habitData.frequency || 'daily',
      goalCount: habitData.goalCount || 1,
      streak: 0,
      xpEarned: 0,
      completedDays: [],
      active: true,
      createdAt: new Date().toISOString(),
      difficulty: habitData.difficulty || 'medium',
      xpValue: habitData.xpValue,
      progressLog: {}
    })
    habits.value.push(newHabit)
    saveHabits()
    return newHabit
  }

  function updateHabit(id, updates) {
    const index = habits.value.findIndex(h => h.id === id)
    if (index !== -1) {
      habits.value[index] = normalizeHabit({ ...habits.value[index], ...updates })
      saveHabits()
      return habits.value[index]
    }
    return null
  }

  function deleteHabit(id) {
    const index = habits.value.findIndex(h => h.id === id)
    if (index !== -1) {
      habits.value.splice(index, 1)
      saveHabits()
      return true
    }
    return false
  }

  function toggleHabitDone(habitId, date = new Date().toISOString().split('T')[0]) {
    const habit = habits.value.find(h => h.id === habitId)
    if (!habit) return { status: 'error' }

    const dateStr = date
    const userStore = useUserStore()
    const xpGained = getHabitXpValue(habit)
    const goal = getGoalCount(habit)
    const currentProgress = getProgressForDate(habit, dateStr)
    const alreadyCompleted = habit.completedDays.includes(dateStr)

    if (alreadyCompleted) {
      habit.completedDays = habit.completedDays.filter(day => day !== dateStr)
      setProgressForDate(habit, dateStr, 0)
      habit.streak = calculateStreak(habit.completedDays)
      userStore.loseXP(xpGained)
      habit.xpEarned = Math.max(0, habit.xpEarned - xpGained)
      saveHabits()
      return { status: 'undone', progress: 0, remaining: goal }
    }

    const nextProgress = Math.min(goal, currentProgress + 1)

    if (nextProgress < goal) {
      setProgressForDate(habit, dateStr, nextProgress)
      saveHabits()
      return { status: 'in-progress', progress: nextProgress, remaining: goal - nextProgress }
    }

    setProgressForDate(habit, dateStr, goal)
    habit.completedDays.push(dateStr)
    habit.streak = calculateStreak(habit.completedDays)

    const oldLevel = userStore.level
    userStore.gainXP(xpGained)
    habit.xpEarned += xpGained

    if (userStore.level > oldLevel) {
      import('./character.js').then(({ useCharacterStore }) => {
        const characterStore = useCharacterStore()
        if (characterStore.characterType) {
          for (let i = oldLevel; i < userStore.level; i++) {
            characterStore.levelUp()
          }
        }
      }).catch(() => {
        // Character store pode não estar inicializado
      })
    }

    saveHabits()
    return { status: 'completed', progress: goal, remaining: 0 }
  }

  function calculateStreak(completedDays) {
    if (completedDays.length === 0) return 0

    const sorted = [...completedDays].sort().reverse()
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayStr = today.toISOString().split('T')[0]
    if (!sorted.includes(todayStr)) {
      today.setDate(today.getDate() - 1)
    }

    for (let i = 0; i < sorted.length; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const checkDateStr = checkDate.toISOString().split('T')[0]

      if (sorted.includes(checkDateStr)) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const activeHabits = computed(() => habits.value.filter(h => h.active))
  const totalHabits = computed(() => habits.value.length)

  return {
    habits,
    activeHabits,
    totalHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDone,
    loadHabits
  }
})

const HABIT_DIFFICULTY_PRESETS = {
  'beber água': 'easy',
  meditar: 'medium',
  'ler 30 minutos': 'hard',
  exercitar: 'hard',
  alongar: 'easy',
  'escrever um diário': 'medium',
  'planejar o dia': 'medium',
  'rever objetivos': 'hard',
  'caminhar 10k passos': 'medium',
  'dormir 8 horas': 'medium',
  'limpeza expressa': 'easy',
  'café da manhã saudável': 'easy',
  'revisar finanças': 'medium',
  'estudar um idioma': 'hard',
  'desconectar da tela': 'medium',
  'organizar tarefas': 'medium',
  'praticar gratidão': 'easy'
}

function inferDifficultyFromName(name = '') {
  const key = name.trim().toLowerCase()
  return HABIT_DIFFICULTY_PRESETS[key] || null
}

function getHabitXpValue(habit) {
  if (!habit) return 0
  return habit.xpValue ?? DIFFICULTY_XP_MAP[habit.difficulty] ?? DIFFICULTY_XP_MAP.medium
}

function normalizeHabit(habit = {}) {
  const difficulty = habit.difficulty || inferDifficultyFromName(habit.name) || 'medium'
  const xpValue = habit.xpValue ?? DIFFICULTY_XP_MAP[difficulty] ?? DIFFICULTY_XP_MAP.medium
  const progressLog = typeof habit.progressLog === 'object' && habit.progressLog !== null ? { ...habit.progressLog } : {}

  return {
    id: habit.id ?? Date.now(),
    name: habit.name || 'Novo hábito',
    category: habit.category || 'Geral',
    frequency: habit.frequency || 'daily',
    goalCount: habit.goalCount ?? 1,
    streak: habit.streak ?? 0,
    xpEarned: habit.xpEarned ?? 0,
    completedDays: Array.isArray(habit.completedDays) ? habit.completedDays : [],
    active: habit.active !== false,
    createdAt: habit.createdAt || new Date().toISOString(),
    difficulty,
    xpValue,
    progressLog
  }
}

function getProgressForDate(habit, date) {
  if (!habit.progressLog || typeof habit.progressLog !== 'object') {
    habit.progressLog = {}
  }
  return habit.progressLog[date] || 0
}

function setProgressForDate(habit, date, count) {
  if (!habit.progressLog || typeof habit.progressLog !== 'object') {
    habit.progressLog = {}
  }
  if (count <= 0) {
    delete habit.progressLog[date]
  } else {
    habit.progressLog[date] = count
  }
}

function getGoalCount(habit) {
  const goal = parseInt(habit.goalCount, 10)
  return Number.isNaN(goal) || goal < 1 ? 1 : goal
}

