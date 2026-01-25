# LEVELUP HABITS

Uma aplicação web gamificada para gestão de hábitos, onde os utilizadores podem criar e acompanhar os seus hábitos diários enquanto progridem num sistema de níveis inspirado em RPG.

## Sobre o Projeto

**LEVELUP HABITS** é uma aplicação de gestão de hábitos com elementos de gamificação, permitindo aos utilizadores:

- Criar e gerir hábitos personalizados
- Acompanhar progresso e estatísticas
- Ganhar XP e subir de nível
- Manter streaks (sequências de dias consecutivos)
- Sistema de batalhas baseado em RPG
- Personalização de personagens (Guerreiro, Mago, Arqueiro, Assassino)
- Sistema de inventário e equipamentos
- Badges e conquistas

## Tecnologias Utilizadas

### Frontend
- **Vue.js 3** - Framework JavaScript reativo
- **Vite** - Build tool e dev server
- **Vue Router 4** - Roteamento
- **Pinia** - Gestão de estado
- **Tailwind CSS** - Estilização (via classes utilitárias)

### Backend/Mock API
- **JSON Server** - API REST mock para desenvolvimento

### Testes
- **Vitest** - Framework de testes
- **Vue Test Utils** - Utilitários para testes Vue
- **jsdom** - Ambiente DOM para testes

### Ferramentas de Desenvolvimento
- **Vue DevTools** - Extensão para debugging
- **ESLint** (se configurado)

## Membros do Grupo

> **Nota:** Adiciona aqui os nomes e informações dos membros do grupo

- [Nome do Membro 1] - [Função/Contribuição]
- [Nome do Membro 2] - [Função/Contribuição]
- [Nome do Membro 3] - [Função/Contribuição]

## Como Iniciar o Projeto

### Pré-requisitos

- **Node.js** versão `^20.19.0` ou `>=22.12.0`
- **npm** (incluído com Node.js)

### Instalação

1. **Clone o repositório** (ou navega até à pasta do projeto):
```bash
cd my-vue-app
```

2. **Instala as dependências**:
```bash
npm install
```

### Executar em Modo de Desenvolvimento

1. **Inicia o servidor de desenvolvimento** (frontend):
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta se 5173 estiver ocupada).

2. **Inicia o JSON Server** (backend mock) - **em outro terminal**:
```bash
npx json-server --watch db.json --port 3000
```

O servidor API estará disponível em `http://localhost:3000`.

> **Dica:** Se a porta 3000 estiver ocupada, podes usar outra porta (ex: 3001) e configurar `VITE_API_URL` num ficheiro `.env`.

### Executar Testes

```bash
npm run test:unit
```

Para modo watch (executa automaticamente quando há mudanças):
```bash
npm run test:unit -- --watch
```

### Build para Produção

```bash
npm run build
```

Os ficheiros compilados estarão na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

## Estrutura do Projeto

```
my-vue-app/
├── src/
│   ├── api/              # Cliente API e endpoints
│   │   ├── client.js     # Cliente HTTP base
│   │   ├── habits.js     # Endpoints de hábitos
│   │   └── users.js      # Endpoints de utilizadores
│   ├── components/       # Componentes Vue reutilizáveis
│   │   ├── BadgeCard.vue
│   │   ├── HabitCard.vue
│   │   ├── LevelIndicator.vue
│   │   ├── XPBar.vue
│   │   └── ...
│   ├── stores/           # Stores Pinia (gestão de estado)
│   │   ├── auth.js       # Autenticação
│   │   ├── user.js       # Dados do utilizador (XP, nível, badges)
│   │   ├── habit.js       # Gestão de hábitos
│   │   ├── character.js   # Personagem e stats
│   │   ├── items.js       # Inventário e equipamentos
│   │   └── battle.js      # Sistema de batalhas
│   ├── views/            # Páginas/Vistas
│   │   ├── Dashboard.vue
│   │   ├── Habits.vue
│   │   ├── Character.vue
│   │   ├── Battle.vue
│   │   └── ...
│   ├── router/           # Configuração de rotas
│   ├── constants/        # Constantes e configurações
│   └── main.js           # Ponto de entrada da aplicação
├── __tests__/            # Testes unitários
├── db.json               # Base de dados mock (JSON Server)
├── docs/                 # Documentação
└── public/               # Ficheiros estáticos
```

## Funcionalidades Principais

### Sistema de Hábitos
- Criar, editar e eliminar hábitos
- Definir dificuldade (fácil, médio, difícil) que afeta o XP ganho
- Acompanhar progresso diário e streaks
- Categorização de hábitos

### Sistema de Progressão
- Ganhar XP ao completar hábitos
- Subir de nível automaticamente
- Cálculo dinâmico de XP necessário para próximo nível
- Barra de progresso visual

### Sistema de Personagens
- Escolher classe: Guerreiro, Mago, Arqueiro ou Assassino
- Atributos: Força (STR), Vitalidade (VIT), Agilidade (AGI), Inteligência (INT)
- Distribuir pontos ao subir de nível
- Equipar itens que afetam os atributos

### Sistema de Batalhas
- Batalhas baseadas em RPG
- Fases de combate
- Recompensas em loot boxes
- Itens e equipamentos

### Dashboard
- Visão geral do progresso
- Estatísticas semanais
- Atividades recentes
- Calendário de completação
- Próximos objetivos

## Configuração

### Variáveis de Ambiente

Cria um ficheiro `.env` na raiz do projeto:

```env
# URL da API (opcional, padrão: http://localhost:3000)
VITE_API_URL=http://localhost:3000

# Chave da API Freesound para música de batalhas (opcional)
VITE_FREESOUND_API_KEY=sua_chave_aqui
```

## Documentação Adicional

- **TESTING_GUIDE.md** - Guia completo sobre testes
- **API_SUGGESTIONS.md** - Sugestões de APIs externas
- **docs/arquitetura-funcoes.txt** - Documentação da arquitetura e funções
- **__tests__/README.md** - Documentação dos testes

## Testes

O projeto inclui testes unitários usando Vitest:

- **BadgeCard.spec.js** - Testes do componente BadgeCard
- **Router.spec.js** - Testes de navegação e rotas

Executar todos os testes:
```bash
npm run test:unit
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run preview` | Preview da build de produção |
| `npm run test:unit` | Executa testes unitários |

## Características de Design

- Tema escuro com acentos neon (roxo/ciano)
- Design moderno e responsivo
- Animações e transições suaves
- Interface gamificada com elementos visuais de RPG

## Autenticação

A aplicação suporta:
- Registo de novos utilizadores
- Login com username/email
- Gestão de sessão via localStorage
- Diferenciação entre utilizadores normais e administradores

## Persistência de Dados

- **localStorage** - Dados locais do utilizador (XP, nível, hábitos, etc.)
- **JSON Server** - Base de dados mock para utilizadores, hábitos e personagens

> **Nota:** Em produção, seria necessário substituir o JSON Server por uma API real.

## 🤝 Contribuir

1. Faz fork do projeto
2. Cria uma branch para a tua feature (`git checkout -b feature/AmazingFeature`)
3. Faz commit das mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faz push para a branch (`git push origin feature/AmazingFeature`)
5. Abre um Pull Request

## Licença

Este projeto é privado e desenvolvido para fins académicos.

## Agradecimentos

- Vue.js e toda a comunidade
- JSON Server pela simplicidade do mock API
- Todos os recursos e bibliotecas open-source utilizadas

---

**Desenvolvido usando Vue.js 3**
