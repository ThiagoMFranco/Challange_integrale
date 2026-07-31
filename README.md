<<<<<<< HEAD
# Integrale Leads — Desafio Técnico (Analista de TI)

Sistema de Cadastro de Leads: API própria em Node.js conectada ao Supabase, e uma interface em React para cadastrar e consultar os leads.

## Sobre o projeto

Um "Lead" é um contato comercial em potencial que precisa ser registrado para acompanhamento comercial futuro. O sistema permite cadastrar um novo lead (nome, e-mail, telefone, empresa, origem e observações) e listar os leads já cadastrados, com filtro por nome/origem e paginação.

## Estrutura do projeto

Monorepo gerenciado com **pnpm workspaces**, com uma única `node_modules` compartilhada na raiz:

```
.
├── backend/    → API REST (Node.js + Express + TypeScript + Supabase)
├── frontend/   → Interface (React + TypeScript + Tailwind CSS)
├── shared/     → Código compartilhado entre backend e frontend (enum de origem e tipos da API)
├── pnpm-workspace.yaml
└── package.json (scripts da raiz)
```

### Backend (`backend/src`)

```
app.ts, index.ts
config/          → validação de env (Zod) e cliente Supabase
routes/          → leads.routes.ts (POST /, GET /) + index.ts (agrega + /health)
controllers/      → createLead.controller.ts, getLeads.controller.ts
services/         → createLead.service.ts, getLeads.service.ts
validators/       → createLead.validator.ts, getLeads.validator.ts (Zod)
types/            → re-exporta os tipos de @integrale/shared
utils/            → error-handler.ts (tratamento centralizado de erros)
```

Testes em `backend/tests` (unitários por service + E2E dos endpoints), com Vitest + Supertest e o cliente Supabase mockado.

### Frontend (`frontend/src`)

```
pages/            → CadastroPage.tsx, ListagemPage.tsx
components/layout/ → NavBar, AppLayout, PageHeader
components/leads/  → LeadForm, LeadFilters, LeadsTable, LeadCard, LeadsView
components/ui/     → Button, Input, Select, Textarea, FormField, Alert, Spinner, EmptyState, Pagination
hooks/             → useLeads, useLeadFilters, useCreateLead, useLeadForm
services/          → api.ts (fetch centralizado) e leads.service.ts
validators/        → lead.validator.ts (Zod, espelha a validação do backend)
types/, utils/
```

### Shared (`shared/src`)

