import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../core/models/products.model';
import { ApiService } from '../../../core/api.service';
import { CartService } from '../../../core/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  product: Product | undefined;
  loading = true;
  error: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.router.navigate(['/productos']);
      return;
    }

    this.apiService.getProductsForTest().subscribe({
      next: (products) => {
        // Buscamos el producto cuyo nombre, convertido a slug, coincida con el de la URL
        this.product = products.find(p => this.slugify(p.name) === slug);
        if (!this.product) {
          this.error = 'Producto no encontrado.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
        this.error = 'No se pudo cargar la información del producto.';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.messageService.add({
        severity: 'success',
        summary: '¡Éxito!',
        detail: `${this.product.name} ha sido agregado al carrito.`
      });
    }
  }

  // Función para convertir un nombre de producto en una URL amigable (slug)
  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Reemplaza espacios con -
      .replace(/[^\w\-]+/g, '')       // Elimina caracteres no alfanuméricos (excepto -)
      .replace(/\-\-+/g, '-');        // Reemplaza múltiples - con uno solo
  }
}
