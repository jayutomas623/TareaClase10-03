import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css']
})
export class LoginFormComponent {

  passwordVisible = false;
  username = '';
  password = '';

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin(): void {
    console.log('Intentando login con:', this.username);
  }
}