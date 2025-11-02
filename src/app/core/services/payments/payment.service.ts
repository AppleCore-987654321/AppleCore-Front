import { Injectable } from '@angular/core';
import { AlignetService } from './alignet.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private alignet: AlignetService) {}

  async iniciarPago(payload: any) {
    const token = await this.alignet.getAccessToken();
    const nonce = await this.alignet.getNonce(token);
    return { token, nonce, payload };
  }
}
