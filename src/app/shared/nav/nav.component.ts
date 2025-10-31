import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import {Sidebar} from 'primeng/sidebar';
import {ButtonDirective} from 'primeng/button';
import {CartComponent} from '../../pages/cart/cart.component';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, CommonModule, FormsModule, ButtonDirective, Sidebar, CartComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  cartCount = 0;
  visible = false;
  searchTerm: string = '';

  toggleSidebar() {
    this.visible = !this.visible;
  }

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/productos'], { queryParams: { q: this.searchTerm } });
    }
  }

  username: string | null = null;
  userRol: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.authService.username$.subscribe(username => {
      this.username = username;
    });

    this.authService.userRol$.subscribe(userRol => {
      this.userRol = userRol;
    });
    
    this.cartService.count$.subscribe(count => {
      this.cartCount = count;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
