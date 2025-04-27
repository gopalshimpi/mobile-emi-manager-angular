import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User, UserRole } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  user!: User;
  isSuperAdmin = false;

  constructor(
    public router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUser;
    this.isSuperAdmin = this.user?.role === UserRole.ADMIN;
  }

  createAdmin() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 