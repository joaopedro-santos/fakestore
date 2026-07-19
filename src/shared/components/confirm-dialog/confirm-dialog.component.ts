import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  @Input() public title: string = 'Confirmar ação';
  @Input() public message: string = 'Deseja continuar?';

  @Output() public readonly confirm = new EventEmitter<void>();
  @Output() public readonly cancel = new EventEmitter<void>();
}
