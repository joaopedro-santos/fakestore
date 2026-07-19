import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFacade } from '../../facade/product.facade';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FiltersComponent, FilterState } from '../../../../shared/components/filters/filters.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Product } from '../../models/product.model';
import { ROUTES } from '../../../../core/constants/routes.constants';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, RouterLink, ProductCardComponent, EmptyStateComponent, FiltersComponent, LoadingComponent, PaginationComponent],
  templateUrl: './list.page.html',
  styleUrl: './list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPage implements OnInit {
  private readonly productFacade = inject(ProductFacade);
  private readonly router = inject(Router);

  protected readonly viewModel$ = this.productFacade.viewModel$;
  protected readonly createRoute = `/${ROUTES.PRODUCTS.ROOT}/${ROUTES.PRODUCTS.CREATE}`;
  protected readonly mobileFiltersOpen = signal(false);

  public ngOnInit(): void {
    this.productFacade.loadProducts();
  }

  protected onFiltersChange(filters: FilterState): void {
    this.productFacade.applyFilters({
      title: filters.title,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }

  protected onTitleFilterChange(filters: FilterState, title: string): void {
    this.onFiltersChange({
      ...filters,
      title,
    });
  }

  protected toggleMobileFilters(): void {
    this.mobileFiltersOpen.update((isOpen) => !isOpen);
  }

  protected onPageChange(page: number): void {
    this.productFacade.changePage(page);
  }

  protected onRetry(): void {
    this.productFacade.retry();
  }

  protected onOpenProduct(product: Product): void {
    this.router.navigate([`/${ROUTES.PRODUCTS.ROOT}/${product.id}`]);
  }
}
