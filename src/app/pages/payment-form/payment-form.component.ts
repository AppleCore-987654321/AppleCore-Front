import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

declare var FlexPaymentForms: any;

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  nonce!: string;
  payload!: any;

  constructor(private router: Router, private zone: NgZone) {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    this.nonce = state?.nonce;
    this.payload = state?.payload;

    if (!this.nonce || !this.payload) {
      console.error('Faltan parámetros del pago');
      this.router.navigate(['/checkout']);
    }
  }

  ngOnInit(): void {
    // Cargar CSS y script de Pay-me Flex
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://flex.dev.pay-me.cloud/main-flex-payment-forms.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://flex.dev.pay-me.cloud/flex-payment-forms.min.js';
    script.onload = () => this.mostrarFormulario();
    document.body.appendChild(script);
  }

  mostrarFormulario() {
    try {
      const paymentForm = new FlexPaymentForms({
        nonce: this.nonce,
        payload: this.payload,
        display_settings: { methods: ['CARD', 'QR', 'YAPE'] }
      });

      const responseCallback = (response: any) => {
        console.log('✅ Respuesta recibida:', response);

        // Guardar copia local por seguridad
        sessionStorage.setItem('paymentResponse', JSON.stringify(response));

        // Ejecutar dentro del contexto Angular
        this.zone.run(() => {
          this.router.navigate(['/payment-response'], { state: { response } });
        });
      };

      const trackingCallback = (tracking: any) => {
        console.log('📊 Tracking evento:', tracking);
      };

      const onErrorCallback = (error: any) => {
        console.error('❌ Error en el flujo de pago:', error);
      };

      paymentForm.init(
        document.querySelector('#formularioPago'),
        responseCallback,
        trackingCallback,
        onErrorCallback
      );
    } catch (err) {
      console.error('Error inicializando FlexPaymentForms:', err);
    }
  }
}
