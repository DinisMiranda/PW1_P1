import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HabitCard from '../src/components/HabitCard.vue'

/**
 * Exemplo adicional: Teste de componente com mais interações
 */
describe('HabitCard', () => {
  it('renders habit information correctly', () => {
    const wrapper = mount(HabitCard, {
      props: {
        title: 'Exercitar-se',
        subtitle: 'Saúde',
        frequency: 'Diário',
        color: 'emerald'
      }
    })

    expect(wrapper.text()).toContain('Exercitar-se')
    expect(wrapper.text()).toContain('Saúde')
    expect(wrapper.text()).toContain('Diário')
    expect(wrapper.text()).toContain('Registar')
    expect(wrapper.text()).toContain('Editar')
  })

  it('applies correct badge color class based on color prop', () => {
    const wrapper = mount(HabitCard, {
      props: {
        title: 'Test',
        color: 'indigo'
      }
    })

    const badge = wrapper.find('span')
    expect(badge.classes()).toContain('bg-neonPurple/20')
  })

  it('uses default props when not provided', () => {
    const wrapper = mount(HabitCard)

    expect(wrapper.text()).toContain('Hábito')
    expect(wrapper.text()).toContain('Descrição')
    expect(wrapper.text()).toContain('Diário')
  })

  it('has two buttons (Registar and Editar)', () => {
    const wrapper = mount(HabitCard)

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toContain('Registar')
    expect(buttons[1].text()).toContain('Editar')
  })
})
