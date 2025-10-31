import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../core/api.service';
import {Category} from '../../../core/models/products.model';
import {CategoryCardComponent} from './category-card/category-card.component';
import {Carousel} from 'primeng/carousel';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [
    CategoryCardComponent,
    Carousel,
    NgForOf,
    NgIf
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{
  categories: Category[] = [];

  loading: boolean = true;
  error: string | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  constructor(private apiService: ApiService) {}

  loadCategories() {
    this.loading = true;
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loading = false;

      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'Error al cargar los productos. Por favor, intente más tarde.';
        this.loading = false;
      }
    });
  }

}
