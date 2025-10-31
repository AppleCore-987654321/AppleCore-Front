import { Component, OnInit, inject } from '@angular/core';
import { Product } from '../../core/models/products.model';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { ApiService } from '../../core/api.service';
import { FormsModule } from '@angular/forms';
import { DetallesComponent } from './card/detalles/detalles.component';
import { CartService } from '../../core/cart.service'; // 1. Importar CartService
import { ToastModule } from 'primeng/toast'; // 2. Importar ToastModule para notificaciones
import { MessageService } from 'primeng/api'; // 3. Importar MessageService

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule, ToastModule],
  providers: [MessageService], // 5. Proveer el MessageService
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductsComponent implements OnInit {
  productos: Product[] = []; // Lista maestra de productos
  productosFiltrados: Product[] = []; // Lista que se muestra en la UI
  loading = true;
  error: string | null = null;

  // Propiedades para los filtros
  categoriasUnicas: string[] = [];
  filtroCategoria: string = '';
  precioMaximo: number = 3000;
  filtroPrecio: number = 3000;

  private apiService = inject(ApiService);
  private cartService = inject(CartService); // 6. Inyectar CartService
  private messageService = inject(MessageService); // 7. Inyectar MessageService

  ngOnInit(): void {
    this.productTest();
  }

  productTest() {
    this.loading = true;
    this.apiService.getProductsForTest().subscribe({
      next: (response: Product[]) => {
        this.productos = response;
        this.productosFiltrados = response; // Inicialmente, mostrar todos
        this.extraerCategoriasUnicas();
        this.calcularPrecioMaximo();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar productos de prueba:', error);
        this.error = 'Error al cargar los productos. Por favor, intente más tarde.';
        this.loading = false;
      }
    });
  }

  private extraerCategoriasUnicas() {
    // Usamos 'categoryName' y filtramos posibles valores undefined
    const categorias = this.productos
      .map(p => p.categoryName)
      .filter((name): name is string => !!name);
    this.categoriasUnicas = [...new Set(categorias)];
  }

  private calcularPrecioMaximo() {
    if (this.productos.length > 0) {
      // Usamos Math.ceil para redondear hacia arriba y tener un valor limpio en el slider
      this.precioMaximo = Math.ceil(Math.max(...this.productos.map(p => p.price)));
      this.filtroPrecio = this.precioMaximo; // Iniciar el slider en el máximo
    }
  }

  aplicarFiltros() {
    let productosTemp = [...this.productos];

    // 1. Filtrar por categoría
    if (this.filtroCategoria) {
      productosTemp = productosTemp.filter(p => p.categoryName === this.filtroCategoria);
    }

    // 2. Filtrar por precio
    productosTemp = productosTemp.filter(p => p.price <= this.filtroPrecio);

    this.productosFiltrados = productosTemp;
  }

  onAddToCart(product: Product): void {
    // 8. ¡Aquí está la magia! Llamamos al servicio para añadir el producto.
    this.cartService.addToCart(product);
    // 9. Mostramos una notificación de éxito.
    this.messageService.add({
      severity: 'success',
      summary: '¡Éxito!',
      detail: `${product.name} ha sido agregado al carrito.`
    });
  }
}
