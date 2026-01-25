export const DIFFICULTY_XP_MAP = Object.freeze({
  easy: 5,
  medium: 10,
  hard: 20
})

const DEFAULT_LEVEL = 1
export const XP_BASE = 100
export const XP_STEP = 50

export function xpNeededForLevel(level = DEFAULT_LEVEL) {
  const safeLevel = Math.max(DEFAULT_LEVEL, level)
  return XP_BASE + (safeLevel - DEFAULT_LEVEL) * XP_STEP
}

export function getLevelState(totalXp = 0) {
  let level = DEFAULT_LEVEL
  let remainingXp = Math.max(0, totalXp)

  while (true) {
    const needed = xpNeededForLevel(level)
    if (remainingXp < needed) {
      return {
        level,
        xpIntoLevel: remainingXp,
        xpNeeded: needed
      }
    }
    remainingXp -= needed
    level += 1
  }
}
