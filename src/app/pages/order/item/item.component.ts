import {Component, Input} from '@angular/core';
import {OrderList, OrderStatus} from '../../../core/models/out/order.model';
import {DatePipe, DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-item',
  imports: [
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {

  @Input({ required: true }) order!: OrderList;

  protected readonly OrderStatus = OrderStatus;
}
