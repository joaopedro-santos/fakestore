# Fase 3 — Evolução do projeto para Ionic + Angular

## Objetivo

Evoluir a aplicação atual para uma experiência híbrida utilizando Ionic + Angular, mantendo toda a arquitetura já implementada.

O objetivo desta etapa não é reescrever o projeto do zero, mas adaptar a aplicação existente para funcionar corretamente em dispositivos móveis, aproveitando os recursos do ecossistema Ionic.

Esta implementação será tratada como um diferencial técnico do desafio.

---

# Regras obrigatórias

- NÃO recriar a arquitetura do projeto.
- NÃO alterar a estrutura atual de `core`, `shared` e `features`.
- NÃO remover serviços existentes.
- NÃO alterar regras de negócio já implementadas.
- NÃO utilizar `any`.
- Manter `ChangeDetectionStrategy.OnPush`.
- Manter lazy loading.
- Manter tipagem forte.

Toda a evolução deve ser incremental.

---

# Objetivos da migração

## 1. Instalar Ionic no projeto existente

Adicionar suporte ao Ionic Angular:

```bash
ng add @ionic/angular
```

Garantir compatibilidade com:

- Angular 20+
- Standalone Components
- Angular Router

---

## 2. Adaptar o layout principal

Converter o layout atual para a estrutura padrão do Ionic:

```html
<ion-app>
  <ion-router-outlet />
</ion-app>
```

Substituir apenas os containers principais.

Manter:

- Header customizado;
- Breadcrumbs;
- Tema claro/escuro;
- Navegação atual.

---

## 3. Criar experiência mobile nativa

O projeto deve funcionar corretamente em:

- Android;
- iPhone;
- Tablets.

Implementar:

- Safe Area;
- Suporte a notch;
- Scroll nativo;
- Gestos do Ionic.

Adicionar:

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

quando necessário.

---

## 4. Melhorar a navegação mobile

Substituir o menu mobile atual por um menu lateral do Ionic:

Sugestão:

```html
<ion-menu>
```

Requisitos:

- Abrir com hamburger;
- Fechar automaticamente;
- Funcionar com touch;
- Mostrar:

  - Dashboard;
  - Produtos;
  - Novo produto;
  - Logout.

---

## 5. Adaptar telas existentes

As seguintes páginas devem ser revisadas:

### Login

Melhorias:

- Centralização vertical;
- Inputs maiores;
- Melhor experiência touch;
- Teclado virtual não pode quebrar layout.

---

### Dashboard

Melhorias:

- Cards responsivos;
- Melhor espaçamento;
- Layout otimizado para telas pequenas.

---

### Produtos

Melhorias:

- Grid adaptável;
- Cards com melhor toque;
- Botões maiores;
- Scroll fluido.

---

### Criar produto

Melhorias:

- Campos maiores;
- Melhor upload de imagem;
- Melhor experiência mobile.

---

## 6. Recursos nativos opcionais

Caso exista tempo, implementar:

### Camera

Permitir tirar foto do produto:

```bash
npm install @capacitor/camera
```

Fluxo:

- Abrir câmera;
- Capturar imagem;
- Exibir preview;
- Salvar no estado local.

---

### Storage

Avaliar migração do token:

De:

```ts
localStorage
```

Para:

```ts
Preferences
```

do Capacitor.

---

## 7. Configurar Capacitor

Instalar:

```bash
npm install @capacitor/core
npm install @capacitor/cli
npm install @capacitor/android
```

Inicializar:

```bash
npx cap init
```

Adicionar Android:

```bash
npx cap add android
```

Sincronizar:

```bash
npx cap sync
```

---

## 8. Tema e Design System

IMPORTANTE:

Todos os componentes Ionic devem respeitar:

- variáveis CSS existentes;
- tema claro;
- tema escuro;
- sombras;
- bordas;
- tipografia.

Não criar um segundo sistema de estilos.

Continuar utilizando:

- --color-primary;
- --color-surface;
- --color-surface-elevated;
- --color-text;
- --color-border;
- --shadow-soft;
- --shadow-card.

---

## 9. Performance

Garantir:

- Lazy loading funcionando;
- OnPush funcionando;
- Async pipe;
- Scroll fluido;
- Sem memory leaks.

---

## 10. Estrutura esperada

A arquitetura final deve continuar semelhante a:

src/

├── core/

├── shared/

├── features/

│ ├── auth/

│ ├── dashboard/

│ └── products/

├── layouts/

├── styles/

└── app/

---

## 11. Critério principal

A migração para Ionic deve demonstrar:

- conhecimento de Angular;
- capacidade de adaptação para mobile;
- arquitetura escalável;
- preocupação com UX;
- entendimento do ecossistema híbrido.

A implementação deve parecer uma evolução natural da aplicação existente e não um novo projeto.