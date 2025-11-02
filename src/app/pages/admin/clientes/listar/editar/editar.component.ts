import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../core/api.service';
import { Customer } from '../../../../../core/models/out/customer.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  clienteForm!: FormGroup;
  clienteId!: number;
  loading = false;
  error: string | null = null;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.clienteId) {
      this.error = 'ID de cliente inválido';
      return;
    }

    this.buildForm();
    this.loadCliente();
  }

  private buildForm(): void {
    this.clienteForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  private loadCliente(): void {
    this.loading = true;
    this.apiService.getClienteById(this.clienteId).subscribe({
      next: (cliente: Customer) => {
        this.clienteForm.patchValue(cliente);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar el cliente:', err);
        this.error = 'No se pudo cargar la información del cliente.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos obligatorios'
      });
      return;
    }

    const updatedData: Customer = {
      ...this.clienteForm.getRawValue()
    };

    this.loading = true;
    this.apiService.updateCliente(this.clienteId, updatedData).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Cliente actualizado',
          detail: 'Los datos del cliente se guardaron correctamente.'
        });
        setTimeout(() => this.router.navigate(['/admin/clientes']), 1000);
      },
      error: (err) => {
        console.error('❌ Error al actualizar cliente:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el cliente.'
        });
      }
    });
  }
}
