import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from '../../../core/models/products.model';
import {Router} from '@angular/router';
import {DecimalPipe, CommonModule} from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    DecimalPipe,
    CommonModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewDetails = new EventEmitter<Product>();

  constructor(private router:Router){

  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onViewDetails() {
    this.viewDetails.emit(this.product);
    console.log(this.product);

    this.router.navigate(["/productos",this.product.id]);
  }

}
