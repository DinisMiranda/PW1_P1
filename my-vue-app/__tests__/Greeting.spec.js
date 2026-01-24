import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Greeting from '@/components/Greeting.vue'

/**
 * Exemplo 1: Basic Rendering
 * Testa se o componente renderiza corretamente a mensagem de saudação
 */
describe('Greeting.vue', () => {
  it('renders greeting message correctly', () => {
    const wrapper = mount(Greeting)
    expect(wrapper.text()).toBe('Hello, World!')
  })

  it('renders the h1 element with greeting', () => {
    const wrapper = mount(Greeting)
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Hello, World!')
  })

  it('displays the correct initial greeting value', () => {
    const wrapper = mount(Greeting)
    expect(wrapper.vm.greeting).toBe('Hello, World!')
    expect(wrapper.text()).toContain('Hello, World!')
  })
})
