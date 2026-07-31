# Prompts Utilizados — Integrale Leads

Este arquivo documenta os principais prompts usados durante o desenvolvimento do projeto com o Claude (Cowork), em ordem cronológica.

## 1. Análise inicial e arquitetura do backend

**Objetivo:** entender o README do desafio e definir a arquitetura antes de escrever qualquer código.

```
Analise cuidadosamente o README deste projeto antes de qualquer ação.
O projeto será um monorepo contendo backend (Node.js + Express + TypeScript)
e frontend (React + TypeScript + Tailwind CSS).
Neste momento, vamos trabalhar exclusivamente no backend.

Antes de qualquer implementação:
1. Analise completamente o README
2. Identifique todos os requisitos funcionais e técnicos
3. Identifique possíveis dúvidas, inconsistências ou informações faltantes
4. Defina a arquitetura que será utilizada
5. Liste todos os arquivos e pastas que precisarão ser criados
6. Quebre o desenvolvimento em etapas pequenas e organizadas
```

**Decisões confirmadas em seguida** (respostas às dúvidas levantadas na análise):
- Filtro na listagem por nome **e** origem (ambos)
- Origem armazenada como `varchar` livre
- Ordenação por `created_at` decrescente (mais recente primeiro)
- Paginação (`page`/`limit`)
- Sem autenticação
- CORS habilitado

**Resultado:** plano de implementação em camadas (routes → controllers → services → validators → types → config → utils), aprovado antes de codar.

## 2. Monorepo com pnpm

```
Por ser um monorepo, pode organizar as pastas para receber apenas uma
node_modules, e vamos usar o pnpm
```

**Resultado:** reestruturação em `backend/`, `frontend/`, `pnpm-workspace.yaml` e `package.json` na raiz com scripts agregadores, uma única `node_modules` compartilhada.

## 3. Correções de bugs reportados em uso real

Ao longo da implementação inicial, vários problemas só apareceram quando o projeto rodava de verdade na máquina do usuário (fora do sandbox usado para gerar o código). Cada um foi reportado com o erro exato e corrigido:

- Validação de `.env` falhando mesmo com o arquivo preenchido → causa real: `index.ts` tinha sido sobrescrito sem o `import 'dotenv/config'`.
- Erros de `tsconfig.json`/módulos (`cannot find module ...`) → `moduleResolution` incompatível com os imports `.js` estilo NodeNext.
- `TS2883` no tipo de `Router` → interação entre `declaration: true` + NodeNext + pnpm.
- `TS6133` (parâmetro não utilizado) no middleware de erro do Express.
- Erro 500 fixo no error handler mesmo para erros de request malformado (400) → handler ajustado para respeitar `err.statusCode`.
- `new row violates row-level security policy` ao criar lead → migração da chave `anon` para a `service_role` (decisão tomada entre 3 alternativas apresentadas).

## 4. Refatoração do backend + testes

```
Agora que todos os testes passaram e o fluxo está funcionando corretamente,
vamos fazer uma etapa de refatoração para melhorar a organização e facilitar
a manutenção do projeto. Antes de alterar qualquer código, analise a
estrutura atual e apresente um plano resumido das mudanças que serão
realizadas.

Objetivos:
1. Separação das rotas em arquivos por fluxo (create/get)
2. Separação das validações em arquivos por fluxo
3. Organização dos services por responsabilidade
4. Origem como Enum compartilhado (Zod + tipagem backend + reaproveitável
   no frontend para um <Select>)
5. Testes unitários dos services + E2E cobrindo os endpoints, com mocks
   do Supabase

Regras: não alterar regra de negócio, preservar comportamento da API,
usar boas práticas/SRP, apresentar plano e aguardar aprovação antes de
implementar.
```

**Ajuste feito durante a aprovação:** as rotas permaneceram em um único arquivo (`leads.routes.ts`) — separar por fluxo não trazia ganho real de organização por serem poucas rotas do mesmo assunto.

**Resultado:** controllers/services/validators separados por fluxo (create/get/getById), `types/leads.types.ts` reexportando de `@integrale/shared`, pacote `shared` com o enum de origem, suíte de testes com Vitest + Supertest e um helper de mock do query builder do Supabase.

## 5. Implementação do frontend

