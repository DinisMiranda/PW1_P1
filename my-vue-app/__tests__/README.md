# Testes - Componentes do Projeto

Este diretório contém os testes para os componentes reais do projeto, baseados nos conceitos do PowerPoint **M05 – Testing**.

## 📋 Estrutura dos Testes

Todos os testes seguem os **4 tipos principais** do PowerPoint, com **exatamente 3 testes de cada tipo**:

- ✅ **Basic Rendering** - 3 testes
- ✅ **Interaction** - 3 testes
- ✅ **Prop Change** - 3 testes
- ✅ **Component Rendering Based on Route** - 3 testes

**Total: 12 testes**

---

## 📁 Ficheiros de Teste

### BadgeCard.spec.js (9 testes)
Testa o componente `BadgeCard.vue` com os 3 primeiros tipos de testes:

#### 1. Basic Rendering (3 testes)
- Renderiza com props padrão
- Renderiza com props customizadas
- Renderiza o ícone corretamente

#### 2. Interaction (3 testes)
- Mostra estado locked quando `isLocked` é `true`
- Mostra estado unlocked quando `isLocked` é `false`
- Aplica estilos diferentes para locked vs unlocked

#### 3. Prop Change (3 testes)
- Atualiza quando `isLocked` muda
- Atualiza quando `title` muda
- Atualiza quando `description` muda

### Router.spec.js (3 testes)
Testa renderização baseada em rotas:

#### 4. Component Rendering Based on Route (3 testes)
- Renderiza componente Login quando rota é `/login`
- Renderiza componente Register quando rota é `/register`
- Navega corretamente entre rotas

---

## 📋 O Que os Testes Avaliam?

### 1. **Basic Rendering** (Renderização Básica)
**O que avalia:** Se o componente renderiza corretamente no DOM

**Exemplos:**
- ✅ O componente aparece na página?
- ✅ O texto correto é exibido?
- ✅ Os elementos HTML estão presentes?

**Testes:**
- `BadgeCard.spec.js` - Verifica renderização com props padrão e customizadas

---

### 2. **Interaction** (Interação do Utilizador)
**O que avalia:** Se o componente reage corretamente a ações do utilizador

**Exemplos:**
- ✅ O que acontece quando clico num botão?
- ✅ O estado muda quando interajo?
- ✅ Os eventos são disparados corretamente?

**Testes:**
- `BadgeCard.spec.js` - Verifica mudança de estado (locked/unlocked) baseado em props

---

### 3. **Prop Change** (Mudança de Props)
**O que avalia:** Se o componente atualiza quando as props mudam

**Exemplos:**
- ✅ O componente reage a mudanças de props?
- ✅ A UI atualiza quando passo novas props?
- ✅ Os valores padrão funcionam?

**Testes:**
- `BadgeCard.spec.js` - Verifica mudança de `isLocked`, `title` e `description`

---

### 4. **Component Rendering Based on Route** (Renderização por Rota)
**O que avalia:** Se os componentes corretos são renderizados para cada rota

**Exemplos:**
- ✅ A rota `/login` mostra o componente Login?
- ✅ A navegação entre rotas funciona?
- ✅ O router está configurado corretamente?

**Testes:**
- `Router.spec.js` - Verifica renderização baseada em rotas

---

## 🚀 Como Executar

```bash
# Executar todos os testes
npm run test:unit

# Executar em modo watch (re-executa ao mudar ficheiros)
npm run test:unit -- --watch

# Executar um ficheiro específico
npm run test:unit -- BadgeCard.spec.js
npm run test:unit -- Router.spec.js

# Interface gráfica
npm run test:unit -- --ui
```

---

## 📊 Resultado Atual

```
✓ Test Files  2 passed (2)
✓ Tests  12 passed (12)
```

**Distribuição dos Testes:**
- ✅ Basic Rendering: 3 testes (BadgeCard)
- ✅ Interaction: 3 testes (BadgeCard)
- ✅ Prop Change: 3 testes (BadgeCard)
- ✅ Component Rendering Based on Route: 3 testes (Router)

---

## 💡 Porque Testar Componentes Reais?

- ✅ **Qualidade** - Garantir que o projeto funciona
- ✅ **Regressão** - Detetar bugs quando mudamos código
- ✅ **Confiança** - Saber que as features funcionam
- ✅ **Documentação** - Os testes servem como exemplos de uso

**Idealmente:** Deves ter testes para TODOS os componentes importantes do projeto!

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

### 5. **Testando com Router**
```javascript
import { createRouter, createWebHistory } from 'vue-router'

beforeEach(() => {
  router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/login', component: Login }
    ]
  })
})

it('renders component for route', async () => {
  router.push('/login')
  await router.isReady()
  
  const wrapper = mount(Login, {
    global: { plugins: [router] }
  })
  
  expect(wrapper.exists()).toBe(true)
})
```

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

## 🔄 Próximos Passos

Para testar mais componentes existentes, podes criar testes para:
- `XPBar.vue` - Barra de XP
- `StreakCounter.vue` - Contador de streak
- `EquipmentSlot.vue` - Slot de equipamento
- `Navbar.vue` - Barra de navegação
- `Footer.vue` - Rodapé
- `HabitCard.vue` - Cartão de hábito

**Padrão:** Seguir os mesmos tipos de teste (Rendering, Interaction, Prop Change) mas aplicados aos componentes reais.

---

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Vue.js Applications](https://vuejs.org/guide/scaling-up/testing.html)

---

**Última atualização**: 2025
**Estrutura**: 12 testes (3 de cada tipo)
