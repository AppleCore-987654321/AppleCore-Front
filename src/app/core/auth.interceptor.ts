import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  console.log('Token en Interceptor:', token);

  // 🔒 Excluir endpoints públicos
  const isPublicEndpoint =
    req.url.includes('/login') ||
    req.url.includes('/register');

  if (isPublicEndpoint) {
    // No añadir token
    return next(req);
  }

  // ✅ Si hay token, añadirlo
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },

    });
    return next(cloned);
  }

  return next(req);
};
