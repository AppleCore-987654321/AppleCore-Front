import { Component } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CategoriesComponent,
    HeroBannerComponent
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
