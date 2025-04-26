import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { AppConst } from '../../shared/app-data.constant';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  showErrorMsg = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.showErrorMsg = false;
    if (this.loginForm.valid) {
      const payload = {
        "email": this.loginForm.value.username,
        "password": this.loginForm.value.password
      }

      this.authService.login({email: 'gopalshimpi@gmail.com', password: 'SuperSecure123'}).subscribe({
        next: (resp) => {
          if (resp && resp.user && resp.token) {
            this.storageService.set(AppConst.currentUserKey, resp.user);
            this.storageService.set(AppConst.token, resp.token);
            this.router.navigate(['/dashboard']);
          }
        }, error: error => {
          this.showErrorMsg = true;
        }
      })
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
} 