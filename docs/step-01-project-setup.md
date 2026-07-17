# Objetivo

Configurar um projeto Angular com arquitetura profissional, seguindo princípios de separação de responsabilidades e escalabilidade.

## Regras obrigatórias

- Utilizar Angular Standalone.
- Utilizar SCSS.
- Não utilizar Tailwind.
- Utilizar Angular Material.
- O projeto deve ser preparado para lazy loading.
- O projeto deve suportar desktop e mobile.
- Toda a aplicação deve ser fortemente tipada.
- Não utilizar any.
- O projeto deve seguir uma arquitetura baseada em features.

---

# Instalar dependências

Instalar:

- Angular Material.
- Jest.
- ngx-toastr.
- lodash-es.
- dayjs.

---

# Estrutura principal

Criar apenas as seguintes pastas:

```text
src/

├── core/
├── shared/
├── features/
├── infrastructure/
├── environments/
└── styles/
```

---

# Estrutura de estilos

Criar:

```text
styles/

├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _breakpoints.scss
│
├── base/
│   ├── _reset.scss
│   └── _typography.scss
│
└── theme/
```

---

# Tema

Criar variáveis globais para:

- cores primárias;
- cores secundárias;
- espaçamentos;
- bordas;
- breakpoints.

Não criar componentes ainda.

Não implementar regras de negócio.

Não criar telas.

Apenas preparar a base do projeto.