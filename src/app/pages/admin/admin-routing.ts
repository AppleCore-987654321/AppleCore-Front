import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosComponent } from './productos/productos.component';
import { ordenesRoutes } from './ordenes/ordenes.routes';
import {productosRoutes} from './productos/productos.routes';
import {OrdenesComponent} from './ordenes/ordenes.component';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard], // 🔒 Protege todas las rutas hijas
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'ordenes', component: OrdenesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
