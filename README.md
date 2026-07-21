# Suzantur Products

Aplicacao web para gerenciamento de produtos, desenvolvida em Angular e integrada a Fake Store API.

## Resumo rapido

- Stack principal: Angular 21, Angular Material, RxJS e Jest.
- Autenticacao com guard + interceptor.
- CRUD de produtos com filtros, debounce e paginacao.
- Tratamento de erros centralizado.
- Multi-ambiente configurado.
- Docker multi-stage com entrega via Nginx.

## Como executar

### Pré-requisitos

- Node.js 20+
- npm 11+

### Ambiente local

1. Instale as dependencias:

	 npm install

2. Rode o projeto:

	 npm start

3. Acesse:

	 http://localhost:4200

### Build

- Build de desenvolvimento:

	npm run build:dev

- Build de producao:

	npm run build:prod

O artefato final fica em dist/suzantur-products/browser.

### Testes

Executar suite completa:

npm test

### Subir com Docker

Subir aplicacao com compose:

docker compose up --build

Aplicacao disponivel em:

http://localhost:8080

## Credenciais de login para teste

As credenciais oficiais de teste sao as fornecidas pela propria Fake Store API na documentacao publica.

Login: mor_2314
Senha: 83r5^_

Referencia:
https://fakestoreapi.com/docs

## Arquitetura e organizacao de pastas

O projeto foi dividido em camadas para manter regras de negocio separadas de detalhes de UI e infraestrutura.

- src/core
	- Constantes, guards, interceptors, servicos de sessao/armazenamento/notificacao e modelos transversais.
- src/features
	- Modulos de negocio por dominio (auth, dashboard, products), cada um com suas paginas, facades, modelos e componentes.
- src/infrastructure
	- Camada de acesso a API e repositorios, encapsulando chamadas HTTP.
- src/shared
	- Componentes reutilizaveis e desacoplados de feature (filtros, paginacao, loading, empty state, dialogos, layouts, diretivas).
- src/environments
	- Configuracoes por ambiente, com API URL parametrizada.

### Fluxo de dados adotado

1. A pagina interage com uma facade.
2. A facade concentra estado e regras da feature.
3. A facade chama o repositorio.
4. O repositorio delega para o servico de API.
5. Interceptors tratam autenticacao e erros em um ponto central.

Esse desenho reduz acoplamento na UI e facilita evolucao, testes e manutencao.

## Atendimento aos requisitos da entrega

### 1) Autenticacao

- Tela de login integrada ao endpoint de autenticacao: atendido.
- Armazenamento e gestao de token: atendido.
- Interceptor para injetar token: atendido.
- Guard protegendo rotas privadas: atendido.
- Tratamento de sessao invalida/expirada com logout e redirecionamento: atendido.

### 2) CRUD de Produtos

- Criacao de produto: atendido.
- Listagem de produtos: atendido.
- Atualizacao de produto: atendido.
- Exclusao com confirmacao: atendido.

Observacao importante sobre a Fake Store API:

Como a API nao persiste mutacoes, a aplicacao aplica as operacoes de criar, editar e excluir no estado local da facade. Em outras palavras, a API confirma a operacao e a interface reflete a mudanca imediatamente no estado em memoria.

### 3) Listagem e criterios de aceitacao

- Paginacao: atendido.
- Filtros por titulo, faixa de preco e categoria: atendido.
- Debounce na busca por titulo: atendido (300ms).
- Estados de interface (loading, vazio, erro com retry): atendido.

### 4) Arquitetura e qualidade de codigo

- Organizacao em camadas: atendido.
- Lazy loading nas features: atendido.
- Responsividade desktop/mobile: atendido.
- Tipagem forte sem any na regra de negocio: atendido.
- Tratamento centralizado de erros HTTP com feedback ao usuario: atendido.
- Componentes reutilizaveis para filtros e paginacao: atendido.

Ponto de atencao:

- Boas praticas de performance estao amplamente aplicadas (OnPush, track por id em listas relevantes, uso de switchMap e async pipe). A validacao de cobertura completa de todos os cenarios de concorrencia e memoria pode crescer junto com novos casos de uso.

## Decisoes tecnicas e trade-offs

### Estado local na facade para produtos

Opcao feita:

- Manter estado de produtos, filtros, paginacao e estados de requisicao dentro de uma facade baseada em RxJS.

Por que foi escolhida:

- Resolve bem a necessidade atual sem introduzir complexidade de uma biblioteca global de estado.
- Facilita testes e previsibilidade de comportamento da tela.

