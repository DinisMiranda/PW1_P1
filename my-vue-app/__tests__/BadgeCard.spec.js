import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BadgeCard from '../src/components/BadgeCard.vue'

/**
 * 1. Basic Rendering - 3 testes
 * Testa se o componente renderiza corretamente
 */
describe('BadgeCard - Basic Rendering', () => {
  it('renders the badge card with default props', () => {
    const wrapper = mount(BadgeCard)
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Badge')
    expect(wrapper.text()).toContain('Condição')
  })

  it('renders the badge card with custom title and description', () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Primeiro Passo',
        description: 'Completa o 1º hábito',
        icon: 'footprint'
      }
    })
    
    expect(wrapper.text()).toContain('Primeiro Passo')
    expect(wrapper.text()).toContain('Completa o 1º hábito')
  })

  it('renders the icon correctly', () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Test Badge',
        icon: 'star'
      }
    })
    
    const icon = wrapper.find('span.material-symbols-rounded')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('star')
  })
})

/**
 * 2. Interaction - 3 testes
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
    
    const card = wrapper.find('.border-2')
    expect(card.classes()).toContain('hover:border-primary')
    expect(card.classes()).not.toContain('opacity-40')
  })

  it('displays different styles for locked vs unlocked icon container', () => {
    const lockedWrapper = mount(BadgeCard, { props: { isLocked: true } })
    const unlockedWrapper = mount(BadgeCard, { props: { isLocked: false } })
    
    const lockedIcon = lockedWrapper.find('.mx-auto')
    const unlockedIcon = unlockedWrapper.find('.mx-auto')
    
    expect(lockedIcon.classes()).toContain('bg-black/50')
    expect(unlockedIcon.classes()).toContain('bg-primary/20')
  })
})

/**
 * 3. Prop Change - 3 testes
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
    
    let card = wrapper.find('.border-2')
    expect(card.classes()).not.toContain('opacity-40')
    
    await wrapper.setProps({ isLocked: true })
    
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
    
    await wrapper.setProps({ title: 'Novo Título' })
    
    expect(wrapper.text()).toContain('Novo Título')
    expect(wrapper.text()).not.toContain('Título Inicial')
  })

  it('updates description when prop changes', async () => {
    const wrapper = mount(BadgeCard, {
      props: {
        title: 'Test',
        description: 'Descrição Inicial'
      }
    })
    
    expect(wrapper.text()).toContain('Descrição Inicial')
    
    await wrapper.setProps({ description: 'Nova Descrição' })
    
    expect(wrapper.text()).toContain('Nova Descrição')
    expect(wrapper.text()).not.toContain('Descrição Inicial')
  })
})
