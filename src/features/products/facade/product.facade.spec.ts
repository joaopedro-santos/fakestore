import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductFacade } from './product.facade';
import { ProductRepository } from '../../../infrastructure/repositories/product.repository';
import { Product } from '../models/product.model';

describe('ProductFacade', () => {
  let facade: ProductFacade;
  let productRepository: {
    getProducts: jest.Mock;
    getCategories: jest.Mock;
    createProduct: jest.Mock;
    updateProduct: jest.Mock;
    deleteProduct: jest.Mock;
  };

  const flushSearch = (): void => {
    jest.advanceTimersByTime(300);
  };

  const productFactory = (id: number): Product => ({
    id,
    title: `Produto ${id}`,
    price: 10 + id,
    description: 'Descrição',
    category: 'electronics',
    image: 'image.png',
  });

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.resetTestingModule();
    productRepository = {
      getProducts: jest.fn(),
      getCategories: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductFacade,
        { provide: ProductRepository, useValue: productRepository },
      ],
    });

    facade = TestBed.inject(ProductFacade);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve carregar a lista e atualizar o estado', () => {
    const products = [productFactory(1), productFactory(2)];
    productRepository.getProducts.mockReturnValue(of(products));

    facade.loadProducts();
    flushSearch();

    expect(productRepository.getProducts).toHaveBeenCalled();
    const state = facade['stateSubject'].getValue();
    expect(state.products).toHaveLength(2);
    expect(state.pagination.totalPages).toBe(1);
  });

  it('deve calcular totalPages com base no filtro aplicado', () => {
    const products = Array.from({ length: 9 }).map((_, index) =>
      productFactory(index + 1),
    );

    productRepository.getProducts.mockReturnValue(of(products));

    facade.loadProducts();
    flushSearch();

    const state = facade['stateSubject'].getValue();
    expect(state.pagination.totalPages).toBe(2);
  });

  it('deve criar um produto e refletir na lista local', () => {
    const createdProduct = productFactory(3);
    productRepository.createProduct.mockReturnValue(of(createdProduct));
    productRepository.getProducts.mockReturnValue(of([productFactory(1)]));

    facade.loadProducts();
    flushSearch();
    facade.createProduct({ title: 'Novo', price: 20, description: 'desc', category: 'electronics', image: 'img.png' }).subscribe();

    const state = facade['stateSubject'].getValue();
    expect(state.products[0]).toEqual(createdProduct);
  });

  it('deve editar um produto e manter a lista atualizada', () => {
    const updatedProduct = productFactory(1);
    updatedProduct.title = 'Atualizado';
    productRepository.updateProduct.mockReturnValue(of(updatedProduct));
    productRepository.getProducts.mockReturnValue(of([productFactory(1)]));

    facade.loadProducts();
    flushSearch();
    facade.updateProduct(1, { title: 'Atualizado', price: 11, description: 'desc', category: 'electronics', image: 'img.png' }).subscribe();

    const state = facade['stateSubject'].getValue();
    expect(state.products[0].title).toBe('Atualizado');
  });

  it('deve excluir um produto da lista local', () => {
    productRepository.deleteProduct.mockReturnValue(of(undefined));
    productRepository.getProducts.mockReturnValue(of([productFactory(1)]));

    facade.loadProducts();
    flushSearch();
    facade.deleteProduct(1).subscribe();

    const state = facade['stateSubject'].getValue();
    expect(state.products).toHaveLength(0);
  });

  it('deve aplicar filtros e paginação', () => {
    productRepository.getProducts.mockReturnValue(of([productFactory(1), productFactory(2)]));

    facade.loadProducts();
    flushSearch();
    facade.applyFilters({ title: '2', category: null, minPrice: null, maxPrice: null });
    flushSearch();
    facade.changePage(1);

    const state = facade['stateSubject'].getValue();
    expect(state.filters.title).toBe('2');
    expect(state.pagination.page).toBe(1);
    expect(state.pagination.totalPages).toBe(1);
  });

  it('deve carregar categorias para o formulário', () => {
    productRepository.getCategories.mockReturnValue(of(['electronics', 'jewelery']));

    facade.loadCategories();

    const state = facade['stateSubject'].getValue();
    expect(state.categories).toEqual(['electronics', 'jewelery']);
    expect(state.categoriesLoading).toBe(false);
  });

  it('deve tratar erro no carregamento', () => {
    productRepository.getProducts.mockReturnValue(throwError(() => new Error('boom')));

    facade.loadProducts();
    flushSearch();

    const state = facade['stateSubject'].getValue();
    expect(state.requestState).toBe('error');
  });
});
