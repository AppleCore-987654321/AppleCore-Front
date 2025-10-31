import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ButtonModule, BadgeModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  searchTerm: string = '';
  isMenuOpen = false; // Estado para controlar el menú móvil

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/productos'], { queryParams: { q: this.searchTerm } });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  username: string | null = null;
  userRol: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.username$.subscribe((username: string | null) => {
      this.username = username;
    });

    this.authService.userRol$.subscribe((userRol: string | null) => {
      this.userRol = userRol;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
