import {Routes} from '@angular/router';
import {PublicComponent} from './layout/public/public.component';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {OrderComponent} from './pages/order/order.component';
import {AdminComponent} from './layout/admin/admin.component';
import {AdminDashboardComponent} from './pages/admin/dashboard/admin-dashboard.component';
import {OrdenesComponent} from './pages/admin/ordenes/ordenes.component';
import {ClientesComponent} from './pages/admin/clientes/clientes.component';
import {ProductosComponent} from './pages/admin/productos/productos.component';
import {IndexComponent} from './pages/index/index.component';
import {ProductsComponent} from './pages/productos/productos.component';
import {OfertasComponent} from './pages/ofertas/ofertas.component';
import { ProductoDetalleComponent } from './pages/productos/detalle/detalle.component';
// importes de la pasarela xd
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PaymentFormComponent } from './pages/payment-form/payment-form.component';
import { PaymentResponseComponent } from './pages/payment-response/payment-response.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', component: IndexComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      {path: 'ordenes', component : OrderComponent},
      { path: 'productos', component: ProductsComponent }, // La lista de productos
      { path: 'productos/:slug', component: ProductoDetalleComponent }, // La página de detalle
      { path: 'ofertas', component: OfertasComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'payment-form', component: PaymentFormComponent },
      { path: 'payment-response', component: PaymentResponseComponent }
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
