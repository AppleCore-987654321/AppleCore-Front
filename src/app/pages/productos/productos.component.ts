import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Componentes y servicios
import { CardComponent } from './card/card.component';
import { ApiService } from '../../core/api.service';
import { CartService } from '../../core/cart.service';
import { Product } from '../../core/models/products.model';

// PrimeNG
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductsComponent implements OnInit {
  // === Estado general ===
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  loading = true;
  error: string | null = null;

  // === Filtros ===
  categoriasUnicas: string[] = [];
  filtroCategoria: string = '';
  precioMaximo: number = 3000;
  filtroPrecio: number = 3000;

  // === Inyecciones ===
  private apiService = inject(ApiService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.cargarProductos();
    this.verificarCarritoAbierto();
  }

  /**
   * Carga los productos de prueba desde el JSON server
   */
  private cargarProductos(): void {
    this.loading = true;

    this.apiService.getProducts().subscribe({
      next: (response: Product[] | { data: Product[] }) => {
        this.productos = Array.isArray(response)
          ? response
          : response.data;

        this.productosFiltrados = this.productos;
        this.extraerCategoriasUnicas();
        this.calcularPrecioMaximo();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('❌ Error al cargar productos:', error);
        this.error = 'Error al cargar los productos. Inténtalo más tarde.';
        this.loading = false;
      }
    });


  }

  /**
   * Si el usuario llega desde el login con ?openCart=true
   * abrimos automáticamente el carrito.
   */
  private verificarCarritoAbierto(): void {
    this.route.queryParams.subscribe(params => {
      if (params['openCart']) {
        this.cartService.toggleCart(true); // Debes tener este método en CartService
      }
    });
  }

  /**
   * Extrae las categorías únicas de los productos
   */
  private extraerCategoriasUnicas(): void {
    const categorias = this.productos
      .map(p => p.categoryName)
      .filter((name): name is string => !!name);
    this.categoriasUnicas = [...new Set(categorias)];
  }

  /**
   * Calcula el precio máximo dinámico según los productos
   */
  private calcularPrecioMaximo(): void {
    if (this.productos.length > 0) {
      this.precioMaximo = Math.ceil(
        Math.max(...this.productos.map(p => p.price))
      );
      this.filtroPrecio = this.precioMaximo;
    }
  }

  /**
   * Aplica filtros de categoría y precio
   */
  aplicarFiltros(): void {
    let filtrados = [...this.productos];

    if (this.filtroCategoria) {
      filtrados = filtrados.filter(
        p => p.categoryName === this.filtroCategoria
      );
    }

    filtrados = filtrados.filter(p => p.price <= this.filtroPrecio);
    this.productosFiltrados = filtrados;
  }

  /**
   * Añade un producto al carrito con notificación
   */
  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${product.name} ha sido añadido al carrito.`,
      life: 2500
    });
  }
}
