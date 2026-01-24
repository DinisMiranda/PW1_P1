import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonCounter from '@/components/ButtonCounter.vue'

/**
 * Exemplo 2: Interaction
 * Testa interações do utilizador (cliques no botão)
 */
describe('ButtonCounter.vue', () => {
  it('increments count when button is clicked', async () => {
    const wrapper = mount(ButtonCounter)
    
    // Verifica estado inicial
    expect(wrapper.text()).toContain('0')
    
    // Simula clique no botão
    await wrapper.find('button').trigger('click')
    
    // Verifica se o contador incrementou
    expect(wrapper.text()).toContain('1')
  })

  it('displays initial count of 0', () => {
    const wrapper = mount(ButtonCounter)
    expect(wrapper.text()).toContain('0')
    expect(wrapper.vm.count).toBe(0)
  })

  it('increments multiple times correctly', async () => {
    const wrapper = mount(ButtonCounter)
    const button = wrapper.find('button')
    
    // Clica 3 vezes
    await button.trigger('click')
    await button.trigger('click')
    await button.trigger('click')
    
    // Verifica se o contador está em 3
    expect(wrapper.text()).toContain('3')
    expect(wrapper.vm.count).toBe(3)
  })

  it('renders button with correct text', () => {
    const wrapper = mount(ButtonCounter)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Increment')
  })
})
