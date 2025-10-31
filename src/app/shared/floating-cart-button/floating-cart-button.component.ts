import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { SidebarModule } from 'primeng/sidebar';

import { CartComponent } from '../../pages/cart/cart.component';
import {CartService} from '../../core/cart.service';

@Component({
  selector: 'app-floating-cart-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule, SidebarModule, CartComponent],
  templateUrl: './floating-cart-button.component.html',
  styleUrls: ['./floating-cart-button.component.css']
})
export class FloatingCartButtonComponent implements OnInit {
  cartCount = 0;
  isSidebarVisible = false;
  isButtonVisible = false;
  private hiddenRoutes = ['/order', '/login', '/register']; // Rutas donde el botón debe estar oculto

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el contador del carrito
    this.cartService.count$.subscribe((count: number) => {
      this.cartCount = count;
      this.updateButtonVisibility();
    });

    // Suscribirse a los cambios de ruta para ocultar el botón donde no es necesario
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateButtonVisibility();
    });
  }

  private updateButtonVisibility(): void {
    const onHiddenRoute = this.hiddenRoutes.some(route => this.router.url.startsWith(route));
    this.isButtonVisible = this.cartCount > 0 && !onHiddenRoute;
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
