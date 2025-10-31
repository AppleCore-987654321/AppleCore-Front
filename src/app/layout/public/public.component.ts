import { Component } from '@angular/core';
import { NavComponent } from '../../shared/nav/nav.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import {FloatingCartButtonComponent} from '../../shared/floating-cart-button/floating-cart-button.component';

@Component({
  selector: 'app-public',
  imports: [NavComponent, FooterComponent, RouterOutlet, FloatingCartButtonComponent],
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent {

}
