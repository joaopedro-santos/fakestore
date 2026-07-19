import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductFacade } from '../../facade/product.facade';
import { Product } from '../../models/product.model';
import { ROUTES } from '../../../../core/constants/routes.constants';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    ConfirmDialogComponent,
    EmptyStateComponent,
    LoadingComponent,
  ],
  templateUrl: './detail.page.html',
  styleUrl: './detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productFacade = inject(ProductFacade);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly productsRoute = ROUTES.PRODUCTS.ROOT;
  protected readonly confirmingDelete = signal(false);

  protected readonly productId$: Observable<number> = this.activatedRoute.paramMap.pipe(
    map((params) => Number(params.get('id'))),
  );

  protected readonly product$: Observable<Product | null> = combineLatest([
    this.productId$,
    this.productFacade.state$,
  ]).pipe(
    map(([id, state]) => state.products.find((item) => item.id === id) ?? null),
  );

  protected readonly loading$: Observable<boolean> = this.productFacade.state$.pipe(
    map((state) => state.loading && !state.hasLoaded),
  );

  public ngOnInit(): void {
    this.productFacade.loadProducts();
  }

  protected onEditProduct(id: number): void {
    this.router.navigate([`/${ROUTES.PRODUCTS.ROOT}/${id}/edit`]);
  }

  protected askDelete(): void {
    this.confirmingDelete.set(true);
  }

  protected cancelDelete(): void {
    this.confirmingDelete.set(false);
  }

  protected confirmDelete(id: number): void {
    this.productFacade.deleteProduct(id).subscribe({
      next: () => {
        this.notificationService.success('Produto removido com sucesso.');
        this.confirmingDelete.set(false);
        this.router.navigate([`/${ROUTES.PRODUCTS.ROOT}`]);
      },
      error: () => {
        this.notificationService.error('Não foi possível remover o produto.');
      },
    });
  }
}
