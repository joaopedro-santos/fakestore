import { Product } from './product.model';
import { ProductFilters } from './product-filters.model';

export type RequestState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface ProductState {
  products: Product[];
  hasLoaded: boolean;
  loading: boolean;
  error: string | null;
  empty: boolean;
  requestState: RequestState;
  categories: string[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: ProductFilters;
}
