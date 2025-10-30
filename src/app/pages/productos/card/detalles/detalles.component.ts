import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Product} from '../../../../core/models/products.model';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent {
  @Input() product!: Product; // Producto a mostrar
  @Output() close = new EventEmitter<void>(); // Evento para cerrar detalles

  constructor(){

    console.log(this.product);

  }

}
