# Documentacao de Entrega e Arquitetura

## Objetivo deste documento

Este material registra, de forma objetiva e rastreavel, o que foi entregue no projeto, qual arquitetura foi adotada, como as camadas se relacionam e por que essas decisoes foram tomadas.

A ideia aqui nao e vender uma arquitetura perfeita, e sim deixar claro o racional tecnico da implementacao para facilitar revisao, manutencao e evolucao.

## Resumo da arquitetura adotada

A aplicacao segue uma arquitetura em camadas com separacao explicita entre:

- regra de negocio e estado de tela
- acesso a API
- componentes de interface
- preocupacoes transversais (auth, erro HTTP, sessao, notificacao)

Em termos praticos, o fluxo principal fica assim:

1. A pagina recebe interacoes do usuario.
2. A pagina delega para uma facade da feature.
3. A facade manipula estado e chama um repositorio.
4. O repositorio conversa com o servico de API.
5. Interceptors aplicam regras globais de autenticacao e erro.

Esse desenho reduz acoplamento da UI com detalhes HTTP e facilita testes por camada.

## Camadas do projeto

## 1) Core

Pasta: src/core

Responsabilidade:

- Regras transversais da aplicacao.
- Sessao, armazenamento local, notificacoes.
- Interceptors e guard de autenticacao.
- Constantes e modelos globais.

Por que existe:

- Evitar duplicacao de comportamento em cada feature.
- Centralizar politica de autenticacao e erros.

Exemplos de papel da camada:

- Auth interceptor injeta token em chamadas autenticadas.
- Error interceptor traduz falhas HTTP para feedback ao usuario e trata 401.
- Auth guard protege rotas privadas.

## 2) Infrastructure

Pasta: src/infrastructure

Responsabilidade:

- Encapsular integracao remota com a Fake Store API.
- Isolar detalhes de endpoint e HttpClient da camada de negocio.

Por que existe:

- Permite trocar implementacao de acesso remoto sem quebrar telas.
- Evita espalhar URL de endpoint e logica de request no projeto inteiro.

Composicao:

- api: servicos HTTP concretos.
- repositories: interface de consumo usada pelas facades.

## 3) Features

Pasta: src/features

Responsabilidade:

- Implementar casos de uso de cada dominio da aplicacao.
- Organizar paginas, modelos, facades e componentes proprios por feature.

Por que existe:

- Facilita escalar o sistema por contexto de negocio.
- Reduz impacto de mudanca entre modulos.

Features atuais:

- auth
- dashboard
- products

## 4) Shared

Pasta: src/shared

Responsabilidade:

- Componentes e utilitarios reutilizaveis entre features.
- Layouts e elementos de interface desacoplados de dominio.

Por que existe:

- Evita duplicacao visual e funcional.
- Padroniza experiencia de uso.

Exemplos:

- filtros
- paginacao
- loading
- empty-state
- confirm-dialog

## 5) App e roteamento

Pasta: src/app

Responsabilidade:

- Bootstrap da aplicacao.
- Configuracao de providers globais.
- Mapa principal de rotas.

Por que existe:

- Concentrar composicao da aplicacao em um ponto unico.
- Aplicar lazy loading nas features, conforme requisito.

## Decisoes de implementacao

## Estado de produtos em facade

Decisao:

- Estado de listagem, filtros, paginacao e estados de request em uma facade baseada em RxJS.

Motivo:

- Atende o escopo sem aumentar complexidade com store global.
- Facilita comportamento de UI e teste de regra.

Trade-off:

- Em cenarios maiores, pode exigir evolucao para uma estrategia de estado mais ampla.

## Debounce e troca de requisicao na busca

Decisao:

- DebounceTime com DistinctUntilChanged e SwitchMap para busca por titulo.

Motivo:

- Evita requisicao a cada tecla.
- Mantem somente o fluxo mais recente ativo durante digitacao.

## Tratamento centralizado de erro HTTP

Decisao:

- Error interceptor para status comuns e acao padrao para 401.

Motivo:

- Comportamento consistente de erro em toda a aplicacao.
- Menos duplicacao de tratamento em cada chamada.

## Persistencia local para mutacoes de produto

Decisao:

- Atualizar estado local apos criar, editar ou excluir.

Motivo:

- A Fake Store API nao persiste mutacoes de escrita.
- A UI precisa refletir o que o usuario acabou de fazer.

Trade-off:

- O estado local pode divergir da API real em recarga completa da pagina.
- Para o escopo do teste, essa escolha e esperada e documentada.

## OnPush e boas praticas de performance

Decisao:

- Componentes com ChangeDetectionStrategy.OnPush como padrao.
- Async pipe para consumo de observables.
- Track por id nas listas principais.

Motivo:

- Reduz renderizacao desnecessaria.
- Mantem fluxo reativo e previsivel.

## Requisitos do PDF: status de atendimento

## Autenticacao

- Login integrado ao endpoint da API: atendido.
- Token de sessao armazenado e utilizado: atendido.
- Interceptor de auth: atendido.
- Guard de rotas privadas: atendido.
- Sessao invalida com logout e redirecionamento: atendido.

## CRUD de produtos

- Criar: atendido.
- Listar: atendido.
- Atualizar: atendido.
- Excluir com confirmacao: atendido.

## Listagem

- Paginacao: atendido.
- Filtros por titulo, preco minimo/maximo e categoria: atendido.
- Debounce na busca por titulo: atendido.
- Estados de loading, vazio, erro e retry: atendido.

## Arquitetura e qualidade

- Organizacao em camadas: atendido.
- Lazy loading: atendido.
- Responsividade: atendido.
- Tipagem forte: atendido.
- Tratamento centralizado de erro HTTP com feedback: atendido.
- Componentes desacoplados de filtros e paginacao: atendido.

## Diferenciais

- Testes unitarios: atendido.
- Docker multi-stage com Nginx: atendido.
- Multi-ambientes: atendido.

## Estrategia de testes

A cobertura atual privilegia comportamento de negocio em pontos de maior risco funcional:

- facade de produtos
- auth guard
- interceptors de autenticacao e erro
- facade de autenticacao

Isso ajuda a garantir estabilidade dos fluxos centrais de login e catalogo.

## Ambientes e configuracao

A API base e parametrizada em arquivos de ambiente.

- development
- production

Essa separacao facilita deploy e evita hardcode de URL espalhada em componentes.