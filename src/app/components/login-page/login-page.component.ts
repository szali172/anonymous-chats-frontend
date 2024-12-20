import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink,MatCardModule, MatButtonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  auth = inject(AuthService);
  document = inject(DOCUMENT);

  logIn() {
    this.auth.loginWithRedirect({
      appState: { target: '/groups' }
    })
  }
}
