# Mercadito — MVP de marketplace

MVP funcional de um marketplace estilo Mercado Livre: catálogo com busca, página de produto com matriz de variantes, carrinho persistente e checkout idempotente. Construído em uma sessão como esqueleto inicial de um escopo maior (ver `AGENTS.md`/skill original para a arquitetura completa planejada).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — breakpoints customizados (xs 375 / sm 640 / md 768 / lg 1024 / xl 1280), alvo de toque mínimo de 48px
- **Zod** — validação de todo input (catálogo, carrinho, checkout)
- **TanStack Query** — estado de servidor (catálogo, mutação de checkout)
- **Fuse.js** — busca fuzzy client-side (fallback enquanto não há Meilisearch/Elasticsearch)
- **Vitest** — testes unitários da lógica de preço/carrinho

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Juliojuliano/marketplace-mvp)

Projeto zero-config: sem variáveis de ambiente obrigatórias, sem serviços externos. Clique no botão acima (ou importe o repositório em vercel.com/new) para publicar.

> Nota: a idempotência do checkout usa um `Map` em memória (ver "O que fica para depois"), então não sobrevive a cold starts/múltiplas instâncias em produção serverless — suficiente para demo, não para produção real.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # testes unitários
npm run lint     # eslint
npm run build    # build de produção
```

## O que está implementado

- Catálogo com busca fuzzy e grid responsivo (`src/app/page.tsx`)
- Produto com matriz de variantes (cor/tamanho, estoque por SKU) (`src/app/product/[id]`)
- Carrinho persistido em localStorage (`src/lib/cart-context.tsx`)
- Checkout com **idempotência** via header/chave gerada no cliente e cache em memória com TTL simulando Redis (`src/app/api/checkout/route.ts`)
- Cotação de frete assíncrona com **fallback** em caso de timeout do "transportador"
- Error Boundary isolando falhas de UI (`src/components/ErrorBoundary.tsx`)

## O que fica para depois

Este MVP roda 100% com dados mock e sem infraestrutura externa. Para produção falta:

- Motor de busca real (Meilisearch/Elasticsearch) no lugar do Fuse.js client-side
- Redis real para idempotência e lock de estoque (hoje é um `Map` em memória, não sobrevive a restart nem escala entre instâncias)
- Gateway de pagamento real com webhooks de confirmação
- Testes E2E (Playwright/Cypress) do fluxo completo
- Auditoria de performance/acessibilidade (Lighthouse)
