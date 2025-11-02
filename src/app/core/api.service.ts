import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Models
import { RegisterRequest, RegisterResponse } from './models/out/auth.model';
import { Category, Product, UpdateProductRequest } from './models/products.model';
import { ApiResponse } from './models/common.model';
import { OrderList } from './models/out/order.model';
import { Customer } from './models/out/customer.model';

// Environment
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.useMockData
    ? environment.apiUrl
    : '';

  constructor(private http: HttpClient) {}

  private endpoint(path: string): string {
    // Asegura que no se dupliquen barras (//api)
    return `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  }

  // =====================================================
  // 🧩 AUTH
  // =====================================================

  /** Registro de usuario */
  public register(request: RegisterRequest): Observable<RegisterResponse> {
    const url = environment.useMockData ? '/register' : '/api/auth/register';
    return this.http.post<RegisterResponse>(this.endpoint(url), request);
  }

  /** Login de usuario */
  public login(credentials: { username: string; password: string }): Observable<any> {
    const url = environment.useMockData ? '/login' : '/api/auth/login';
    return this.http.post(this.endpoint(url), credentials);
  }

  // =====================================================
  // 🧩 PRODUCTS
  // =====================================================

  public getProducts(): Observable<Product[]> {
    const url = environment.useMockData ? '/products' : '/api/product/get';
    return this.http
      .get<ApiResponse<Product[]> | Product[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public getProduct(id: number): Observable<Product> {
    const url = environment.useMockData ? `/products/${id}` : `/api/product/get/${id}`;
    return this.http
      .get<ApiResponse<Product> | Product>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public createProduct(request: Product): Observable<Product> {
    const url = environment.useMockData ? '/products' : '/api/product/add';
    return this.http.post<Product>(this.endpoint(url), request);
  }

  public updateProduct(id: number, request: UpdateProductRequest): Observable<Product> {
    const url = environment.useMockData ? `/products/${id}` : `/api/product/edit/${id}`;
    return this.http
      .put<ApiResponse<Product> | Product>(this.endpoint(url), request)
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  // =====================================================
  // 🧩 CATEGORIES
  // =====================================================

  public getCategories(): Observable<Category[]> {
    const url = environment.useMockData ? '/categories' : '/api/category/get';
    return this.http
      .get<ApiResponse<Category[]> | Category[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  // =====================================================
  // 🧩 ORDERS
  // =====================================================

  public getOrders(): Observable<OrderList[]> {
    const url = environment.useMockData ? '/orders' : '/api/orders/get';
    return this.http
      .get<ApiResponse<OrderList[]> | OrderList[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public getOrderById(id: number): Observable<OrderList> {
    const url = environment.useMockData ? `/orders/${id}` : `/api/orders/get/${id}`;
    return this.http
      .get<ApiResponse<OrderList> | OrderList>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public createOrder(order: OrderList): Observable<OrderList> {
    const url = environment.useMockData ? '/orders' : '/api/orders/create';
    return this.http
      .post<ApiResponse<OrderList> | OrderList>(this.endpoint(url), order)
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public updateOrder(id: number, order: Partial<OrderList>): Observable<OrderList> {
    const url = environment.useMockData ? `/orders/${id}` : `/api/orders/edit/${id}`;
    return this.http
      .put<ApiResponse<OrderList> | OrderList>(this.endpoint(url), order)
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public deleteOrder(id: number): Observable<void> {
    const url = environment.useMockData ? `/orders/${id}` : `/api/orders/delete/${id}`;
    return this.http.delete<void>(this.endpoint(url));
  }

  public getOrdersByCustomer(id: number): Observable<OrderList[]> {
    const url = environment.useMockData
      ? `/orders?customerId=${id}`
      : `/api/orders/from/${id}`;
    return this.http
      .get<ApiResponse<OrderList[]> | OrderList[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  // =====================================================
  // 🧩 CUSTOMERS
  // =====================================================

  public getClientes(): Observable<Customer[]> {
    const url = environment.useMockData ? '/customers' : '/api/customer/get';
    return this.http
      .get<ApiResponse<Customer[]> | Customer[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public getClienteById(id: number): Observable<Customer> {
    const url = environment.useMockData ? `/customers/${id}` : `/api/customer/get/${id}`;
    return this.http
      .get<ApiResponse<Customer> | Customer>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public updateCliente(id: number, request: Customer): Observable<Customer> {
    const url = environment.useMockData ? `/customers/${id}` : `/api/customer/update/${id}`;
    return this.http
      .put<ApiResponse<Customer> | Customer>(this.endpoint(url), request)
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public deleteCliente(id: number): Observable<void> {
    const url = environment.useMockData ? `/customers/${id}` : `/api/customer/delete/${id}`;
    return this.http.delete<void>(this.endpoint(url));
  }

  // =====================================================
  // 🧩 STATS & DASHBOARD
  // =====================================================

  public getCategorySales(month: string): Observable<any[]> {
    const url = environment.useMockData
      ? `/categorySales?month=${month}`
      : `/api/stats/category-sales?month=${month}`;
    return this.http
      .get<ApiResponse<any[]> | any[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data : res)));
  }

  public getClientesCount(): Observable<number> {
    const url = environment.useMockData ? '/customers' : '/api/customer/get';
    return this.http
      .get<ApiResponse<Customer[]> | Customer[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data.length : res.length)));
  }

  public getProductosCount(): Observable<number> {
    const url = environment.useMockData ? '/products' : '/api/product/get';
    return this.http
      .get<ApiResponse<Product[]> | Product[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data.length : res.length)));
  }

  public getOrdenesCount(): Observable<number> {
    const url = environment.useMockData ? '/orders' : '/api/orders/get';
    return this.http
      .get<ApiResponse<OrderList[]> | OrderList[]>(this.endpoint(url))
      .pipe(map((res: any) => ('data' in res ? res.data.length : res.length)));
  }

  // =====================================================
  // 🧩 EXPORT
  // =====================================================

  public exportToExcel(filter: {
    module: string;
    fromDate: string;
    toDate: string;
    paymentMethod: any;
    orderStatus: any;
  }): Observable<Blob> {
    const url = this.endpoint('/api/export/excel');
    return this.http.post(url, filter, {
      responseType: 'blob',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set(
          'Accept',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ),
    });
  }
}
