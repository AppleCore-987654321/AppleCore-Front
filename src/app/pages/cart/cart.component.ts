import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CartService, CartItem } from '../../core/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [
    DecimalPipe,
    ButtonModule,
    TagModule,
    ImageModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,

  ],
  providers: [ConfirmationService, MessageService]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  @Output() closeSidebar = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.total = this.cartService.getTotal();
  }

  incrementQuantity(item: CartItem): void {
    if (item.quantity < item.stock) {
      this.cartService.updateQuantity(item.id, item.quantity + 1);
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    } else {
      this.removeProduct(item.id);
      return;
    }
  }

  removeProduct(productId: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este producto?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.removeFromCart(productId);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Producto eliminado del carrito'
        });
      }
    });
  }

  clearCart(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de vaciar todo el carrito?',
      header: 'Vaciar carrito',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.clearCart();
        this.messageService.add({
          severity: 'success',
          summary: 'Carrito vaciado',
          detail: 'Todos los productos han sido eliminados'
        });
      }
    });
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrito vacío',
        detail: 'Agrega productos antes de proceder'
      });
      return;
    }

    // ✅ Verifica si está autenticado
    const isLoggedIn = this.authService.isAuthenticated();

    if (!isLoggedIn) {
      this.messageService.add({
        severity: 'info',
        summary: 'Inicia sesión',
        detail: 'Debes iniciar sesión para proceder al pago'
      });

      // Redirige al login
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: '/checkout' } // opcional: redirige al checkout después de login
      });

      return;
    }

    // Si está logueado, sigue normalmente
    this.router.navigate(['/checkout']);
  }



  continueShopping(): void {
    this.closeSidebar.emit();
    this.router.navigate(['/productos']);
  }
}
