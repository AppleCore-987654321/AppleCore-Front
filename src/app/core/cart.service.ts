import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './models/products.model';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  details: string;
  price: number;
  stock: number;
  imgUrl: string;
  status: boolean;
  categoryId: number;
  categoryName?: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private countSubject = new BehaviorSubject<number>(0);

  // 🔥 Nuevo: estado visible del carrito
  private isCartOpenSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  cart$ = this.cartSubject.asObservable();
  count$ = this.countSubject.asObservable();
  isCartOpen$ = this.isCartOpenSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  // ======================
  // 🛒 Métodos principales
  // ======================

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity,
      };
      this.cartItems.push(cartItem);
    }

    this.updateCart();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // ======================
  // 💾 Persistencia local
  // ======================

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.countSubject.next(this.cartItems.reduce((count, item) => count + item.quantity, 0));
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadCart(): void {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems = JSON.parse(saved);
      this.updateCart();
    }
  }

  // ======================
  // 👁️ Control del estado del carrito
  // ======================

  toggleCart(state?: boolean): void {
    // Si se pasa explícitamente un estado (true/false)
    if (typeof state === 'boolean') {
      this.isCartOpenSubject.next(state);
    } else {
      // Si no, simplemente alterna el estado actual
      const current = this.isCartOpenSubject.getValue();
      this.isCartOpenSubject.next(!current);
    }
  }

  isCartOpen(): boolean {
    return this.isCartOpenSubject.getValue();
  }
}
