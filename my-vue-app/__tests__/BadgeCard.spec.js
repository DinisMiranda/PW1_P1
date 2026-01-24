import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BadgeCard from '../src/components/BadgeCard.vue'

/**
 * Exemplo 1: Basic Rendering
 * Testa se o componente renderiza corretamente com as props básicas
 */
describe('BadgeCard - Basic Rendering', () => {
  it('renders the badge card with default props', () => {
    const wrapper = mount(BadgeCard)
    
    // Verifica se o componente foi montado
    expect(wrapper.exists()).toBe(true)
    
    // Verifica se o título padrão é renderizado
    expect(wrapper.text()).toContain('Badge')
  })

  it('renders the badge card with custom title and description', () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Primeiro Passo',
        description: 'Completa o 1º hábito',
        icon: 'footprint'
      }
    })
    
    // Verifica se o título customizado é renderizado
    expect(wrapper.text()).toContain('Primeiro Passo')
    expect(wrapper.text()).toContain('Completa o 1º hábito')
  })
})

/**
 * Exemplo 2: Interaction
 * Testa interações do utilizador com o componente
 */
describe('BadgeCard - Interaction', () => {
  it('shows locked state when isLocked is true', () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Badge Bloqueada',
        isLocked: true
      }
    })
    
    // Verifica se a classe de opacity está presente quando bloqueada
    const card = wrapper.find('.border-2')
    expect(card.classes()).toContain('opacity-40')
  })

  it('shows unlocked state when isLocked is false', () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Badge Desbloqueada',
        isLocked: false
      }
    })
    
    // Verifica se a classe de hover está presente quando desbloqueada
    const card = wrapper.find('.border-2')
    expect(card.classes()).toContain('hover:border-primary')
  })
})

/**
 * Exemplo 3: Prop Change
 * Testa como o componente reage a mudanças de props
 */
describe('BadgeCard - Prop Change', () => {
  it('updates when isLocked prop changes', async () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Test Badge',
        isLocked: false
      }
    })
    
    // Estado inicial: desbloqueada
    let card = wrapper.find('.border-2')
    expect(card.classes()).not.toContain('opacity-40')
    
    // Muda a prop para bloqueada
    await wrapper.setProps({ isLocked: true })
    
    // Verifica se o estado mudou
    card = wrapper.find('.border-2')
    expect(card.classes()).toContain('opacity-40')
  })

  it('updates title when prop changes', async () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Título Inicial'
      }
    })
    
    expect(wrapper.text()).toContain('Título Inicial')
    
    // Muda o título
    await wrapper.setProps({ title: 'Novo Título' })
    
    expect(wrapper.text()).toContain('Novo Título')
    expect(wrapper.text()).not.toContain('Título Inicial')
  })
})
