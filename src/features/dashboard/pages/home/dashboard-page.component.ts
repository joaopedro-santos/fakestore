import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductFacade } from '../../../../features/products/facade/product.facade';
import { ROUTES } from '../../../../core/constants/routes.constants';

interface DashboardStats {
  totalProducts: number;
  availableCategories: number;
  lastProductTitle: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly productFacade = inject(ProductFacade);

  protected readonly stats$ = this.productFacade.state$.pipe(
    map((state): DashboardStats => ({
      totalProducts: state.products.length,
      availableCategories: state.categories.length,
      lastProductTitle: state.products[0]?.title ?? 'Nenhum produto cadastrado',
    })),
  );

  protected readonly productsRoute = `/${ROUTES.PRODUCTS.ROOT}`;
  protected readonly createProductRoute = `/${ROUTES.PRODUCTS.ROOT}/${ROUTES.PRODUCTS.CREATE}`;

  public ngOnInit(): void {
    this.productFacade.loadProducts();
    this.productFacade.loadCategories();
  }
}
