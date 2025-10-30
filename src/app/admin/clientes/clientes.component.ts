import {Component} from '@angular/core';
import {ListarClientesComponent} from './listar/listar.component';

@Component({
  selector: 'app-clientes',
  imports: [
    ListarClientesComponent
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css','../../layout/admin/admin.component.css']
})
export class ClientesComponent {

  vista: 'tabla' | 'detalles' = 'tabla';



}
