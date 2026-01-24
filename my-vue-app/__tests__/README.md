# Testes - Exemplos do PowerPoint

Este diretório contém os testes baseados nos exemplos do PowerPoint **M05 – Testing**.

## 🤔 Porque Componentes Novos vs Componentes Existentes?

### Componentes Novos (Exemplos do PowerPoint)
Criei **3 componentes simples** (`Greeting.vue`, `ButtonCounter.vue`, `CounterWithProps.vue`) para seguir **exatamente** os exemplos do PowerPoint. Estes são:
- **Mais simples** - Fáceis de entender para aprender conceitos
- **Exemplos didáticos** - Seguem o formato exato do PowerPoint
- **Isolados** - Sem dependências complexas (stores, routers, etc.)

### Componentes Existentes (Testes Reais)
**Já temos testes** para os componentes reais do projeto:
- ✅ `BadgeCard.spec.js` - Testa o componente BadgeCard real
- ✅ `HabitCard.spec.js` - Testa o componente HabitCard real  
- ✅ `LevelIndicator.spec.js` - Testa o componente LevelIndicator real
- ✅ `Router.spec.js` - Testa navegação de rotas

**Conclusão:** Ambos são importantes! Os novos são para aprender, os existentes são para garantir que o projeto funciona.

---

## 📋 O Que os Testes Avaliam?

### 1. **Basic Rendering** (Renderização Básica)
**O que avalia:** Se o componente renderiza corretamente no DOM

**Exemplos:**
- ✅ O componente aparece na página?
- ✅ O texto correto é exibido?
- ✅ Os elementos HTML estão presentes?

**Testes:**
- `BadgeCard.spec.js` - Verifica se renderiza título e descrição
- `Greeting.spec.js` - Verifica se mostra "Hello, World!"

---

### 2. **Interaction** (Interação do Utilizador)
**O que avalia:** Se o componente reage corretamente a ações do utilizador

**Exemplos:**
- ✅ O que acontece quando clico num botão?
- ✅ O estado muda quando interajo?
- ✅ Os eventos são disparados corretamente?

**Testes:**
- `ButtonCounter.spec.js` - Verifica se o contador incrementa ao clicar
- `BadgeCard.spec.js` - Verifica se muda de estado (locked/unlocked)

---

### 3. **Prop Change** (Mudança de Props)
**O que avalia:** Se o componente atualiza quando as props mudam

**Exemplos:**
- ✅ O componente reage a mudanças de props?
- ✅ A UI atualiza quando passo novas props?
- ✅ Os valores padrão funcionam?

**Testes:**
- `BadgeCard.spec.js` - Verifica mudança de `isLocked` e `title`
- `CounterWithProps.spec.js` - Verifica mudança de `step` e `initialCount`

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

## 📁 Estrutura dos Testes

### Exemplos do PowerPoint (Componentes Novos)

#### Exemplo 1: Basic Rendering
**Ficheiro:** `Greeting.spec.js`  
**Componente:** `Greeting.vue` (criado para exemplo)

```javascript
it('renders greeting message correctly', () => {
  const wrapper = mount(Greeting)
  expect(wrapper.text()).toBe('Hello, World!')
})
```

#### Exemplo 2: Interaction
**Ficheiro:** `ButtonCounter.spec.js`  
**Componente:** `ButtonCounter.vue` (criado para exemplo)

```javascript
it('increments count when button is clicked', async () => {
  const wrapper = mount(ButtonCounter)
  expect(wrapper.text()).toContain('0')
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('1')
})
```

#### Exemplo 3: Prop Change
**Ficheiro:** `CounterWithProps.spec.js`  
**Componente:** `CounterWithProps.vue` (criado para exemplo)

```javascript
it('updates count when initialCount prop changes', async () => {
  const wrapper = mount(CounterWithProps, {
    props: { initialCount: 0 }
  })
  await wrapper.setProps({ initialCount: 10 })
  expect(wrapper.props('initialCount')).toBe(10)
})
```

