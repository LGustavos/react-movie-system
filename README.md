# MovieDB

Sistema web para explorar filmes, salvar favoritos e fazer buscas em cima da API do [TMDB](https://www.themoviedb.org/). Projeto construido como teste tecnico para posicao de **Frontend React Senior**.

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** para estilizacao (dark theme)
- **Context API** para o estado global de favoritos (com persistencia em `localStorage`)
- **Axios** para requisicoes HTTP
- **Vitest + React Testing Library** para testes unitarios
- Roteamento **file-based** do Next.js (equivalente ao React Router para navegacao)

### Por que Next.js em vez de CRA/Vite puro

O TMDB exige um Bearer Token que **nao deve ir para o bundle do cliente**. A aplicacao usa um **proxy interno** em `src/app/api/tmdb/[...path]/route.ts` que injeta o token no servidor. O front chama `/api/tmdb/movie/popular` e nunca ve o token. Alem disso, ganhamos rota otimizada, split de codigo automatico e deploy trivial na Vercel.

## Paginas

| Rota            | O que faz                                                                     |
| --------------- | ----------------------------------------------------------------------------- |
| `/`             | Home com grid infinito dos filmes populares                                   |
| `/movie/:id`    | Detalhes do filme (imagem, generos, sinopse, favoritar)                       |
| `/favorites`    | Favoritos com ordenacao (titulo A-Z/Z-A, nota) e estado vazio                 |
| `/search?q=...` | Busca com infinite scroll e destaque do termo pesquisado nos titulos dos cards |

## Estrutura

```
src/
├── app/                     # App Router
│   ├── layout.tsx           # Layout raiz + FavoritesProvider + Header
│   ├── page.tsx             # Home
│   ├── favorites/page.tsx
│   ├── search/page.tsx
│   ├── movie/[id]/page.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   └── api/tmdb/[...path]/route.ts   # Proxy TMDB (server-only)
├── components/              # UI reutilizavel (Header, MovieCard, Grid, EmptyState, ...)
├── contexts/                # FavoritesContext (Context API + localStorage)
├── hooks/                   # useInfiniteMovies, useInfiniteScrollAnchor, useMovieDetails, useDebounce
├── services/                # tmdb.ts (cliente Axios que fala com o proxy interno)
├── lib/                     # tmdbServer.ts (config server-only)
└── types/                   # DTOs TMDB
```

## Setup

**Requisitos:** Node.js **18.18+** (recomendado 20.x) e npm.

```bash
# 1. Clonar
git clone <seu-repo> react-movie-system
cd react-movie-system

# 2. Instalar dependencias
npm install

# 3. Configurar variaveis de ambiente
cp .env.example .env.local
# Abra .env.local e cole seu Bearer Token TMDB (v4)
# https://www.themoviedb.org/settings/api

# 4. Rodar em dev
npm run dev
# abre http://localhost:3000
```

## Scripts

| Comando              | Descricao                              |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Sobe o Next.js em modo desenvolvimento |
| `npm run build`      | Build de producao                      |
| `npm run start`      | Serve o build de producao              |
| `npm run typecheck`  | Roda `tsc --noEmit`                    |
| `npm run test`       | Roda a suite Vitest uma vez            |
| `npm run test:watch` | Vitest em modo watch                   |
| `npm run lint`       | ESLint (config `next/core-web-vitals`) |

## Variaveis de ambiente

Todas ficam em `.env.local` (ignorado pelo git). Detalhado em `.env.example`.

| Variavel        | Obrigatoria | Descricao                                                                 |
| --------------- | ----------- | ------------------------------------------------------------------------- |
| `TMDB_TOKEN`    | Sim         | Bearer Token v4 do TMDB (nunca exposto ao cliente)                        |
| `TMDB_API_URL`  | Nao         | Override da base URL. Default `https://api.themoviedb.org/3`              |
| `TMDB_LANGUAGE` | Nao         | Idioma retornado. Default `pt-BR`                                         |

## Deploy (Vercel)

1. `git push` do repositorio.
2. Importe o projeto em https://vercel.com/new.
3. Em **Environment Variables**, adicione `TMDB_TOKEN` (e opcionalmente `TMDB_LANGUAGE`).
4. Deploy. Nao ha configuracao adicional -- Next.js roda no runtime Node da Vercel e o proxy `/api/tmdb` fica disponivel automaticamente.

## Testes

Cobertura de unidade nas partes criticas de logica:

- `FavoritesContext` -> add/remove/toggle/persistencia/hidratacao (localStorage)
- `HighlightText` -> destaque case-insensitive, multiplas ocorrencias, escape de regex
- `MovieCard` -> render, alternar favorito, variante "remove", highlight do termo
- `Header` -> submit da busca redireciona para `/search?q=...`

```bash
npm test
```

## Decisoes de arquitetura

- **Proxy TMDB no servidor** mantem o token seguro e permite cache do Next (`revalidate: 60s`).
- **Context API** foi suficiente para o unico estado global (favoritos). Redux seria over-engineering aqui.
- **Infinite scroll via IntersectionObserver** encapsulado em `useInfiniteScrollAnchor`, dessa forma o hook `useInfiniteMovies` fica agnostico de UI e reusavel na Home e na Busca.
- **`FavoriteMovie` reduzido** (id, title, poster_path, vote_average, release_date) evita salvar payload completo do TMDB no localStorage.
- **Hidratacao explicita** (`hydrated`) evita "flash" de estado vazio antes do localStorage carregar no cliente.
