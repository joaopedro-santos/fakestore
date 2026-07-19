import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductFacade } from '../../facade/product.facade';
import { CreateProductRequest } from '../../models/create-product-request.model';
import { ROUTES } from '../../../../core/constants/routes.constants';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, ProductFormComponent, RouterLink],
  templateUrl: './create.page.html',
  styleUrl: './create.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePage {
  private readonly productFacade = inject(ProductFacade);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly productsRoute = ROUTES.PRODUCTS.ROOT;

  protected onSubmit(payload: CreateProductRequest): void {
    this.productFacade.createProduct(payload).subscribe({
      next: () => {
        this.notificationService.success('Produto criado com sucesso.');
        this.router.navigate([`/${ROUTES.PRODUCTS.ROOT}`]);
      },
      error: () => {
        this.notificationService.error('Não foi possível criar o produto.');
      },
    });
  }
}
