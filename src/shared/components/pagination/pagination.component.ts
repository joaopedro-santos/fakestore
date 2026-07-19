import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input({ required: true }) public page!: number;
  @Input({ required: true }) public totalPages!: number;

  @Output() public readonly pageChange = new EventEmitter<number>();

  protected previous(): void {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  protected next(): void {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }
}
