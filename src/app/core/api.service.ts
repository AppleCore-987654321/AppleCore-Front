import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RegisterRequest} from './models/auth.model';
import {Category, Product, UpdateProductRequest} from './models/products.model';
import {environment} from '../../enviroment';
import {ApiResponse} from './models/common.model';
import {OrderList} from './models/order.model';
import {Customer} from './models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  // Auth Methods
  public register(request: RegisterRequest): Observable<RegisterRequest> {
    return this.http.post<RegisterRequest>(
      `${this.apiUrl}/auth/register`,
      request
    );
  }

  // Products Methods
  public getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/get`);
  }

  public getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/get/${id}`);
  }

  public createProduct(request: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/add`, request);
  }

  public updateProduct(id: number, request: UpdateProductRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/product/edit/${id}`, request);
  }

  // Categories
  public getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category/get`);
  }

  // Orders
  public getOrders(): Observable<ApiResponse<OrderList[]>> {
    return this.http.get<ApiResponse<OrderList[]>>(`${this.apiUrl}/orders/get`);
  }

  public getOrdersByCustomer(id: number): Observable<ApiResponse<OrderList[]>> {
    return this.http.get<ApiResponse<OrderList[]>>(
      `${this.apiUrl}/orders/from/${id}`
    );
  }

  public getOrderById(id: number): Observable<ApiResponse<OrderList>> {
    return this.http.get<ApiResponse<OrderList>>(
      `${this.apiUrl}/orders/get/${id}`
    );
  }

  // Customers
  public getClientes(): Observable<ApiResponse<Customer[]>> {
    return this.http.get<ApiResponse<Customer[]>>(`${this.apiUrl}/customer/get`);
  }

  public getClienteById(id: number): Observable<ApiResponse<Customer>> {
    return this.http.get<ApiResponse<Customer>>(
      `${this.apiUrl}/customer/get/${id}`
    );
  }

  public deleteCliente(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/customer/delete/${id}`
    );
  }

  public updateCliente(
    id: number,
    request: Customer
  ): Observable<ApiResponse<Customer>> {
    return this.http.put<ApiResponse<Customer>>(
      `${this.apiUrl}/Customer/update/${id}`,
      request
    );
  }

  // Export Methods
  public exportToExcel(filter: {
    module: string;
    fromDate: string;
    toDate: string;
    paymentMethod: any;
    orderStatus: any
  }): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/excel`, filter, {
      responseType: 'blob',
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    });
  }
}
