import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);  // Inject Auth0's AuthService

  return from(authService.getAccessTokenSilently()).pipe(
    switchMap((authToken: string) => {
      // If token exists, clone the request and add the Authorization header
      if (authToken) {
        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`
          }
        });
        return next(modifiedReq); // Return the cloned request
      }
      
      return next(req);
    })
  );
}
