import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ProductFacade } from '../../facade/product.facade';
import { Product } from '../../models/product.model';
import { CreateProductRequest } from '../../models/create-product-request.model';
import { UpdateProductRequest } from '../../models/update-product-request.model';
import { CurrencyMaskDirective } from '../../../../shared/directives/currency-mask.directive';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    CurrencyMaskDirective,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productFacade = inject(ProductFacade);

  @Input() public product: Product | null = null;
  @Output() public readonly submitForm = new EventEmitter<CreateProductRequest | UpdateProductRequest>();

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    category: ['', Validators.required],
    image: ['', Validators.required],
  });

  protected readonly categories$ = this.productFacade.categories$;
  protected readonly categoriesLoading$ = this.productFacade.categoriesLoading$;
  protected readonly categoriesError$ = this.productFacade.categoriesError$;
  protected readonly imagePreview = signal<string | null>(null);

  public ngOnInit(): void {
    this.productFacade.loadCategories();

    if (this.product) {
      this.form.patchValue({
        title: this.product.title,
        price: this.product.price,
        description: this.product.description,
        category: this.product.category,
        image: this.product.image,
      });
      this.imagePreview.set(this.product.image);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.form.getRawValue());
  }

  protected reloadCategories(): void {
    this.productFacade.loadCategories();
  }

  protected onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        return;
      }

      this.form.controls.image.setValue(result);
      this.imagePreview.set(result);
      this.form.controls.image.markAsDirty();
      this.form.controls.image.markAsTouched();
    };

    reader.readAsDataURL(file);
  }

  protected removeImage(): void {
    this.form.controls.image.setValue('');
    this.imagePreview.set(null);
  }
}
