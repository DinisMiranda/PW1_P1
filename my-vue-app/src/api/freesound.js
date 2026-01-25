const FREESOUND_BASE_URL = 'https://freesound.org/apiv2/'
const DEFAULT_FREESOUND_KEY = 'yRWGJSzwwYuSMymKS5VYfK0aVTLDviUSPpVgVT1G'

function getApiKey() {
  const key = import.meta.env.VITE_FREESOUND_API_KEY || DEFAULT_FREESOUND_KEY
  if (!key) {
    throw new Error('Missing Freesound API key. Please set VITE_FREESOUND_API_KEY.')
  }
  return key
}

function buildUrl(path, params) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(normalizedPath, FREESOUND_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(name, value)
      }
    })
  }
  return url
}

async function freesoundRequest(path, params) {
  const url = buildUrl(path, {
    ...(params || {}),
    token: getApiKey()
  })

  const response = await fetch(url.toString())

  if (!response.ok) {
    const errorMessage = `Freesound error ${response.status}`
    throw new Error(errorMessage)
  }

  return response.json()
}

function getSoundDetails(soundId) {
  return freesoundRequest(`/sounds/${soundId}/`)
}

function searchSounds(query, { page = 1, pageSize = 15 } = {}) {
  if (!query) {
    throw new Error('Query is required to search Freesound sounds.')
  }
  return freesoundRequest('/search/text/', {
    query,
    page,
    page_size: pageSize
  })
}

function findBestPreviewUrl(previews) {
  if (!previews) return null
  const preferredOrder = [
    'preview-hq-mp3',
    'preview-hq-ogg',
    'preview-lq-mp3',
    'preview-lq-ogg'
  ]

  for (const key of preferredOrder) {
    if (previews[key]) {
      return previews[key]
    }
  }
  return null
}

export {
  FREESOUND_BASE_URL,
  getSoundDetails,
  searchSounds,
  findBestPreviewUrl
}