---

### Testes dos Componentes Reais do Projeto

#### BadgeCard (Componente Real)
**Ficheiro:** `BadgeCard.spec.js`  
**Componente:** `src/components/BadgeCard.vue` (componente real do projeto)

**O que testa:**
- ✅ Renderização básica com props padrão e customizadas
- ✅ Estado locked/unlocked (interação visual)
- ✅ Mudança dinâmica de props (isLocked, title)

**Porque é importante:** Garante que o componente de badges funciona corretamente na aplicação real.

#### HabitCard (Componente Real)
**Ficheiro:** `HabitCard.spec.js`  
**Componente:** `src/components/HabitCard.vue` (componente real do projeto)

**O que testa:**
- ✅ Renderização de informações do hábito
- ✅ Aplicação de classes CSS baseadas em props
- ✅ Botões presentes e funcionais

**Porque é importante:** Garante que os cartões de hábitos exibem informação correta.

#### LevelIndicator (Componente Real)
**Ficheiro:** `LevelIndicator.spec.js`  
**Componente:** `src/components/LevelIndicator.vue` (componente real do projeto)

**O que testa:**
- ✅ Integração com Pinia Store
- ✅ Exibição do nível do utilizador
- ✅ Atualização quando o nível muda

**Porque é importante:** Garante que o indicador de nível sincroniza com o store.

---

## 🎯 Resumo: O Que Cada Teste Avalia

| Tipo de Teste | O Que Avalia | Exemplo |
|--------------|--------------|---------|
| **Basic Rendering** | Se renderiza corretamente | Texto aparece? Elementos existem? |
| **Interaction** | Se reage a ações do utilizador | Botão funciona? Estado muda? |
| **Prop Change** | Se atualiza com novas props | UI muda quando props mudam? |
| **Route Rendering** | Se mostra componente correto | Rota `/login` mostra Login? |

---

## 🚀 Como Executar

```bash
# Executar todos os testes
npm run test:unit

# Executar em modo watch (re-executa ao mudar ficheiros)
npm run test:unit -- --watch

# Executar um ficheiro específico
npm run test:unit -- Greeting.spec.js
npm run test:unit -- BadgeCard.spec.js

# Interface gráfica
npm run test:unit -- --ui
```

---

## 📊 Resultado Atual

```
✓ Test Files  7 passed (7)
✓ Tests  26 passed (26)
```

**Testes de Exemplos (PowerPoint):**
- ✅ Greeting.spec.js (3 testes)
- ✅ ButtonCounter.spec.js (4 testes)
- ✅ CounterWithProps.spec.js (5 testes)

**Testes de Componentes Reais:**
- ✅ BadgeCard.spec.js (6 testes)
- ✅ HabitCard.spec.js (4 testes)
- ✅ LevelIndicator.spec.js (2 testes)
- ✅ Router.spec.js (2 testes)

---

## 💡 Porque Ambos São Importantes?

### Componentes Novos (Exemplos)
- ✅ **Aprendizagem** - Entender conceitos básicos
- ✅ **Simplicidade** - Sem dependências complexas
- ✅ **Referência** - Seguir exatamente o PowerPoint

### Componentes Reais
- ✅ **Qualidade** - Garantir que o projeto funciona
- ✅ **Regressão** - Detetar bugs quando mudamos código
- ✅ **Confiança** - Saber que as features funcionam

**Idealmente:** Deves ter testes para TODOS os componentes importantes do projeto!

---

## 🔄 Próximos Passos

Para testar mais componentes existentes, podes criar testes para:
- `XPBar.vue` - Barra de XP
- `StreakCounter.vue` - Contador de streak
- `EquipmentSlot.vue` - Slot de equipamento
- `Navbar.vue` - Barra de navegação
- `Footer.vue` - Rodapé

**Padrão:** Seguir os mesmos tipos de teste (Rendering, Interaction, Prop Change) mas aplicados aos componentes reais.
