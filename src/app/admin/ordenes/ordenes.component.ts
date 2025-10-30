import {Component} from '@angular/core';
import {TableComponent} from './table/table.component';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css','../../layout/admin/admin.component.css']
})
export class OrdenesComponent {
  vista: 'tabla' | 'detalles' = 'tabla';


}
