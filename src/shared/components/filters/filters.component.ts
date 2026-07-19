import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyMaskDirective } from '../../directives/currency-mask.directive';

export interface FilterState {
  title: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, CurrencyMaskDirective],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  @Input({ required: true }) public filters!: FilterState;
  @Input() public titleVisibility: 'all' | 'mobile-only' | 'hidden' = 'all';
  @Output() public readonly filtersChange = new EventEmitter<FilterState>();

  protected onTitleChange(title: string): void {
    this.filtersChange.emit({ ...this.filters, title });
  }

  protected onCategoryChange(category: string | null): void {
    this.filtersChange.emit({ ...this.filters, category });
  }

  protected onMinPriceChange(minPrice: number | null): void {
    this.filtersChange.emit({ ...this.filters, minPrice });
  }

  protected onMaxPriceChange(maxPrice: number | null): void {
    this.filtersChange.emit({ ...this.filters, maxPrice });
  }
}
