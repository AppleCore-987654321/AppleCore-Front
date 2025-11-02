import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../core/cart.service';

@Component({
  selector: 'app-payment-response',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.css']
})
export class PaymentResponseComponent implements OnInit {
  response: any;
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { response?: any };
    this.response = state?.response;

    if (!this.response) {
      const stored = sessionStorage.getItem('paymentResponse');
      this.response = stored ? JSON.parse(stored) : null;
    }

    if (!this.response) {
      console.warn('⚠️ No hay datos de respuesta del pago');
      this.router.navigate(['/']);
      return;
    }

    sessionStorage.setItem('paymentResponse', JSON.stringify(this.response));
  }

  ngOnInit(): void {
    // ✅ Capturar carrito ANTES de limpiar
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  get formattedAmount(): string {
    const amount = this.response?.transaction?.amount;
    if (!amount) return '';
    const num = parseFloat(amount) / 100;
    return num.toFixed(2);
  }

  volverInicio() {
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }
}
