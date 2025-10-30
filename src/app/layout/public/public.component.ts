import { Component } from '@angular/core';
import { NavComponent } from '../../shared/nav/nav.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public',
  imports: [NavComponent, FooterComponent,RouterOutlet],
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent {

}
