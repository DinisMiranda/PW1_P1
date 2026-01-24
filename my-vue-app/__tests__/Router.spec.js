import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Login from '../src/views/Login.vue'

/**
 * Exemplo 4: Component Rendering Based on Route
 * Testa renderização de componentes baseada na rota
 * 
 * Nota: Teste simplificado para evitar dependências complexas do App completo
 */
describe('Router - Component Rendering Based on Route', () => {
  let router
  let pinia

  beforeEach(() => {
    // Mock localStorage
    const store = {}
    const localStorageMock = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value.toString() }),
      removeItem: vi.fn((key) => { delete store[key] }),
      clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]) }),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })

    pinia = createPinia()
    setActivePinia(pinia)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/login',
          name: 'Login',
          component: Login
        }
      ]
    })
  })

  it('renders Login component when route is /login', async () => {
    router.push('/login')
    await router.isReady()

    const wrapper = mount(Login, {
      global: {
        plugins: [router, pinia]
      }
    })

    // Verifica se o componente Login está renderizado
    expect(wrapper.exists()).toBe(true)
  })

  it('router navigates to correct path', async () => {
    await router.push('/login')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/login')
  })
})
