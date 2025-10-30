// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OrdenService } from '../services/orden.service';
// import { OrderList } from '../models/order.model';

// @Component({
//   selector: 'app-editar-orden',
//   templateUrl: './editar-orden.component.html',
//   styleUrls: ['./editar-orden.component.css']
// })
// export class EditarOrdenComponent implements OnInit {
//   ordenForm!: FormGroup;
//   codigoOrden!: number;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private ordenService: OrdenService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.codigoOrden = Number(this.route.snapshot.paramMap.get('id'));

//     this.ordenForm = this.fb.group({
//       codigoOrden: [''],
//       fechaOrden: [''],
//       totalOrden: [''],
//       telefonoEntrega: [''],
//       direccionEntrega: [''],
//       observaciones: [''],
//       estadoOrden: ['']
//     });

//     this.loadOrden();
//   }

//   loadOrden(): void {
//     this.ordenService.getOrdenById(this.codigoOrden).subscribe({
//       next: (response) => {
//         const orden: OrderList = response.data;
//         this.ordenForm.patchValue(orden);
//       },
//       error: (err) => console.error('Error loading order', err)
//     });
//   }

//   onSubmit(): void {
//     if (this.ordenForm.valid) {
//       this.ordenService.updateOrden(this.codigoOrden, this.ordenForm.value).subscribe({
//         next: () => {
//           alert('Orden actualizada correctamente');
//           this.router.navigate(['/admin/ordenes']);
//         },
//         error: (err) => console.error('Error updating order', err)
//       });
//     }
//   }
// }