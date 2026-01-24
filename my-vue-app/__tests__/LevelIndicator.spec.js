import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LevelIndicator from '../src/components/LevelIndicator.vue'
import { useUserStore } from '../src/stores/user'

/**
 * Exemplo: Component with Pinia Store
 * Testa componente que usa Pinia store
 */
describe('LevelIndicator', () => {
  beforeEach(() => {
    // Mock localStorage para jsdom antes de criar o Pinia
    const store = {}
    const localStorageMock = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString()
      }),
      removeItem: vi.fn((key) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
    }
    
    // Define localStorage no global antes de criar o store
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    // Cria uma nova instância do Pinia para cada teste
    setActivePinia(createPinia())
  })

  it('renders the level from user store', () => {
    const userStore = useUserStore()
    // Define valores iniciais
    userStore.xp = 0
    userStore.level = 5
    userStore.badges = []
    userStore.streak = 0
    
    const wrapper = mount(LevelIndicator)
    
    expect(wrapper.text()).toContain('Nível')
    expect(wrapper.text()).toContain('5')
  })

  it('updates when level changes in store', async () => {
    const userStore = useUserStore()
    // Define valores iniciais
    userStore.xp = 0
    userStore.level = 1
    userStore.badges = []
    userStore.streak = 0
    
    const wrapper = mount(LevelIndicator)
    expect(wrapper.text()).toContain('1')
    
    // Atualiza o nível no store
    userStore.level = 10
    
    // Aguarda o próximo tick para o Vue atualizar
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('10')
  })
})
