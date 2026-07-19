import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductApiService } from '../api/product-api.service';
import { CreateProductRequest } from '../../features/products/models/create-product-request.model';
import { Product } from '../../features/products/models/product.model';
import { UpdateProductRequest } from '../../features/products/models/update-product-request.model';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository {
  constructor(private readonly productApiService: ProductApiService) {}

  public getProducts(): Observable<Product[]> {
    return this.productApiService.getProducts();
  }

  public getCategories(): Observable<string[]> {
    return this.productApiService.getCategories();
  }

  public getProductById(id: number): Observable<Product> {
    return this.productApiService.getProductById(id);
  }

  public createProduct(payload: CreateProductRequest): Observable<Product> {
    return this.productApiService.createProduct(payload);
  }

  public updateProduct(id: number, payload: UpdateProductRequest): Observable<Product> {
    return this.productApiService.updateProduct(id, payload);
  }

  public deleteProduct(id: number): Observable<void> {
    return this.productApiService.deleteProduct(id);
  }
}
