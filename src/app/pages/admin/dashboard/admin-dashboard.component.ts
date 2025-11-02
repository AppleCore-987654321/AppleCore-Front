import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { ApiService } from '../../../core/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    AccordionModule,
    CardModule,
    DividerModule,
    TagModule,
    CategoryChartComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  clientesCount = 0;
  ordenesCount = 0;
  productosCount = 0;
  loading = true;

  private api = inject(ApiService);

  ngOnInit(): void {
    this.loadCounts();
  }

  private loadCounts(): void {
    forkJoin({
      clientes: this.api.getClientesCount(),
      productos: this.api.getProductosCount(),
      ordenes: this.api.getOrdenesCount()
    }).subscribe({
      next: (result) => {
        this.clientesCount = result.clientes;
        this.productosCount = result.productos;
        this.ordenesCount = result.ordenes;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar contadores:', err);
        this.loading = false;
      }
    });
  }
}
