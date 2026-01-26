import { get, post, put, del } from './client'

// Endpoints REST relacionados com hábitos no JSON Server
function fetchHabits(userId) {
  return get('/habits', userId ? { userId } : undefined)
}

function fetchHabit(id) {
  return get(`/habits/${id}`)
}

function createHabit(habitData) {
  return post('/habits', habitData)
}

function updateHabit(id, habitData) {
  return put(`/habits/${id}`, habitData)
}

function deleteHabit(id) {
  return del(`/habits/${id}`)
}

export { fetchHabits, fetchHabit, createHabit, updateHabit, deleteHabit }
