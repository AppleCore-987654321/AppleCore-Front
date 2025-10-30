import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../core/models/auth.model';
import { CommonModule } from '@angular/common';

// Validador personalizado para coincidencia de contraseñas
function passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { mismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  registerForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  submitted: boolean = false; // Nueva propiedad para controlar el envío

  constructor() {
    this.registerForm = this.fb.group(
      {
        // CAMPOS REQUERIDOS
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],

        lastName: [''],
        phone: [''],
        address: [''],

        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        // Validador de grupo para la coincidencia de contraseñas
        validators: passwordMatchValidator,
      }
    );
  }

  // Método helper para obtener los controles del formulario
  get f() {
    return this.registerForm.controls;
  }

  // Método helper para verificar si un campo tiene errores y debe mostrarlos
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted));
  }

  // Método helper para obtener el mensaje de error específico de un campo
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (!field || !this.hasError(fieldName)) {
      return '';
    }

    if (field.errors?.['required']) {
      return 'Este campo es obligatorio';
    }

    if (fieldName === 'email' && field.errors?.['email']) {
      return 'Ingresa un email válido';
    }

    if (fieldName === 'password' && field.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    return '';
  }

  // Verificar si las contraseñas no coinciden
  get passwordsNotMatch(): boolean {
    return !!(
      this.registerForm.errors?.['mismatch'] &&
      this.registerForm.get('confirmPassword')?.touched &&
      this.submitted
    );
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Marcar todos los campos como tocados para mostrar los errores
    this.registerForm.markAllAsTouched();

    // Verificar si el formulario es inválido
    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['mismatch']) {
        this.errorMessage = 'Las contraseñas no coinciden.';
      } else {
        this.errorMessage =
          'Por favor, completa los campos obligatorios.';
      }
      return;
    }

    this.loading = true;

    // Preparar el objeto de solicitud (excluyendo 'confirmPassword')
    const { confirmPassword, ...requestData } = this.registerForm.value;
    const request: RegisterRequest = requestData;

    // Llamar al servicio API
    this.apiService.register(request).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login'], {
          queryParams: { registered: 'success' },
        });
      },
      error: (err) => {
        this.loading = false;
        const serverMessage =
          err.error?.message ||
          'Error al procesar el registro. Intenta de nuevo.';
        this.errorMessage = serverMessage;
      },
    });
  }
}
