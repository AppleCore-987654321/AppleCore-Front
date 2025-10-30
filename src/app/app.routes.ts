import {Routes} from '@angular/router';
import {PublicComponent} from './layout/public/public.component';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {OrderComponent} from './pages/order/order.component';
import {AdminComponent} from './layout/admin/admin.component';
import {AdminDashboardComponent} from './admin/dashboard/admin-dashboard.component';
import {OrdenesComponent} from './admin/ordenes/ordenes.component';
import {ClientesComponent} from './admin/clientes/clientes.component';
import {ProductosComponent} from './admin/productos/productos.component';
import {IndexComponent} from './pages/index/index.component';
import {ProductComponent} from './pages/productos/productos.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: IndexComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      {path: 'ordenes', component : OrderComponent},
      { path: 'product', component: ProductComponent }
    ]
  },

    {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'ordenes', component: OrdenesComponent},
      { path: 'customers', component: ClientesComponent}
    ]
  }
];


