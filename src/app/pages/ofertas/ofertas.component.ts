import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models/products.model';
import { ApiService } from '../../core/api.service';
import { CartService } from '../../core/cart.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    TagModule
  ],
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {
  productos: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;

  // Filtros
  selectedCategory: any = null;
  priceRange: any = null;
  searchTerm: string = '';

  categories = [
    { label: 'Todas las categorías', value: null },
    { label: 'iPhone', value: 'iPhone' },
    { label: 'iPad', value: 'iPad' },
    { label: 'Mac', value: 'Mac' },
    { label: 'Apple Watch', value: 'Watch' },
    { label: 'AirPods', value: 'AirPods' }
  ];

  priceRanges = [
    { label: 'Todos los precios', value: null },
    { label: 'Menos de S/500', value: { min: 0, max: 500 } },
    { label: 'S/500 - S/1000', value: { min: 500, max: 1000 } },
    { label: 'S/1000 - S/2000', value: { min: 1000, max: 2000 } },
    { label: 'Más de S/2000', value: { min: 2000, max: 999999 } }
  ];

  constructor(
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    this.apiService.getProducts().subscribe({
      next: (response: any) => {
        // 🔹 Soporta tanto mock (array) como backend real ({ data: [] })
        const products: Product[] = Array.isArray(response)
          ? response
          : response.data || [];

        this.productos = products.map(product => ({
          ...product,
          originalPrice: product.price,
          price: product.price * 0.8, // 20% descuento
          discount: 20
        }));

        this.filteredProducts = [...this.productos];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
      }
    });
  }


  applyFilters() {
    this.filteredProducts = this.productos.filter(product => {
      // Filtro por categoría
      if (this.selectedCategory && !product.name.toLowerCase().includes(this.selectedCategory.toLowerCase())) {
        return false;
      }

      // Filtro por precio
      if (this.priceRange && (product.price < this.priceRange.min || product.price > this.priceRange.max)) {
        return false;
      }

      // Filtro por búsqueda
      if (this.searchTerm && !product.name.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onPriceRangeChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
  }

  clearFilters() {
    this.selectedCategory = null;
    this.priceRange = null;
    this.searchTerm = '';
    this.filteredProducts = [...this.productos];
  }
}
