import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <section class="confirm-dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </section>
  `,
  styles: [
    `
      .confirm-dialog {
        padding: 1.5rem;
        border-radius: var(--radius-md);
        background: white;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  @Input() public title: string = 'Confirmar ação';
  @Input() public message: string = 'Deseja continuar?';
}
