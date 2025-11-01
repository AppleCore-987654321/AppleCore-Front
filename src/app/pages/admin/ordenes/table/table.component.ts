import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/api.service';
import { Subject, takeUntil } from 'rxjs';
import { OrderList } from '../../../../core/models/out/order.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    RouterModule,
    TableModule,
    ButtonModule,
    TagModule,
    CardModule,
    ProgressSpinnerModule,
    DialogModule,
    ExportDialogComponent
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnDestroy {
  ordenes: OrderList[] = [];
  loading: boolean = false;
  error: string | null = null;
  mostrarDialogoExportar = false;

  private destroy$ = new Subject<void>();

  constructor(private orderService: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'PROCESSING':
        return 'secondary';
      case 'SHIPPED':
        return 'help';
      case 'DELIVERED':
        return 'success';
      case 'CANCELED':
        return 'danger';
      default:
        return 'info';
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.ordenes = response.data || [];
          console.log('Ordenes cargadas:', this.ordenes);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al conectar con el servidor';
          console.error('Error:', err);
          this.loading = false;
        },
      });
  }

  generarReporte() {
    this.mostrarDialogoExportar = true;
  }

  cerrarDialogoExportar() {
    this.mostrarDialogoExportar = false;
  }

  refrescarOrdenes() {
    this.loadOrders();
  }
}
