# INZUPT - Atendimentos

Projeto, apenas, relacionado a área de atendimento do INZUPT.

## Pré-requisitos

- **Node.js**: versão 18 ou superior
- **Yarn**: versão 4.9.4

### Verificar versões instaladas
```bash
    node --version
    yarn --version
```

### Atualização do Yarn
```bash
    corepack enable && corepack install -g yarn@4.9.4
```

## Instalação

1. Clone o repositório:
```bash
    git clone [url-do-repositorio]
    cd [nome-do-projeto]
```

2. Instale as dependências:
```bash
  yarn install
```

## Execução

### Desenvolvimento
```bash
  yarn dev
```

### Build de produção
```bash
  yarn build
```

### Visualizar build local
```bash
  yarn preview
```

## Scripts disponíveis

- `yarn dev` - Inicia servidor de desenvolvimento
- `yarn build` - Gera build de produção
- `yarn preview` - Visualiza build localmente
- `yarn lint` - Executa linter
- `yarn test` - Executa testes (se configurados)
