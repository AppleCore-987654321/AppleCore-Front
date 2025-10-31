import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../../../../core/api.service';
import { OrderStatus, PaymentMethod } from '../../../../../core/models/order.model';

@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DropdownModule
  ],
  template: `
    <div class="export-dialog p-fluid">
      <form [formGroup]="filterForm" (ngSubmit)="exportar()">
        <!-- Rango de fechas -->
        <div class="field mb-4">
          <label class="font-bold mb-2 block">Rango de Fechas</label>
          <p-calendar
            formControlName="dateRange"
            selectionMode="range"
            [showTime]="true"
            [showButtonBar]="true"
            dateFormat="dd/mm/yy"
            [style]="{'width':'100%'}"
            [inputStyle]="{'width':'100%'}"
            placeholder="Seleccione un rango de fechas"
            [showIcon]="true"
          ></p-calendar>
        </div>

        <div class="field mb-4">
          <label class="font-bold mb-2 block">Método de Pago</label>
          <p-dropdown
            formControlName="paymentMethod"
            [options]="paymentMethods"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione método de pago"
            [style]="{'width':'100%'}"
          ></p-dropdown>
        </div>

        <!-- Estado de orden -->
        <div class="field mb-4">
          <label class="font-bold mb-2 block">Estado de Orden</label>
          <p-dropdown
            formControlName="orderStatus"
            [options]="orderStatuses"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione estado"
            [style]="{'width':'100%'}"
          ></p-dropdown>
        </div>

        <!-- Botones -->
        <div class="flex gap-2 justify-content-end mt-4">
          <p-button
            label="Cancelar"
            icon="pi pi-times"
            (click)="cancelar()"
            styleClass="p-button-text"
            type="button"
          ></p-button>
          <p-button
            label="Exportar"
            icon="pi pi-download"
            type="submit"
            [loading]="loading"
          ></p-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .export-dialog {
        min-width: 450px;
        padding: 1.5rem;
      }

      .p-calendar {
        width: 100%;
      }

      .p-calendar .p-datepicker {
        min-width: 400px !important;
      }

      .p-datepicker table td {
        padding: 0.5rem;
      }

      .p-calendar .p-inputtext {
        width: 100%;
      }

      .p-dropdown {
        width: 100%;
      }

      .field {
        margin-bottom: 1.5rem;
      }

      label {
        margin-bottom: 0.5rem;
        display: block;
        font-weight: 600;
      }

      .p-button {
        min-width: 120px;
      }
    }
  `]
})
export class ExportDialogComponent implements OnInit {
  @Output() onCancel = new EventEmitter<void>();

  filterForm: FormGroup;
  loading = false;

  paymentMethods = [
    { label: 'Tarjeta de Crédito', value: PaymentMethod.CREDIT_CARD },
    { label: 'Tarjeta de Débito', value: PaymentMethod.DEBIT_CARD },
    { label: 'PayPal', value: PaymentMethod.PAYPAL },
    { label: 'Transferencia Bancaria', value: PaymentMethod.BANK_TRANSFER },
    { label: 'Pago Contra Entrega', value: PaymentMethod.CASH_ON_DELIVERY }
  ];

  orderStatuses = [
    { label: 'Pendiente', value: OrderStatus.PENDING },
    { label: 'Confirmada', value: OrderStatus.CONFIRMED },
    { label: 'En Proceso', value: OrderStatus.PROCESSING },
    { label: 'Enviada', value: OrderStatus.SHIPPED },
    { label: 'Entregada', value: OrderStatus.DELIVERED },
    { label: 'Cancelada', value: OrderStatus.CANCELED }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.filterForm = this.fb.group({
      dateRange: [null],
      paymentMethod: [null],
      orderStatus: [null]
    });
  }

  ngOnInit(): void {}

  exportar() {
    if (this.filterForm.valid) {
      this.loading = true;
      const dates = this.filterForm.get('dateRange')?.value;

      // Asegurar que las fechas tengan el formato correcto
      let fromDate = new Date();
      let toDate = new Date();

      if (dates?.[0]) {
        fromDate = dates[0];
        fromDate.setHours(0, 0, 0, 0); // Inicio del día
      }

      if (dates?.[1]) {
        toDate = dates[1];
        toDate.setHours(23, 59, 59, 999); // Fin del día
      }

      const filter = {
        module: 'orders',
        fromDate: fromDate.toISOString().split('.')[0], // Remover milisegundos
        toDate: toDate.toISOString().split('.')[0], // Remover milisegundos
        paymentMethod: this.filterForm.get('paymentMethod')?.value || null,
        orderStatus: this.filterForm.get('orderStatus')?.value || null
      };

      console.log('Enviando request de exportación:', filter);

      this.apiService.exportToExcel(filter).subscribe({
        next: (blob: Blob) => {
          console.log('Respuesta recibida:', blob);
          console.log('Tipo de blob:', blob.type);

          // Verificar que el blob no esté vacío y sea del tipo correcto
          if (blob.size === 0) {
            console.error('Blob vacío recibido');
            return;
          }

          try {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.loading = false;
            this.cancelar();
          } catch (e) {
            console.error('Error al procesar el archivo:', e);
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error al exportar:', err);
          console.error('Headers de la respuesta:', err.headers);
          console.error('Status:', err.status);
          console.error('Status Text:', err.statusText);

          // Si el error contiene un blob, intentar leerlo para más detalles
          if (err.error instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const text = reader.result as string;
                console.error('Contenido del error:', text);
                try {
                  const errorDetail = JSON.parse(text);
                  console.error('Detalle del error (JSON):', errorDetail);
                } catch (e) {
                  console.error('El contenido no es JSON válido');
                }
              } catch (e) {
                console.error('Error al leer detalle del error:', e);
              }
            };
            reader.readAsText(err.error);
          }
          this.loading = false;
        }
      });
    } else {
      console.warn('Formulario inválido:', this.filterForm.errors);
      Object.keys(this.filterForm.controls).forEach(key => {
        const control = this.filterForm.get(key);
        if (control?.invalid) {
          console.warn(`Control ${key} inválido:`, control.errors);
          control.markAsTouched();
        }
      });
    }
  }

  cancelar() {
    this.onCancel.emit();
  }
}
