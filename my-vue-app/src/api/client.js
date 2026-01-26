// API client para JSON Server
// Para iniciar: json-server --watch db.json --port 3000

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Wrapper genérico em torno do fetch para falar com o JSON Server
async function request(endpoint, { method = 'GET', body = null, params = null } = {}) {
  const url = new URL(endpoint, BASE_URL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })
  }

  const config = { method }

  if (body) {
    config.headers = { 'Content-Type': 'application/json' }
    config.body = JSON.stringify(body)
  }

  const response = await fetch(url.toString(), config)

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  // DELETE normalmente nao traz corpo
  if (method.toUpperCase() === 'DELETE' || response.status === 204) {
    return true
  }

  return response.json()
}

// Helpers semânticos por método HTTP
function get(endpoint, params) {
  return request(endpoint, { method: 'GET', params })
}

function post(endpoint, body) {
  return request(endpoint, { method: 'POST', body })
}

function put(endpoint, body) {
  return request(endpoint, { method: 'PUT', body })
}

function patch(endpoint, body) {
  return request(endpoint, { method: 'PATCH', body })
}

function del(endpoint) {
  return request(endpoint, { method: 'DELETE' })
}

export { BASE_URL, request, get, post, put, patch, del }
