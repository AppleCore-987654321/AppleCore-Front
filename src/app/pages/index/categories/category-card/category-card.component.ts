import {Component, Input} from '@angular/core';
import {Category} from '../../../../core/models/products.model';
import {Button} from 'primeng/button';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-category-card',
  imports: [
    Button,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input() data!: Category;


}
