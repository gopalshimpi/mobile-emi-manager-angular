import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../shared/services/auth.service';
import { User, UserRole } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  showErrorMsg = false;
  errorMessage = '';
  userRoles = Object.values(UserRole.USER);
  isSuperAdmin = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      role: [UserRole.USER, [Validators.required]]
    });
  }

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    this.isSuperAdmin = currentUser?.role === UserRole.ADMIN;

    if (!this.isSuperAdmin) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.showErrorMsg = false;
    if (this.registerForm.valid) {

      const params = {
        name: this.registerForm.value?.name,
        email: this.registerForm.value?.email,
        contact_number: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        password_confirmation: this.registerForm.value.password_confirmation,
        role: this.registerForm.value.role
      }

      const payload = { user: params }

      this.authService.register(payload as any).subscribe({
        next: (resp) => {
          if (resp) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.showErrorMsg = true;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get role() {
    return this.registerForm.get('role');
  }
} 