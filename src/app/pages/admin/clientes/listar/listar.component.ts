import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/api.service';
import { Customer } from '../../../../core/models/out/customer.model';
import {Card} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Button, ButtonDirective} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  standalone: true, // ✅ recomendado en Angular moderno
  imports: [
    Card,
    TableModule,
    Tag,
    Button,
    ProgressSpinner,
    ButtonDirective
  ] // aquí puedes importar PrimeNG Modules o CommonModule si usas Standalone Components
})
export class ListarClientesComponent implements OnInit {
  clientes: Customer[] = [];
  loading = false;
  error: string | null = null;

  private router = inject(Router);
  private apiService = inject(ApiService);
  private destroy$ = new Subject<void>();
  ngOnInit() {
    this.loadClientes();
  }

  loadClientes(): void {
    // 1. Inicia el estado de carga y limpia el error previo
    this.loading = true;
    this.error = null;

    this.apiService
      .getClientes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          console.log('Clientes cargados:', this.clientes);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los clientes.';
          console.error('Error fetching clients:', err);
          this.loading = false;
        },
      });

  }

  editarCliente(cliente: Customer) {
    this.router.navigate(['clientes/editar', cliente.id]);
  }

  eliminarCliente(cliente: Customer): void {
    if (confirm('¿Está seguro? Esta acción no se puede deshacer.')) {
      this.apiService.deleteCliente(cliente.id).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.id !== cliente.id);
          alert('Cliente eliminado correctamente.');
        },
        error: (err) => {
          console.error('❌ Error al eliminar cliente:', err);
          alert('No se pudo eliminar el cliente.');
        }
      });
    }
  }
}
