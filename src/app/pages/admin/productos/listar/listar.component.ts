import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {PaginatorModule} from 'primeng/paginator';
import {Subject, takeUntil} from 'rxjs';
import {ApiService} from '../../../../core/api.service';
import {Product} from '../../../../core/models/products.model';
import {CardModule} from 'primeng/card';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {EditarComponent} from './editar/editar.component';
import {CrearComponent} from './crear/crear.component';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    TagModule,
    ButtonModule,
    PaginatorModule,
    CardModule,
    ProgressSpinnerModule,
    EditarComponent,
    CrearComponent,
    DialogModule,
  ],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit, OnDestroy{
  productos: Product[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Variables para los modales
  mostrarModalEditar = false;
  mostrarModalCrear = false;
  productoSeleccionado: any = null;

  private destroy$ = new Subject<void>();

  constructor(private productService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.productos = response.data || [];
          console.log('Productos cargados:', this.productos);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al conectar con el servidor';
          console.error('Error:', err);
          this.loading = false;
        },
      });
  }

  editar(item: Product) {
    console.log('Editando producto, item completo:', item);
    if (item && item.id) {
      this.productoSeleccionado = item.id;
      console.log('ID seleccionado para editar:', this.productoSeleccionado);
      this.mostrarModalEditar = true;
      console.log('Modal de edición debería abrirse:', this.mostrarModalEditar);
    } else {
      console.error('Error: Intento de editar item sin ID', item);
    }
  }

  actualizarProducto() {
    console.log('Producto actualizado exitosamente');
    this.cerrarModalEditar();
    this.loadProducts(); // Recarga la lista para ver los cambios
  }

  crearProducto() {
    console.log('Abriendo modal de crear producto');
    this.mostrarModalCrear = true;
  }

  productoCreado() {
    console.log('Producto creado exitosamente');
    this.cerrarModalCrear();
    this.loadProducts(); // Recarga la lista para ver el nuevo producto
  }

  cerrarModalEditar() {
    console.log('Cerrando modal de edición');
    this.mostrarModalEditar = false;
    this.productoSeleccionado = null;
  }

  cerrarModalCrear() {
    console.log('Cerrando modal de crear');
    this.mostrarModalCrear = false;
  }
}
