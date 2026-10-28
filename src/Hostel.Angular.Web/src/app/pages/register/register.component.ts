import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.auth.register(this.username, this.password, this.confirmPassword).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error = err.message || 'Registration failed'
    });
  }
}
