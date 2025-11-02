import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { LoginRequest } from '../../core/models/out/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Inicializa el formulario reactivo
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Maneja el evento de envío del formulario de inicio de sesión
   */
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;

        // Redirigir según el tipo de rol
        if (response.roleType === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.roleType === 'CUSTOMER') {
          // Redirige a productos con el carrito abierto
          this.router.navigate(['/productos'], {
            queryParams: { openCart: true },
          });
        } else {
          // Fallback en caso de rol desconocido
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        console.error('Error en login:', error);
      },
    });
  }
}
