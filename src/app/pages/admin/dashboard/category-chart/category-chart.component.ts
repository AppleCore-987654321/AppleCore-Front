import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/api.service';
import { CategorySales } from '../../../../core/models/stats.model';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.css']
})
export class CategoryChartComponent implements OnInit, OnDestroy {
  @Input() month: string | undefined; // formato YYYY-MM, si no se provee usará el mes actual
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  chartOptions: any = {};
  loading = true;
  hasData = false;
  private chartRef: Highcharts.Chart | undefined;

  constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.month) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      this.month = `${y}-${m}`;
    }

    this.loadData();
  }

  private loadData() {
    // Llamamos al mock local. Cuando tengas un endpoint real, reemplaza por la versión del backend.
    this.api.getCategorySales(this.month!).subscribe({
      next: (response: CategorySales[] | { data: CategorySales[] }) => {
        this.loading = false;

        // Si estás en mock, response es un array directo
        const data: CategorySales[] = Array.isArray(response)
          ? response
          : (response.data ?? []);

        this.hasData = data.length > 0;

        const seriesData = data.map(d => ({
          name: d.categoryName,
          y: d.sales
        }));

        const options: any = {
          chart: { type: 'pie', backgroundColor: 'transparent' },
          title: { text: `Categorías más vendidas (${this.month})` },
          tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} ventas)'
          },
          accessibility: { point: { valueSuffix: '%' } },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              },
              showInLegend: true
            }
          },
          series: [
            {
              type: 'pie',
              name: 'Ventas',
              colorByPoint: true,
              data: seriesData
            }
          ]
        };

        this.chartOptions = options as unknown as Highcharts.Options;

        try {
          this.cd.detectChanges();
          if (this.chartRef) {
            this.chartRef.update(options, true, true);
          } else if (this.chartContainer?.nativeElement) {
            this.chartRef = Highcharts.chart(this.chartContainer.nativeElement, options);
          } else {
            const el = document.getElementById('category-chart-container');
            if (el) this.chartRef = Highcharts.chart(el, options);
          }
          setTimeout(() => {
            try { window.dispatchEvent(new Event('resize')); } catch {}
          }, 50);
        } catch (e) {
          console.error('Error creando Highcharts:', e);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error cargando category sales:', err);
        this.hasData = false;
      }
    });

  }

  ngOnDestroy(): void {
    try {
      if (this.chartRef) {
        this.chartRef.destroy();
        this.chartRef = undefined;
      }
    } catch (e) {
      // noop
    }
  }
}
