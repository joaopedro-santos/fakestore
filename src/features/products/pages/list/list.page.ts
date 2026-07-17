import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-list-page',
  template: `
    <section class="page-card">
      <h2>Produtos</h2>
      <p>Lista de produtos em construção.</p>
    </section>
  `,
  styles: [
    `
      .page-card {
        padding: 2rem;
        border-radius: var(--radius-lg);
        background: white;
        box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPage {}
