# Guia de Testing - Vitest com Vue.js

## 📚 Introdução

Este guia explica como configurar e usar **Vitest** para testar componentes Vue.js no teu projeto.

### O que é Vitest?
- **Vitest** é um framework de testes nativo do Vite
- Fornece utilitários para testar componentes Vue.js
- Permite montar e interagir com componentes Vue
- Link: https://vitest.dev

---

## 🧪 Tipos de Testes

### 1. **Unit Tests** (Testes Unitários)
- Testam funções ou classes isoladamente
- Verificam se inputs produzem outputs esperados
- Mais rápidos e simples

### 2. **Component Tests** (Testes de Componentes)
- Testam componentes Vue completos
- Verificam renderização, interações e comportamento
- Mais complexos que unit tests
- Importam mais código

### 3. **End-to-End Tests** (Testes E2E)
- Testam fluxos completos da aplicação
- Fazem requisições reais de rede
- Podem precisar de base de dados ou backend
- Mais lentos e complexos

---

## ⚙️ Configuração

### Passo 1: Instalar Dependências

```bash
npm install -D vitest @vue/test-utils jsdom
```

**Dependências:**
- `vitest`: Framework de testes
- `@vue/test-utils`: Utilitários para testar Vue
- `jsdom`: Ambiente DOM para testes

### Passo 2: Configurar Vitest

O ficheiro `vite.config.js` já está configurado:

```javascript
export default defineConfig({
  // ... outras configurações
  test: {
    globals: true,        // Permite usar describe, it, expect sem importar
    environment: 'jsdom', // Ambiente DOM para testes
  },
})
```

### Passo 3: Adicionar Script no package.json

```json
{
  "scripts": {
    "test:unit": "vitest"
  }
}
```

### Passo 4: Criar Pasta de Testes

Criar a pasta `__tests__` na raiz do projeto.

---

## 🚀 Executar Testes

```bash
npm run test:unit
```

**Modos de execução:**
- `npm run test:unit` - Executa todos os testes
- `npm run test:unit -- --watch` - Modo watch (re-executa ao mudar ficheiros)
- `npm run test:unit -- --ui` - Interface gráfica

---

## 📝 Exemplos de Testes

### Exemplo 1: Basic Rendering (Renderização Básica)

Testa se o componente renderiza corretamente:

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BadgeCard from '../src/components/BadgeCard.vue'

describe('BadgeCard - Basic Rendering', () => {
  it('renders the badge card with default props', () => {
    const wrapper = mount(BadgeCard)
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Badge')
  })
})
```

**O que faz:**
- `mount()`: Monta o componente
- `wrapper.exists()`: Verifica se o componente existe
- `wrapper.text()`: Obtém o texto renderizado

---

### Exemplo 2: Interaction (Interação)

Testa interações do utilizador:

```javascript
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
})
```

**O que faz:**
- Passa props para o componente
- Verifica classes CSS aplicadas
- Testa estados visuais

---

### Exemplo 3: Prop Change (Mudança de Props)

Testa como o componente reage a mudanças:

```javascript
describe('BadgeCard - Prop Change', () => {
  it('updates when isLocked prop changes', async () => {
    const wrapper = mount(BadgeCard, {
      props: {
        isLocked: false
      }
    })
    
    // Estado inicial
    let card = wrapper.find('.border-2')
    expect(card.classes()).not.toContain('opacity-40')
    
    // Muda a prop
    await wrapper.setProps({ isLocked: true })
    
    // Verifica mudança
    card = wrapper.find('.border-2')
    expect(card.classes()).toContain('opacity-40')
  })
})
```

**O que faz:**
- `setProps()`: Muda props dinamicamente
- `await`: Aguarda atualização do Vue
- Verifica reatividade do componente

---

### Exemplo 4: Component Rendering Based on Route

Testa renderização baseada em rotas:

```javascript
import { createRouter, createWebHistory } from 'vue-router'

describe('Router - Component Rendering Based on Route', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: Dashboard },
        { path: '/login', component: Login }
      ]
    })
  })

  it('renders Dashboard when route is /', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent(Dashboard).exists()).toBe(true)
  })
})
```

**O que faz:**
- Cria router de teste
- Navega para rotas
- Verifica componente renderizado

---

## 🎯 Conceitos Principais

### 1. **mount() vs shallowMount()**
- `mount()`: Monta componente completo (inclui filhos)
- `shallowMount()`: Monta apenas o componente (stubs filhos)

### 2. **Wrapper Methods**
- `wrapper.text()`: Texto renderizado
- `wrapper.html()`: HTML renderizado
- `wrapper.find()`: Encontra elemento
- `wrapper.findAll()`: Encontra todos os elementos
- `wrapper.trigger()`: Dispara evento
- `wrapper.setProps()`: Muda props
- `wrapper.emitted()`: Verifica eventos emitidos

### 3. **Matchers (Expect)**
- `toBe()`: Igualdade estrita (===)
- `toEqual()`: Igualdade profunda
- `toContain()`: Contém valor
- `toBeTruthy()`: É verdadeiro
- `toBeFalsy()`: É falso
- `toHaveClass()`: Tem classe CSS

### 4. **Testando com Pinia**
```javascript
import { createPinia, setActivePinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia())
})

it('uses store', () => {
  const store = useUserStore()
  store.level = 5
  
  const wrapper = mount(Component)
  expect(wrapper.text()).toContain('5')
})
```

---

## 📁 Estrutura de Ficheiros

```
my-vue-app/
├── __tests__/              # Pasta de testes
│   ├── BadgeCard.spec.js   # Teste do BadgeCard
│   ├── LevelIndicator.spec.js
│   ├── Router.spec.js
│   └── HabitCard.spec.js
├── src/
│   └── components/
│       └── BadgeCard.vue
└── vite.config.js          # Configuração do Vitest
```

**Convenção de nomes:**
- Ficheiros de teste: `*.spec.js` ou `*.test.js`
- Pasta: `__tests__` ou `tests`

---

## ✅ Boas Práticas

1. **Um teste, uma coisa**: Cada teste deve verificar uma funcionalidade
2. **Nomes descritivos**: `it('should render title when prop is provided')`
3. **Arrange-Act-Assert**: Organiza o teste em 3 partes
4. **Isolamento**: Cada teste deve ser independente
5. **Limpeza**: Use `beforeEach` e `afterEach` para setup/cleanup

### Exemplo de estrutura AAA:
```javascript
it('should update level when XP increases', async () => {
  // Arrange (Preparar)
  const store = useUserStore()
  store.xp = 0
  store.level = 1
  
  // Act (Ação)
  store.gainXP(100)
  
  // Assert (Verificar)
  expect(store.level).toBe(2)
})
```

---

## 🐛 Debugging

### Ver output do componente:
```javascript
console.log(wrapper.html())
console.log(wrapper.text())
```

### Ver eventos emitidos:
```javascript
console.log(wrapper.emitted())
```

### Modo watch:
```bash
npm run test:unit -- --watch
```

---

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Vue.js Applications](https://vuejs.org/guide/scaling-up/testing.html)

---

## 🎓 Exercícios Práticos

1. **Criar teste para HabitCard**
   - Testar renderização
   - Testar clique no botão
   - Testar mudança de props

2. **Criar teste para Dashboard**
   - Testar renderização
   - Testar com store vazio
   - Testar com dados

3. **Criar teste para Login**
   - Testar formulário
   - Testar validação
   - Testar submissão

---

**Última atualização**: 2025
**Autor**: Guia baseado no PowerPoint M05 - Testing
