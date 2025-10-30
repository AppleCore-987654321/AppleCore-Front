import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models/products.model';
import { DecimalPipe, NgForOf, NgOptimizedImage } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [
    DecimalPipe,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    ImageModule
  ]
})
export class CartComponent implements OnInit {
  carrito: Product[] = [];
  total: number = 0;

  ngOnInit(): void {
    this.carrito = [
      {
        id: 1,
        name: 'PlayStation 5',
        description: 'Consola de nueva generación con SSD ultrarrápido y gráficos 4K.',
        details: 'Incluye mando DualSense y soporte vertical.',
        price: 2999.9,
        stock: 8,
        imgUrl: 'https://plazavea.vteximg.com.br/arquivos/categor%C3%ADa-VIDEOJUEGOS-PS5-D.png',
        status: true,
        categoryId: 1,
        categoryName: 'Consolas',
      },
      {
        id: 2,
        name: 'Xbox Series X',
        description: 'Consola potente con 1TB SSD y retrocompatibilidad.',
        details: 'Incluye mando inalámbrico y cable HDMI 2.1.',
        price: 2899.0,
        stock: 6,
        imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxgBrnG69kOnM1FHiOIiR6SLXVfxlJTxNEnw&s',
        status: true,
        categoryId: 1,
        categoryName: 'Consolas',
      },
    ];
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + item.price, 0);
  }

  eliminarProducto(product: Product) {
    this.carrito = this.carrito.filter(item => item.id !== product.id);
    this.calcularTotal();
  }
}