Enum de origem do lead (`LEAD_ORIGIN_VALUES`/`LEAD_ORIGIN_LABELS`) e os tipos `Lead`, `ApiResponse`, `PaginatedResponse` — única fonte de verdade usada tanto pelo backend quanto pelo frontend.

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- pnpm 9+
- Uma conta/projeto no [Supabase](https://supabase.com)

### 1. Instalar dependências

Na raiz do monorepo:

```bash
pnpm install
```

Isso instala as dependências de `backend`, `frontend` e `shared` de uma vez, em uma única `node_modules`.

### 2. Configurar o banco (Supabase)

No SQL Editor do seu projeto Supabase, crie a tabela `leads`:

```sql
create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(20) not null,
  company varchar(255),
  origin varchar(100) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists idx_leads_created_at on leads (created_at desc);
create index if not exists idx_leads_name on leads (name);
create index if not exists idx_leads_origin on leads (origin);
```

> Se a sua tabela já existir com `id` como inteiro, veja a nota sobre migração de `id` para UUID na seção **Decisões técnicas** abaixo.

### 3. Configurar variáveis de ambiente

```bash
cd backend
cp .env.example .env
```

Preencha `backend/.env` com as credenciais do seu projeto Supabase (Dashboard → Settings → API):

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

`SUPABASE_SERVICE_ROLE_KEY` é a chave **service_role** (secreta), não a `anon`/`publishable` — veja o porquê em Decisões técnicas. Nunca commite o valor real dessa chave.

O frontend também tem um `.env.example` (`frontend/.env.example`) com a URL base da API; opcional se você mantiver o backend na porta padrão (3000).

### 4. Rodar o backend

```bash
pnpm backend:dev
```

Sobe em `http://localhost:3000`. Teste com `curl http://localhost:3000/api/health`.

### 5. Rodar o frontend

Com o backend rodando:

```bash
pnpm frontend:dev
```

Sobe em `http://localhost:5173`.

### 6. Rodar os testes (backend)

```bash
pnpm test
```

## Endpoints da API

Base URL: `http://localhost:3000/api`

| Método | Rota      | Descrição                            |
| ------ | --------- | ------------------------------------ |
| POST   | `/leads`  | Cria um novo lead                    |
| GET    | `/leads`  | Lista leads, com filtros e paginação |
| GET    | `/health` | Health check                         |

**GET /leads** aceita os query params: `searchName` (busca parcial por nome), `searchOrigin` (busca parcial por origem), `page` (default 1), `limit` (default 20, máximo 100). A listagem é sempre ordenada por `created_at` decrescente (mais recentes primeiro).

Todas as respostas seguem o formato `{ success, data, message?, error? }`.

## Modelagem de dados

| Campo        | Tipo           | Observações                                                         |
| ------------ | -------------- | ------------------------------------------------------------------- |
| `id`         | `uuid`         | Gerado pela aplicação no momento da criação (`crypto.randomUUID()`) |
| `name`       | `varchar(255)` | Obrigatório                                                         |
| `email`      | `varchar(255)` | Obrigatório, validado como e-mail                                   |
| `phone`      | `varchar(20)`  | Obrigatório                                                         |
| `company`    | `varchar(255)` | Opcional                                                            |
| `origin`     | `varchar(100)` | Obrigatório — ver decisão sobre enum abaixo                         |
| `notes`      | `text`         | Opcional                                                            |
| `created_at` | `timestamptz`  | Preenchido pela aplicação na criação                                |
| `updated_at` | `timestamptz`  | Reservado para uso futuro (não é escrito hoje)                      |

## Decisões técnicas

**Monorepo com pnpm workspaces.** Backend, frontend e um pacote `shared` compartilham uma única `node_modules`. O `shared` existe para não duplicar o enum de origem do lead e os tipos da API entre os dois lados — qualquer mudança nesses contratos acontece em um único lugar.

**Arquitetura em camadas no backend** (`routes → controllers → services → validators`), um fluxo por arquivo (create/get), exceto as rotas: como são poucas e do mesmo assunto, ficam em um único `leads.routes.ts` — separar geraria arquivos extras sem ganho real de organização.

**`service_role key` em vez de políticas de RLS.** O Supabase é acessado exclusivamente pelo backend (o frontend nunca fala diretamente com o Supabase); por isso o backend usa a chave `service_role`, que ignora RLS, em vez de duplicar as regras de acesso como políticas Postgres. Essa chave nunca é exposta ao frontend e não deve ser commitada.

**Origem do lead como `varchar` livre no banco, mas `enum` fechado na API.** A coluna aceita texto livre para não travar o schema, mas o Zod da rota de criação só aceita um conjunto fechado de valores (`website`, `referral`, `event`, `social_media`, `other`), compartilhado com o frontend via `@integrale/shared` — o mesmo enum alimenta o `<select>` de origem e a busca por origem na listagem.

**Filtro por nome e origem, com paginação.** `GET /leads` filtra por `searchName`/`searchOrigin` (correspondência parcial, case-insensitive) e pagina com `page`/`limit`, retornando `total`/`hasMore` para a interface montar a paginação.

**`id` como UUID gerado pela aplicação.** O `id` é gerado no backend (`crypto.randomUUID()`) e enviado explicitamente no `insert`, em vez de depender de um valor padrão do banco — assim a geração não depende de a coluna ter (ou não) um `default` configurado no Postgres. UUIDs evitam ids sequenciais/previsíveis para um identificador que pode circular fora do banco (ex: em uma URL).

> Se a tabela já existia com `id` inteiro, a migração para UUID exige alterar o tipo da coluna no Supabase (não é algo que a aplicação faça sozinha):
>
> ```sql
> alter table leads
>   alter column id drop default,
>   alter column id type uuid using gen_random_uuid(),
>   alter column id set default gen_random_uuid();
> ```
>
> Isso preserva as linhas existentes, mas atribui um novo UUID a cada uma (não há como converter um inteiro em UUID de forma significativa).

**Frontend sem bibliotecas extras de data-fetching/roteamento.** A navegação entre "Cadastro" e "Listagem" é um estado local simples (sem `react-router-dom`) e a busca de dados usa hooks próprios (`useLeads`, `useLeadFilters`) em vez de React Query — escopo pequeno o suficiente para não justificar as dependências extras.

**Validação duplicada (backend e frontend) de propósito.** O frontend usa Zod para validar o formulário antes de enviar (feedback imediato ao usuário), espelhando as mesmas regras do `createLeadSchema` do backend. A duplicação é intencional: o frontend precisa rodar essa validação de forma síncrona no navegador, e o backend continua sendo a fonte de verdade (a API valida de novo, independente do que o cliente mandar).

## Dificuldades encontradas

- **Configuração de módulos do TypeScript**: o backend usa `NodeNext` (imports relativos com `.js`, como o Node exige em ESM puro) enquanto o frontend usa `bundler` (Vite resolve os imports) — misturar as duas convenções gerou os primeiros erros de "cannot find module".
- **RLS do Supabase bloqueando o `insert`**: resolvido migrando o backend para a chave `service_role`, já que só o backend acessa o Supabase diretamente.
- **Hoisting de `vi.mock` no Vitest**: variáveis referenciadas dentro de uma factory de `vi.mock` precisam ser criadas com `vi.hoisted`, não um `const` comum — descoberto depois que os primeiros testes falhavam com `ReferenceError` antes mesmo de rodar.
- **Arquivos revertendo sozinhos após uma correção**: em alguns momentos, um arquivo corrigido remotamente voltava ao conteúdo antigo pouco depois — rastreado a abas do editor abertas com versões antigas em memória, sobrescrevendo a correção ao salvar/autosalvar. A mitigação foi sempre reler o arquivo do disco antes de editar de novo e pedir para fechar/recarregar a aba correspondente antes de rodar o projeto.

## Uso de Inteligência Artificial

Este projeto foi desenvolvido com apoio do Claude (Cowork). Os principais prompts utilizados estão documentados em [`prompts.md`](./prompts.md).
=======
# Challange_integrale
>>>>>>> ee09990dadb7e449a42553f6ed603717cadc034b
