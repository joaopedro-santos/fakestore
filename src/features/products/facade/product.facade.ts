import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, BehaviorSubject, catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, tap, throwError } from 'rxjs';
import { ProductRepository } from '../../../infrastructure/repositories/product.repository';
import { CreateProductRequest } from '../models/create-product-request.model';
import { Product } from '../models/product.model';
import { ProductFilters } from '../models/product-filters.model';
import { ProductState, RequestState } from '../models/product-state.model';
import { UpdateProductRequest } from '../models/update-product-request.model';

export interface ProductViewModel extends ProductState {
  visibleProducts: Product[];
}

interface PaginationState {
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductFacade {
  private readonly stateSubject = new BehaviorSubject<ProductState>({
    products: [],
    hasLoaded: false,
    loading: false,
    error: null,
    empty: true,
    requestState: 'idle',
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
    pagination: {
      page: 1,
      pageSize: 8,
      total: 0,
      totalPages: 1,
    },
    filters: {
      title: '',
      category: null,
      minPrice: null,
      maxPrice: null,
    },
  });

  private readonly searchSubject = new Subject<string>();

  public readonly state$: Observable<ProductState> = this.stateSubject.asObservable();
  public readonly categories$: Observable<string[]> = this.state$.pipe(map((state) => state.categories));
  public readonly categoriesLoading$: Observable<boolean> = this.state$.pipe(map((state) => state.categoriesLoading));
  public readonly categoriesError$: Observable<string | null> = this.state$.pipe(map((state) => state.categoriesError));
  public readonly viewModel$: Observable<ProductViewModel> = this.state$.pipe(
    map((state) => ({
      ...state,
      visibleProducts: this.getVisibleProducts(state),
    })),
  );

  constructor(private readonly productRepository: ProductRepository) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((title) => this.requestProducts(title)),
    ).subscribe();
  }

  public loadProducts(): void {
    if (this.stateSubject.getValue().hasLoaded) {
      this.refreshFromLocalState();
      return;
    }

    this.searchSubject.next(this.stateSubject.getValue().filters.title);
  }

  public loadCategories(): void {
    const currentState = this.stateSubject.getValue();

    if (currentState.categories.length > 0 || currentState.categoriesLoading) {
      return;
    }

    this.stateSubject.next({
      ...currentState,
      categoriesLoading: true,
      categoriesError: null,
    });

    this.productRepository.getCategories().pipe(
      tap((categories) => {
        this.stateSubject.next({
          ...this.stateSubject.getValue(),
          categories,
          categoriesLoading: false,
          categoriesError: null,
        });
      }),
      catchError(() => {
        this.stateSubject.next({
          ...this.stateSubject.getValue(),
          categoriesLoading: false,
          categoriesError: 'Não foi possível carregar categorias.',
        });
        return EMPTY;
      }),
    ).subscribe();
  }

  public applyFilters(filters: ProductFilters): void {
    const currentState = this.stateSubject.getValue();

    if (currentState.hasLoaded) {
      this.stateSubject.next(
        this.buildState(
          currentState.products,
          filters,
          currentState.pagination,
          {
            forcePage: 1,
            loading: false,
            requestState: currentState.requestState,
            hasLoaded: true,
          },
        ),
      );
      return;
    }

    this.stateSubject.next({
      ...currentState,
      filters,
      pagination: {
        ...currentState.pagination,
        page: 1,
      },
    });

    this.searchSubject.next(filters.title);
  }

  public changePage(page: number): void {
    const currentState = this.stateSubject.getValue();
    const nextPage = Math.min(Math.max(1, page), currentState.pagination.totalPages);

    this.stateSubject.next({
      ...currentState,
      pagination: {
        ...currentState.pagination,
        page: nextPage,
      },
    });
  }

  public retry(): void {
    this.loadProducts();
  }

  public clearFilters(): void {
    const currentState = this.stateSubject.getValue();
    const nextFilters = {
      title: '',
      category: null,
      minPrice: null,
      maxPrice: null,
    };

    if (currentState.hasLoaded) {
      this.stateSubject.next(
        this.buildState(
          currentState.products,
          nextFilters,
          currentState.pagination,
          {
            forcePage: 1,
            loading: false,
            requestState: currentState.requestState,
            hasLoaded: true,
          },
        ),
      );
      return;
    }

    this.stateSubject.next({
      ...currentState,
      filters: nextFilters,
      pagination: {
        ...currentState.pagination,
        page: 1,
      },
    });

    this.searchSubject.next(nextFilters.title);
  }

  public createProduct(payload: CreateProductRequest): Observable<Product> {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({
      ...currentState,
      loading: true,
      error: null,
      requestState: 'loading' as RequestState,
    });

    return this.productRepository.createProduct(payload).pipe(
      tap((product: Product) => {
        const nextProducts = [product, ...currentState.products];
        const nextState = this.buildState(nextProducts, currentState.filters, currentState.pagination, {
          forcePage: 1,
          loading: false,
          requestState: 'success',
          hasLoaded: true,
        });
        this.stateSubject.next({
          ...nextState,
          loading: false,
          requestState: nextState.empty ? 'empty' : 'success',
        });
      }),
      catchError(() => {
        this.stateSubject.next({
          ...currentState,
          loading: false,
          requestState: 'error' as RequestState,
          error: 'Erro ao criar produto.',
        });
        return throwError(() => new Error('Erro ao criar produto.'));
      }),
      finalize(() => {
        this.stateSubject.next({
          ...this.stateSubject.getValue(),
          loading: false,
        });
      }),
    );
  }

  public updateProduct(id: number, payload: UpdateProductRequest): Observable<Product> {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({
      ...currentState,
      loading: true,
      error: null,
      requestState: 'loading' as RequestState,
    });

    return this.productRepository.updateProduct(id, payload).pipe(
      tap((product: Product) => {
        const nextProducts = currentState.products.map((item) => (item.id === id ? { ...item, ...product } : item));
        const nextState = this.buildState(nextProducts, currentState.filters, currentState.pagination, {
          loading: false,
          requestState: 'success',
          hasLoaded: true,
        });
        this.stateSubject.next({
          ...nextState,
          loading: false,
          requestState: nextState.empty ? 'empty' : 'success',
        });
      }),
      catchError(() => {
        this.stateSubject.next({
          ...currentState,
          loading: false,
          requestState: 'error' as RequestState,
          error: 'Erro ao atualizar produto.',
        });
        return throwError(() => new Error('Erro ao atualizar produto.'));
      }),
      finalize(() => {
        this.stateSubject.next({
          ...this.stateSubject.getValue(),
          loading: false,
        });
      }),
    );
  }

  public deleteProduct(id: number): Observable<void> {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({
      ...currentState,
      loading: true,
      error: null,
      requestState: 'loading' as RequestState,
    });

    return this.productRepository.deleteProduct(id).pipe(
      tap(() => {
        const nextProducts = currentState.products.filter((product) => product.id !== id);
        const nextState = this.buildState(nextProducts, currentState.filters, currentState.pagination, {
          loading: false,
          requestState: 'success',
          hasLoaded: true,
        });
        this.stateSubject.next({
          ...nextState,
          loading: false,
          requestState: nextState.empty ? 'empty' : 'success',
        });
      }),
      catchError(() => {
        this.stateSubject.next({
          ...currentState,
          loading: false,
          requestState: 'error' as RequestState,
          error: 'Erro ao excluir produto.',
        });
        return throwError(() => new Error('Erro ao excluir produto.'));
      }),
      finalize(() => {
        this.stateSubject.next({
          ...this.stateSubject.getValue(),
          loading: false,
        });
      }),
    );
  }

  public getFilteredProducts(): Product[] {
    return this.getVisibleProducts(this.stateSubject.getValue());
  }

  private requestProducts(title: string): Observable<Product[]> {
    const currentState = this.stateSubject.getValue();
    const nextFilters = {
      ...currentState.filters,
      title,
    };

    this.stateSubject.next({
      ...currentState,
      filters: nextFilters,
      loading: true,
      error: null,
      empty: false,
      requestState: 'loading' as RequestState,
    });

    return this.productRepository.getProducts().pipe(
      tap((products: Product[]) => {
        const nextState = this.buildState(products, nextFilters, currentState.pagination, {
          forcePage: 1,
          loading: false,
          requestState: 'success',
          hasLoaded: true,
        });
        this.stateSubject.next({
          ...nextState,
          loading: false,
          requestState: nextState.empty ? 'empty' : 'success',
          error: null,
        });
      }),
      catchError(() => {
        this.stateSubject.next({
          ...this.stateSubject.getValue(),
          loading: false,
          requestState: 'error' as RequestState,
          error: 'Não foi possível carregar os produtos.',
          empty: false,
        });
        return EMPTY;
      }),
      finalize(() => {
        const latestState = this.stateSubject.getValue();
        if (latestState.requestState !== 'error') {
          this.stateSubject.next({
            ...latestState,
            loading: false,
          });
        }
      }),
    );
  }

  private getVisibleProducts(state: ProductState): Product[] {
    const filtered = this.filterProducts(state.products, state.filters);

    return filtered.slice(
      (state.pagination.page - 1) * state.pagination.pageSize,
      state.pagination.page * state.pagination.pageSize,
    );
  }

  private filterProducts(products: Product[], filters: ProductFilters): Product[] {
    return products.filter((product) => {
      const matchesTitle = product.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchesCategory = filters.category ? product.category === filters.category : true;
      const matchesMinPrice = filters.minPrice !== null ? product.price >= filters.minPrice : true;
      const matchesMaxPrice = filters.maxPrice !== null ? product.price <= filters.maxPrice : true;

      return matchesTitle && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  private refreshFromLocalState(): void {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next(
      this.buildState(currentState.products, currentState.filters, currentState.pagination, {
        loading: false,
        requestState: currentState.requestState,
        hasLoaded: true,
      }),
    );
  }

  private buildState(
    products: Product[],
    filters: ProductFilters,
    pagination: PaginationState,
    options: {
      forcePage?: number;
      loading: boolean;
      requestState: RequestState;
      hasLoaded: boolean;
    },
  ): ProductState {
    const filteredProducts = this.filterProducts(products, filters);
    const empty = filteredProducts.length === 0;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pagination.pageSize));
    const page = options.forcePage ?? Math.min(Math.max(1, pagination.page), totalPages);
    const currentState = this.stateSubject.getValue();

    return {
      products,
      hasLoaded: options.hasLoaded,
      loading: options.loading,
      error: null,
      empty,
      requestState: empty ? 'empty' : options.requestState,
      categories: currentState.categories,
      categoriesLoading: currentState.categoriesLoading,
      categoriesError: currentState.categoriesError,
      pagination: {
        page,
        pageSize: pagination.pageSize,
        total: filteredProducts.length,
        totalPages,
      },
      filters,
    };
  }
}
