export function basename(filePath) {
  if (typeof filePath !== 'string') return ''
  const normalized = filePath.replace(/\\/g, '/').split('/')
  return normalized[normalized.length - 1] || ''
}
