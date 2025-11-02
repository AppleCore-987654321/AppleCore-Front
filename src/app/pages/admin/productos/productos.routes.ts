import { Routes } from '@angular/router';
import { ProductosComponent } from './productos.component';
import { ListarComponent } from './listar/listar.component';

export const productosRoutes: Routes = [
  {
    path: '',
    component: ProductosComponent, // vista principal
  },
  {
    path: 'listar',
    component: ListarComponent,
  }
];
