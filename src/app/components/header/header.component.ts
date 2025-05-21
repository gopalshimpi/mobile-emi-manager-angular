import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  isSuperAdmin = false;
  shopName = 'My Shop';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.currentUser;
    this.isSuperAdmin = this.authService.isSuperAdmin;
  }

  ngOnInit() {
    if (!this.authService.currentUser) {
      this.router.navigate(['/login']);
    }

    if(this.user?.shop_name) {
      this.shopName = this.user?.shop_name;
    }
    
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToSales() {
    this.router.navigate(['/sales']);
  }

  navigateToCreateAdmin() {
    this.router.navigate(['/register']);
  }

  navigateToEmiPage() {
    this.router.navigate(['/emi']);
  }
} 