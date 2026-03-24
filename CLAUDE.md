# Inzup Atendimento

## Visão geral
Interface de atendimento ao cliente (WhatsApp/chat) do sistema Inzup — o lado do atendente.
Usa Firebase para mensagens em tempo real e IndexedDB para cache local de conversas. O painel administrativo é um app separado.

## Stack e versões
- Vue 3.5 · Vite 6.2 · Vue Router 4.5 · Pinia 2.1 + pinia-plugin-persistedstate 3.2
- Firebase 9.23 (Realtime DB, Auth, Storage)
- Axios 1.12 · SweetAlert2 11 · idb 8.0 (IndexedDB wrapper)
- Bootstrap 5.2 (via CDN no index.html) · FontAwesome 7
- maska 3.2 · vue3-emoji-picker 1.1 · @glidejs/glide 3.7
- pdfjs-dist 5.3 · chart.js 4.4 + vue-chartjs 5.3
- date-fns 4.1 · moment 2.30 · lodash-es 4.17
- Sem TypeScript — JavaScript puro · yarn 4.9

## Comandos essenciais
- `yarn dev` — inicia dev server em https://localhost:8081 (HTTPS com cert autoassinado)
- `yarn build` — gera build de produção
- `yarn lint` — corrige linting (ESLint + Prettier)

## Padrões de código

### Geral
- O projeto usa **ambas** as APIs do Vue: Options API (componentes legados e a view principal) e `<script setup>` (componentes mais novos) — respeitar o estilo já presente no arquivo ao editar
- Nomes de componentes definidos com `defineOptions({ name: '...' })` nos que usam script setup
- Alias `@` aponta para `src/`
- Stores Pinia seguem o padrão `useXxxStore` (ex: `useListStatesStore`)
- API calls: campos sensíveis no payload são encodados com `btoa()`; endpoints também podem ser base64
- Estilos de componentes usam `<style lang="scss" scoped>` com aninhamento SCSS
- Props do tipo `Function` são proibidas — substituir por `defineEmits` + função wrapper local que emite o evento; eventos em kebab-case (ex: `'contato-selecionado'`, `'abrir-conversa'`)

### Ordem em componentes Vue — Composition API (`<script setup>`)
`imports` → `defineOptions/Props/Emits` → `Inject/Provide` → variáveis normais (const sem ref) → variáveis reativas (`ref`) → stores pinia → `Composables` → `computed` → funções/métodos → `watch` → lifecycle hooks

### Ordem em componentes Vue — Options API
`imports` → `name/Props/Emits` → `data` → `computed` → `methods` → `watch` → lifecycle hooks

### Acesso ao localStorage
Keys relevantes: `@TOKEN`, `@USER_ID`. Populadas via `localStorageDecode()` após decodificar o token da rota.

## Estrutura de pastas
```
src/
  components/      Componentes UI organizados por domínio:
    atendimento/       — chat, lista de contatos, ações (enviar mídia, transferir, etc.)
        composables/   — useAtendimentoFirebase, useAtendimentoIDB, useListasContatos e useNotificacaoAtendimento
    audio/             — player, recorder, uploader, volume-control
    modals/            — BaseModal + display-media, display-document, display-template-message
    ui/                — ImgComponent, UiBtnCircle, ProgressBarScreen
    GLOBALS/           — CidadesEstado, container
    mixins/            — IsView.js, ShowsTimes.js (legados)
  views/           2 páginas: atendimento.vue (main, script setup, ~2600 linhas), ErrorsPage.vue
  stores/          useListStatesStore (estados brasileiros)
  services/        api/api.js, api/newApi.js, api/apiImagem.js · middleware.js · IDBService.js
  utils/           formatters.js, localStorageDecode.js, links.js, useAudioRecorder.js, useTimerControl.js, math.js
  firebase/        Inicialização do Firebase + Vue plugin (expõe $firebase, $database, $auth, $storage)
  router/          Rotas: /atendimento/:token?, / (erros), wildcard → /error
  assets/styles/   SCSS: index.scss, mixins.scss, tooltip.scss, transitons.scss
  mixins/          uploader-props.js
```

## Rotas de API

### Instâncias Axios
- Abaixo está organizado da seguinte forma: **Arquivo** -> **Base URL** -> **Uso**

`src/services/api/api.js` -> `https://inzupt.com/api` -> Endpoints principais (autenticação, conversas, sync)
`src/services/api/newApi.js` -> `https://inzupt.com.br/api/api` -> Endpoints alternativos/novos
`src/services/api/apiImagem.js` -> `https://inzupt.com/api` -> Upload de mídia (multipart/form-data)

### Endpoints conhecidos
- `POST /logout/ZmlsYWRlYXRlbmRpbWVudG8=` — Logout
- `POST /string_atendimento/ZmlsYWRlYXRlbmRpbWVudG8=` — Decodifica token e retorna dados do usuário
- `POST /conversas_bd/ZmlsYWRlYXRlbmRpbWVudG8=` — Lista conversas
- `POST /atendimento/sync/ZmlsYWRlYXRlbWVudG8=` — Sincronização inicial de dados
- `POST /atendimento/envia_midia` — Envio de mídia (multipart)

> Os sufixos de endpoint são strings base64 — manter esse padrão ao adicionar novos endpoints.

## Restrições
- A rota `/atendimento/:token?` exige token com ≥ 10 caracteres — guard em `Middleware.atendimento`
- Em caso de 401, o interceptor do Axios chama `middleware.logout()` automaticamente
- Firebase é injetado como plugin Vue — usar `inject('database')` ou `this.$database`, não reimportar
- URL do admin vem de `.env` via `VITE_ADMIN_URL` — não hardcodar
- Payloads para a API codificam IDs com `btoa()` — manter esse padrão em novas chamadas
- IndexedDB é gerenciado via `IDBService` (`src/services/IDBService.js`) — não usar idb diretamente na view
- SCSS usa mixins globais (flex, pulsate, etc.) injetados via vite.config — disponíveis em todos os componentes sem import
