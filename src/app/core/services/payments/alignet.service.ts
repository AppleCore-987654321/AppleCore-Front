import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlignetService {
  private apiVersion = '1709847567';
  private clientId = 'WDqE4tFbhvzm5XJnnTYcPUNQGQMTg8P4';
  private clientSecret = 'rzBZjHn0lWb0xMPzqOiBAuznzlAq23LfsFEr2p4Rw7ezWzosxpt1Z1mpp8dt8zlR';
  private baseUrl = 'https://auth.preprod.alignet.io';

  constructor(private http: HttpClient) {}

  async getAccessToken(): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ALG-API-VERSION': this.apiVersion
    });

    const body = {
      action: 'authorize',
      grant_type: 'client_credentials',
      audience: 'https://api.preprod.alignet.io/',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'create:token post:charges get:charges delete:charges'
    };

    const resp: any = await lastValueFrom(this.http.post(`${this.baseUrl}/token`, body, { headers }));
    return resp.access_token;
  }

  async getNonce(token: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ALG-API-VERSION': this.apiVersion,
      'Authorization': `Bearer ${token}`
    });

    const body = {
      action: 'create.nonce',
      audience: 'https://api.preprod.alignet.io/',
      client_id: this.clientId,
      scope: 'post:charges'
    };

    const resp: any = await lastValueFrom(this.http.post(`${this.baseUrl}/nonce`, body, { headers }));
    return resp.nonce;
  }
}
