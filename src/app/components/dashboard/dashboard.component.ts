import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/auth.service';
import { SalesRecordComponent } from '../sales-record/sales-record.component';
import { DataSharingService } from '../../shared/services/data-sharing.service';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { SalesService } from '../../shared/services/sales.service';

interface DashboardStats {
  total_sales: number;
  total_sale_amount: number;
  total_pending_amount: number;
  total_paid_emis: number;
  total_unpaid_emis: number;
  upcoming_emis_in_next_7_days: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  isSuperAdmin = false;
  stats: DashboardStats = {
    total_sales: 0,
    total_sale_amount: 0,
    total_pending_amount: 0,
    total_paid_emis: 0,
    total_unpaid_emis: 0,
    upcoming_emis_in_next_7_days: 0
  };

  constructor(
    private authService: AuthService,
    public router: Router,
    private dialog: MatDialog,
    private dataSharingService: DataSharingService,
    private saleService: SalesService
  ) {
    this.user = this.authService.currentUser;
    this.isSuperAdmin = this.user?.role === 'super_admin';
  }

  ngOnInit() {
    if (!this.authService.currentUser) {
      this.router.navigate(['/login']);
    }

    this.fetchDashboardStats();
  }

  createAdmin() {
    this.router.navigate(['/register']);
  }

  createSalesRecord() {
    const dialogRef = this.dialog.open(SalesRecordComponent, {
      width: '800px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/sales']);
      }
    });
  }

  fetchDashboardStats() {
    this.saleService.getDashboardSummery().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        this.stats = {
          total_sales: 0,
          total_sale_amount: 0,
          total_pending_amount: 0,
          total_paid_emis: 0,
          total_unpaid_emis: 0,
          upcoming_emis_in_next_7_days: 0
        };
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.dataSharingService.setAppHeader(false);
  }
} 