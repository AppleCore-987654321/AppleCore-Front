import { OrderStatus, PaymentMethod } from './order.model';

export interface FilterRequest {
    module: 'orders';
    fromDate: string;
    toDate: string;
    paymentMethod?: PaymentMethod | null;
    orderStatus?: OrderStatus | null;
}
