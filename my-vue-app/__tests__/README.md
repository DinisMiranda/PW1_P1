# Testes - Componentes do Projeto

Este diretório contém os testes para os componentes reais do projeto, baseados nos conceitos do PowerPoint **M05 – Testing**.

## 📋 Testes dos Componentes Reais

Todos os testes aqui testam componentes **reais** do projeto:
- ✅ `BadgeCard.spec.js` - Testa o componente BadgeCard
- ✅ `HabitCard.spec.js` - Testa o componente HabitCard  
- ✅ `LevelIndicator.spec.js` - Testa o componente LevelIndicator
- ✅ `Router.spec.js` - Testa navegação de rotas

Estes testes garantem que os componentes funcionam corretamente na aplicação real.

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
- `HabitCard.spec.js` - Verifica se renderiza informações do hábito

---

### 2. **Interaction** (Interação do Utilizador)
**O que avalia:** Se o componente reage corretamente a ações do utilizador

**Exemplos:**
- ✅ O que acontece quando clico num botão?
- ✅ O estado muda quando interajo?
- ✅ Os eventos são disparados corretamente?

**Testes:**
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
- `HabitCard.spec.js` - Verifica mudança de props de cor e frequência

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
npm run test:unit -- BadgeCard.spec.js
npm run test:unit -- HabitCard.spec.js

# Interface gráfica
npm run test:unit -- --ui
```

---

## 📊 Resultado Atual

```
✓ Test Files  4 passed (4)
✓ Tests  14 passed (14)
```

**Testes de Componentes Reais:**
- ✅ BadgeCard.spec.js (6 testes) - Basic Rendering, Interaction, Prop Change
- ✅ HabitCard.spec.js (4 testes) - Renderização e props
- ✅ LevelIndicator.spec.js (2 testes) - Integração com Pinia Store
- ✅ Router.spec.js (2 testes) - Component Rendering Based on Route

---

## 💡 Porque Testar Componentes Reais?

- ✅ **Qualidade** - Garantir que o projeto funciona
- ✅ **Regressão** - Detetar bugs quando mudamos código
- ✅ **Confiança** - Saber que as features funcionam
- ✅ **Documentação** - Os testes servem como exemplos de uso

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
