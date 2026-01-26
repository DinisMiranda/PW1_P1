import { get, post, put } from './client'

// Camada de conveniência para lidar com /users no JSON Server
function fetchUsers() {
  return get('/users')
}

function fetchUser(id) {
  return get(`/users/${id}`)
}

function createUser(userData) {
  return post('/users', userData)
}

function updateUser(id, userData) {
  return put(`/users/${id}`, userData)
}

export { fetchUsers, fetchUser, createUser, updateUser }
