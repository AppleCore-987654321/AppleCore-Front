import { Component } from '@angular/core';
import {CategoriesComponent} from './categories/categories.component';

@Component({
  selector: 'app-index',
  imports: [
    CategoriesComponent
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
