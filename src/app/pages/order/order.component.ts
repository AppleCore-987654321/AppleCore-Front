import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {OrderList} from '../../core/models/out/order.model';
import {ApiService} from '../../core/api.service';
import {ItemComponent} from './item/item.component';

@Component({
  selector: 'app-orders',
  templateUrl: './order.component.html',
  imports: [
    ItemComponent
  ],
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  ordenes: OrderList[] = [];
  loading: boolean = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private orderService: ApiService) {}

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    const customerId = localStorage.getItem('customerId');

    if (!customerId) {
      this.error = 'No se encontró el ID del cliente';
      console.error('customerId no disponible');
      return;
    }

    this.loading = true;
    this.error = null;

    this.orderService.getOrdersByCustomer(Number(customerId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // 🔹 Soporta tanto mock (array) como backend real ({ data: [] })
          this.ordenes = Array.isArray(response)
            ? response
            : response.data || [];

          console.log('Órdenes cargadas:', this.ordenes);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al conectar con el servidor';
          console.error('Error:', err);
          this.loading = false;
        }
      });
  }

}