Trade-off:

- Em cenarios com multiplas features compartilhando muito estado global, pode valer migrar para uma estrategia dedicada de store.

### Interceptors para autenticacao e erro

Opcao feita:

- Centralizar injecao de token e respostas de erro em interceptors.

Por que foi escolhida:

- Evita repeticao de codigo nas chamadas HTTP.
- Garante comportamento consistente para sessao invalida e mensagens de erro.

Trade-off:

- Exige cuidado para nao transformar interceptor em ponto de excesso de responsabilidade.

### Repositorio sobre servico de API

Opcao feita:

- Camada de repositorio entre facade e API.

Por que foi escolhida:

- Separa acesso remoto da regra de negocio.
- Mantem caminho aberto para cache, troca de provider ou adaptacoes futuras sem impactar a UI.

Trade-off:

- Adiciona uma camada a mais no fluxo e exige disciplina para nao virar simples repasse sem valor.

### Angular Material para base de UI

Opcao feita:

- Uso de componentes Material combinados com estilos customizados e tema claro/escuro.

Por que foi escolhida:

- Entrega produtividade e consistencia de acessibilidade visual.
- Permite focar energia na regra de negocio e nos estados de tela.

Trade-off:

- Componentes do Material pedem override de estilo em alguns casos para seguir identidade visual propria.

## Bibliotecas de terceiros e motivo de uso

- @angular/material e @angular/cdk
	- Base de componentes e interacoes de interface, com comportamento consistente.
- rxjs
	- Orquestracao de fluxos assíncronos, debounce, troca de requisicao e transformacao de estado.
- jest, jest-preset-angular, jest-environment-jsdom
	- Execucao de testes unitarios com boa velocidade e ergonomia.

Dependencias auxiliares instaladas no projeto (nao centrais para os fluxos principais desta entrega): dayjs, lodash-es e ngx-toastr.

## Qualidade e testes

A suite atual cobre pontos de comportamento relevantes, incluindo:

- facade de produtos
- guard de autenticacao
- interceptors de auth e erro
- facade de autenticacao
- componentes compartilhados

## Ambientes

Arquivos de ambiente:

- src/environments/environment.ts
- src/environments/environment.production.ts

Variavel principal usada no acesso a API:

- apiUrl

## Deploy

O projeto possui Dockerfile multi-stage:

1. Etapa builder com Node para gerar o build de producao.
2. Etapa final com Nginx servindo os arquivos estaticos.

## Screenshots

### Dashboard

<img width="1558" alt="image" src="https://github.com/user-attachments/assets/3fb540a3-d26d-45e5-960b-26c9a67b1579" />

### Produtos

<img width="1000" alt="image" src="https://github.com/user-attachments/assets/3f49b047-c207-49c9-9d49-5107eb6e6897" />
<img width="1000" alt="image" src="https://github.com/user-attachments/assets/a95f35b8-6f8e-44a7-9bff-19fc8c51a875" />
<img width="1000" alt="image" src="https://github.com/user-attachments/assets/783dacd0-34e9-46d0-9026-813eac3b57cc" />
<img width="1000" alt="image" src="https://github.com/user-attachments/assets/b899594d-bcdb-4736-ab96-325bc5971dab" />

### Mobile
<img width="231" alt="image" src="https://github.com/user-attachments/assets/728f8072-1122-43d7-95de-a65680970ae1" />
<img width="231" alt="image" src="https://github.com/user-attachments/assets/f49f48cf-9989-4574-9903-fac64ebb5dc0" />
<img width="230" alt="image" src="https://github.com/user-attachments/assets/a24a08a5-8a8f-4483-8bea-8400951e8bbc" />
<img width="230" alt="image" src="https://github.com/user-attachments/assets/4e61d3bc-d180-4d11-bd60-486a3d627de6" />
<img width="231" alt="image" src="https://github.com/user-attachments/assets/3bfb281c-99d8-4de6-b088-b0716d7f2597" />
<img width="230" alt="image" src="https://github.com/user-attachments/assets/8062462a-6b9f-4a31-9fb8-26d476fde9ce" />
<img width="230" alt="image" src="https://github.com/user-attachments/assets/2924e57b-37c1-43c0-abb5-a2efb4300750" />
<img width="231" alt="image" src="https://github.com/user-attachments/assets/ae208ab7-64aa-46a7-b258-8de96965e957" />








Tambem existe docker-compose para facilitar subida local do container.
