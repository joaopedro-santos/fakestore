import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <section class="empty-state">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </section>
  `,
  styles: [
    `
      .empty-state {
        padding: 2rem;
        text-align: center;
        border: 1px dashed var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input() public title: string = 'Sem conteúdo';
  @Input() public description: string = 'Ainda não há itens para exibir.';
}
