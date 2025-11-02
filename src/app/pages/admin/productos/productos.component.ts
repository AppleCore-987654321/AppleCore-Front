import {Component} from '@angular/core';
import {ListarComponent} from './listar/listar.component';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [
    ListarComponent
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css' ,'../../../layout/admin/admin.component.css']
})
export class ProductosComponent {

}
