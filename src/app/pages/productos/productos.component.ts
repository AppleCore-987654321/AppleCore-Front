import { Component, OnInit } from '@angular/core';
import {Product} from '../../core/models/products.model';
import {CommonModule} from '@angular/common';
import {DetallesComponent} from './card/detalles/detalles.component';
import {CardComponent} from './card/card.component';
import {ApiService} from '../../core/api.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, CardComponent, DetallesComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductComponent implements OnInit {
  productos: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.apiService.getProducts().subscribe({
      next: (response) => {
        this.productos = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'Error al cargar los productos. Por favor, intente más tarde.';
        this.loading = false;
      }
    });
  }

  onAddToCart(product: Product) {
    console.log('Producto agregado al carrito:', product.name);
    // Integrar con CartService cuando esté disponible
  }


  selectedProduct: Product | null = null;

  onViewDetails(product: Product) {
    this.selectedProduct = product;
  }

  closeDetails() {
    this.selectedProduct = null;
  }
}
