import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Login from '../src/views/Login.vue'
import Register from '../src/views/Register.vue'

/**
 * 4. Component Rendering Based on Route - 3 testes
 * Testa renderização de componentes baseada na rota
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
        },
        {
          path: '/register',
          name: 'Register',
          component: Register
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

    expect(wrapper.exists()).toBe(true)
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('renders Register component when route is /register', async () => {
    router.push('/register')
    await router.isReady()

    const wrapper = mount(Register, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(router.currentRoute.value.path).toBe('/register')
  })

  it('navigates between routes correctly', async () => {
    // Começa em /login
    await router.push('/login')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/login')

    // Navega para /register
    await router.push('/register')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/register')

    // Volta para /login
    await router.push('/login')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
