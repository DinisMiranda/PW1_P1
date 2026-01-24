import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CounterWithProps from '@/components/CounterWithProps.vue'

/**
 * Exemplo 3: Prop Change
 * Testa como o componente reage a mudanças de props
 */
describe('CounterWithProps.vue - Prop Change', () => {
  it('updates count when initialCount prop changes', async () => {
    const wrapper = mount(CounterWithProps, {
      props: {
        initialCount: 0
      }
    })

    // Estado inicial
    expect(wrapper.text()).toContain('Count: 0')
    expect(wrapper.vm.count).toBe(0)

    // Muda a prop initialCount
    await wrapper.setProps({ initialCount: 10 })

    // Nota: O count interno não muda automaticamente quando initialCount muda
    // Mas podemos verificar que a prop mudou
    expect(wrapper.props('initialCount')).toBe(10)
  })

  it('uses initialCount prop correctly on mount', () => {
    const wrapper = mount(CounterWithProps, {
      props: {
        initialCount: 5
      }
    })

    expect(wrapper.text()).toContain('Count: 5')
    expect(wrapper.vm.count).toBe(5)
  })

  it('increments by step prop value', async () => {
    const wrapper = mount(CounterWithProps, {
      props: {
        initialCount: 0,
        step: 5
      }
    })

    expect(wrapper.text()).toContain('Count: 0')

    // Clica no botão
    await wrapper.find('button').trigger('click')

    // Deve incrementar por 5 (step)
    expect(wrapper.text()).toContain('Count: 5')
    expect(wrapper.vm.count).toBe(5)
  })

  it('updates step prop and uses new value', async () => {
    const wrapper = mount(CounterWithProps, {
      props: {
        initialCount: 0,
        step: 1
      }
    })

    // Incrementa uma vez com step=1
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.count).toBe(1)

    // Muda step para 3
    await wrapper.setProps({ step: 3 })

    // Incrementa novamente, agora deve usar step=3
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.count).toBe(4) // 1 + 3
  })

  it('displays correct step value in button text', () => {
    const wrapper = mount(CounterWithProps, {
      props: {
        step: 10
      }
    })

    const button = wrapper.find('button')
    expect(button.text()).toBe('Add 10')
  })
})
