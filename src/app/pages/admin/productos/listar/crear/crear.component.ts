import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import {Category} from '../../../../../core/models/products.model';
import {ApiService} from '../../../../../core/api.service';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FormsModule,
    InputNumberModule
  ],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class CrearComponent {
  @Output() onGuardar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  formProducto: FormGroup;
  loading: boolean = true;
  guardando: boolean = false;
  error: string | null = null;
  categorias: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.formProducto = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      details: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imgUrl: [''],
      status: [true],
      categoryId: [null]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response: Category[] | { data: Category[] }) => {
        // ✅ Soporta tanto mock (array) como backend real (objeto con data)
        this.categorias = Array.isArray(response)
          ? response
          : (response.data ?? []);

        console.log('Categorías cargadas:', this.categorias);
        this.loading = false;
      },

    });
  }

  guardarProducto() {
    if (this.formProducto.valid) {
      this.guardando = true;
      this.error = null;

      const newProduct = {
        ...this.formProducto.value,
        status: true // Por defecto activo
      };

      this.apiService.createProduct(newProduct).subscribe({
        next: () => {
          console.log('Producto creado exitosamente');
          this.guardando = false;
          this.onGuardar.emit();
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          this.error = 'Error al crear el producto';
          this.guardando = false;
        }
      });
    } else {
      Object.keys(this.formProducto.controls).forEach(key => {
        const control = this.formProducto.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  cancelar() {
    this.onCancelar.emit();
  }

  hasError(field: string): boolean {
    const control = this.formProducto.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.formProducto.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('min')) {
      return 'El valor debe ser mayor o igual a 0';
    }
    return '';
  }
}
