import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Product} from '../../../core/models/products.model';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewDetails = new EventEmitter<Product>();

  // Inyectamos directamente el servicio del carrito
  private router = inject(Router);

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onViewDetails() {
    const slug = this.slugify(this.product.name);
    this.router.navigate(['/productos', slug]);
  }

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
