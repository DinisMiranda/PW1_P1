# my-vue-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Integração com o Todoist

1. Crie um token de integração no Todoist (Configurações → Integrações → API Token).
2. Adicione um ficheiro `.env` na raiz do projeto com a variável:

  ```sh
  VITE_TODOIST_API_TOKEN="o_token_do_todoist"
  ```

3. Arranque o backend mock (por omissão o frontend espera o servidor em `http://localhost:3000`):

  ```sh
  json-server --watch db.json --port 3000
  ```

  > Se preferir outra porta/host, defina `VITE_API_URL` num `.env` (ex.: `VITE_API_URL="http://localhost:3001"`).

4. Na página de Hábitos clique em "Importar do Todoist" para sincronizar as tarefas abertas.

> ⚠️ Nunca submeta o token ao repositório; mantenha-o em variáveis de ambiente e, em produção, faça as chamadas ao Todoist através de um backend seguro.
