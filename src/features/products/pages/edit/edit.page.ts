import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductFacade } from '../../facade/product.facade';
import { Product } from '../../models/product.model';
import { UpdateProductRequest } from '../../models/update-product-request.model';
import { ROUTES } from '../../../../core/constants/routes.constants';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatCardModule, ProductFormComponent, RouterLink, LoadingComponent],
  templateUrl: './edit.page.html',
  styleUrl: './edit.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productFacade = inject(ProductFacade);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly productsRoute = ROUTES.PRODUCTS.ROOT;
  protected readonly product$: Observable<Product | null> = combineLatest([
    this.activatedRoute.paramMap,
    this.productFacade.state$,
  ]).pipe(
    map(([params, state]) => {
      const id = Number(params.get('id'));
      return state.products.find((item) => item.id === id) ?? null;
    }),
  );

  public ngOnInit(): void {
    this.productFacade.loadProducts();
  }

  protected onSubmit(id: number, payload: UpdateProductRequest): void {
    this.productFacade.updateProduct(id, payload).subscribe({
      next: () => {
        this.notificationService.success('Produto atualizado com sucesso.');
        this.router.navigate([`/${ROUTES.PRODUCTS.ROOT}`]);
      },
      error: () => {
        this.notificationService.error('Não foi possível atualizar o produto.');
      },
    });
  }
}
