import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CartService, CartItem } from '../../core/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [
    DecimalPipe,
    ButtonModule,
    CardModule,
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
  tax: number = 0;
  finalTotal: number = 0;
  discountCode: string = '';
  discount: number = 0;

  constructor(
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.total = this.cartService.getTotal();
    this.tax = this.cartService.getTax();
    this.finalTotal = this.cartService.getFinalTotal() - this.discount;
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }
    this.cartService.updateQuantity(productId, quantity);
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Cantidad actualizada'
    });
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

  applyDiscount(): void {
    const validCodes = {
      'APPLE10': 0.10,
      'CORE20': 0.20,
      'WELCOME5': 0.05
    };

    if (validCodes[this.discountCode as keyof typeof validCodes]) {
      this.discount = this.total * validCodes[this.discountCode as keyof typeof validCodes];
      this.calculateTotals();
      this.messageService.add({
        severity: 'success',
        summary: 'Descuento aplicado',
        detail: `Descuento de ${(validCodes[this.discountCode as keyof typeof validCodes] * 100)}% aplicado`
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Código inválido',
        detail: 'El código de descuento no es válido'
      });
    }
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
    this.router.navigate(['/order']);
  }

  continueShopping(): void {
    this.router.navigate(['/product']);
  }
}
