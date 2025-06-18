import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  constructor(private router: Router)
  {

  }
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  handleSubmit(): void {
    console.log('Login attempted with:', {
      username: this.username,
      password: this.password
    });
    this.router.navigate(['/form']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
