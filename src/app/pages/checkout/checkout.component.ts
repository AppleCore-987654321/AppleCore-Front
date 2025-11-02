import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../../core/cart.service';
import { PaymentService } from '../../core/services/payments/payment.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  imports: [
    CommonModule,
    DecimalPipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  total: number = 0;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicializar formulario
    this.checkoutForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['Perú', Validators.required]
    });

    // Cargar carrito
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  // Método general para enviar y crear la sesión de pago
  async procederPago() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.checkoutForm.value;

    try {
      const amountInCents = Math.round(this.total * 100);

      const payload = {
        action: 'authorize',
        channel: 'ecommerce',
        merchant_code: 'b0deb6f3-e51a-48a7-9268-f1441d46f7bd',
        merchant_operation_number: Math.floor(100000 + Math.random() * 900000).toString(), // 6 dígitos
        payment_details: {
          amount: amountInCents.toString(),
          currency: '604', // Soles 🇵🇪

          // Datos de facturación (obligatorios)
          billing: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: {
              country_code: '+51',
              subscriber: formData.phone
            },
            location: {
              line_1: formData.address,
              line_2: '',
              city: formData.city,
              state: formData.city, // opcional, pero requerido por el modelo
              country: 'PE'
            }
          },

          // Datos de envío (opcionales, duplicamos los de billing por ahora)
          shipping: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: {
              country_code: '+51',
              subscriber: formData.phone
            },
            location: {
              line_1: formData.address,
              line_2: '',
              city: formData.city,
              state: formData.city,
              country: 'PE'
            }
          },

          // Información del cliente (opcional, pero útil para conciliaciones)
          customer: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: {
              country_code: '+51',
              subscriber: formData.phone
            },
            location: {
              line_1: formData.address,
              line_2: '',
              city: formData.city,
              state: formData.city,
              country: 'PE'
            }
          },

          // Campos adicionales para auditoría o detalle
          additional_fields: {
            /*items: this.cartItems.map(item => ({
              name: item.name,
              qty: item.quantity.toString(),
              price: item.price.toString()
            })),*/
            total: this.total.toString(),
            external_id: `ORDER-${Date.now()}`
          }
        }
      };


      // Obtener nonce desde el servicio
      const session = await this.paymentService.iniciarPago(payload);

      // Redirigir a la pasarela
      this.router.navigate(['/payment-form'], { state: session });

    } catch (error) {
      console.error('❌ Error al procesar el pago:', error);
      alert('Hubo un problema con la pasarela de pago. Intenta nuevamente.');
    } finally {
      this.isLoading = false;
    }
  }
}
