import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../core/api.service';
import { OrderList } from '../../../../../core/models/out/order.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-editar-orden',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, DropdownModule, ToastModule],
  providers: [MessageService],
  templateUrl: './editar-orden.component.html',
  styleUrls: ['./editar-orden.component.css']
})
export class EditarOrdenComponent implements OnInit {
  ordenForm!: FormGroup;
  ordenId!: number;
  loading = false;

  orderStatuses = [
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Confirmada', value: 'CONFIRMED' },
    { label: 'Procesando', value: 'PROCESSING' },
    { label: 'Enviada', value: 'SHIPPED' },
    { label: 'Entregada', value: 'DELIVERED' },
    { label: 'Cancelada', value: 'CANCELED' }
  ];

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.ordenId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildForm();
    this.loadOrder();
  }

  private buildForm(): void {
    this.ordenForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      orderDate: ['', Validators.required],
      orderTotal: ['', Validators.required],
      deliveryPhone: [''],
      deliveryAddress: [''],
      observations: [''],
      orderStatus: ['', Validators.required]
    });
  }

  private loadOrder(): void {
    this.loading = true;
    this.apiService.getOrderById(this.ordenId).subscribe({
      next: (orden: OrderList) => {
        this.ordenForm.patchValue(orden);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar orden:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.ordenForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Completa los campos requeridos' });
      return;
    }

    this.loading = true;
    const updatedOrder: Partial<OrderList> = this.ordenForm.getRawValue();

    this.apiService.updateOrder(this.ordenId, updatedOrder).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Orden actualizada',
          detail: 'Los cambios se guardaron correctamente'
        });
        setTimeout(() => this.router.navigate(['/admin/ordenes']), 1000);
      },
      error: (err) => {
        console.error('❌ Error al actualizar orden:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la orden'
        });
      }
    });
  }
}
