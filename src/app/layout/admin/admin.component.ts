import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AsideComponent} from '../../shared/aside/aside.component';
import {MenuItem} from '../../core/models/common.model';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, AsideComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  constructor(private apiService: AuthService,
              private router : Router) {
  }

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: 'dashboard'
    },
    {
      label: 'Customers',
      icon: 'pi pi-users',
      route: 'customers',
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      route: 'productos'
    },
    {
      label: 'Ordenes',
      icon: 'pi pi-chart-bar',
      route: 'ordenes'
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      route: '/configuracion'
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => {
        this.apiService.logout()
        this.router.navigate(['/']);
      }
    }
  ];

}
