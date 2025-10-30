import {Component, Input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MenuItem} from '../../core/models/common.model';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-aside',
  imports: [
    RouterLink,
    ButtonDirective,
    RouterLinkActive,
    Ripple,
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

  @Input() menuItems: MenuItem[] = [];
  @Input() appName: string = 'Mi Dashboard';
  @Input() footerText: string = '© 2024 Mi App';
  @Input() collapsed: boolean = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

}