```
Perfeito! Agora vamos iniciar o desenvolvimento do frontend. Nesta etapa,
quero criar uma interface simples, moderna e responsiva para consumir a
API que desenvolvemos no backend.

Formulário: campos controlados, validação com Zod e erros amigáveis,
origem como <Select> a partir do Enum compartilhado, loading/disabled no
submit, sucesso limpa o formulário e atualiza a listagem.

Listagem: busca ao carregar, atualiza após criar, loading, estado vazio,
totalmente responsiva.

Layout: minimalista e moderno com Tailwind, boa hierarquia visual,
espaçamento consistente, responsivo (desktop/tablet/mobile), componentes
reutilizáveis.

Arquitetura: pages/components/services/hooks/validators/types/utils,
componentes pequenos com responsabilidade única.

Regras: não alterar regras de negócio do backend, reaproveitar o Enum
compartilhado de origem, priorizar reuso de componentes, código limpo e
organizado. Qualquer melhoria de arquitetura identificada deve ser
proposta antes de implementada.

Antes de começar a implementar, apresente um plano com a estrutura de
pastas, componentes e arquivos que serão criados. Somente após minha
aprovação inicie o desenvolvimento.
```

**Decisões confirmadas antes de implementar:** busca de dados com hooks próprios (sem lib extra); formulário com `useState` + hook próprio de validação Zod (sem lib de formulários).

**Resultado:** app React + Vite + Tailwind, camada de serviço centralizada (`services/api.ts`), hooks (`useLeads`, `useCreateLead`, `useLeadForm`), componentes de UI reutilizáveis, todo o app consumindo o enum de origem de `@integrale/shared`.

## 6. Melhorias de UI/UX e navegação

```
O fluxo de cadastro pelo frontend está funcionando corretamente. Agora
vamos realizar uma etapa de melhorias na interface, organização dos
componentes e experiência do usuário. Antes de implementar qualquer
alteração, analise a estrutura atual e apresente um plano resumido.

1. Menu de navegação fixo no topo (Cadastro / Listagem), trocando de
   tela sem recarregar a página.
2. Tela de Cadastro centralizada, largura máxima limitada, espaçamentos
   revisados, totalmente responsiva.
3. Tela de Listagem remodelada: tabela responsiva com todos os campos
   em telas maiores, cartões (ou outra abordagem) no mobile.
4. Área de filtros acima da listagem, preparada para consumir os
   parâmetros da API.
5. Responsividade prioritária em desktop/tablet/mobile, sem rolagem
   horizontal.
6. Arquitetura limpa: componentes pequenos, sem duplicação, tipagem
   completa.

Regras: não alterar regras de negócio nem a integração com o backend,
focar só em layout/organização/UX, princípios de Clean Architecture e
SRP.
```

**Decisões confirmadas antes de implementar:** navegação com estado local em `App.tsx` (sem `react-router-dom`); adicionar paginação real na listagem, já que a API já suportava `page`/`limit`.

**Resultado:** `NavBar`/`AppLayout` fixos, `CadastroPage`/`ListagemPage` separadas, `LeadFilters` conectado de verdade aos parâmetros `searchName`/`searchOrigin` que a API já aceitava, `LeadsTable` (desktop/tablet) e `LeadCard` (mobile) mostrando todos os campos, `Pagination` usando `page`/`hasMore`/`total`.

## 7. Refatoração final do backend: remoção de endpoint não usado e UUID

```
Vamos refatorar uns pontos no backend, o GET por id está sendo usado para
alguma coisa? Pelo front não vai ser usado; caso após a sua análise for
que não é utilizado, pode ser feita a remoção dos arquivos e do endpoint.

Outra coisa: vamos alterar o ID de inteiro para UUID, consegue ajustar a
query também do create para criar sendo um UUID?
```

**Resultado:** confirmado que `GET /leads/:id` não era chamado por nenhuma tela do frontend → controller, service, validator e testes correspondentes removidos, rota removida. `createLead.service.ts` passou a gerar o `id` explicitamente com `crypto.randomUUID()` no momento da criação, com teste unitário garantindo o formato UUID v4. A migração da coluna `id` no Supabase (de inteiro para `uuid`) foi entregue como instrução em SQL para o usuário rodar, já que o Claude não tem acesso ao banco.

## 8. Revisão final de documentação

```
Revise o README e verifique se falta algo para ser feito. Também é
necessário atualizar o prompts.md com todos os prompts feitos nessa
sessão.
```

**Resultado:** revisão encontrou configurações desatualizadas em `pnpm-workspace.yaml`, `package.json` (raiz e backend) e `frontend/package.json` (voltaram a um estado antigo, mesmo problema de arquivos revertendo já visto antes), além de credenciais reais expostas em `backend/.env.example`. Esses arquivos foram corrigidos, o `README.md` da raiz foi reescrito com a documentação real do projeto (como rodar, decisões técnicas, dificuldades) e este `prompts.md` foi atualizado com o histórico completo da sessão.

---

**Gerado com:** Claude (Cowork)
**Última atualização:** 2026-07-31
