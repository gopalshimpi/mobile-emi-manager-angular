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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface DashboardStats {
  total_sales: number;
  total_sale_amount: number;
  total_pending_amount: number;
  total_paid_emis: number;
  total_unpaid_emis: number;
  upcoming_emis_in_next_7_days: number;
  total_processing_fees: number;
  total_down_payment_received: number;
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
    MatNativeDateModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    MatProgressSpinnerModule,
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
    upcoming_emis_in_next_7_days: 0,
    total_processing_fees: 0,
    total_down_payment_received: 0
  };

  filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];
  selectedFilter = 'today';
  dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
  dateRangeFilter: string = '';
  isLoading = false;

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

    this.fetchDashboardStats(false);
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

  fetchDashboardStats(isCustomDate: boolean) {
    this.isLoading = true;
    this.saleService.getDashboardSummery(isCustomDate, this.selectedFilter, this.dateRangeFilter).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.stats = {
          total_sales: 0,
          total_sale_amount: 0,
          total_pending_amount: 0,
          total_paid_emis: 0,
          total_unpaid_emis: 0,
          upcoming_emis_in_next_7_days: 0,
          total_processing_fees: 0,
          total_down_payment_received: 0
        };
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.dataSharingService.setAppHeader(false);
  }

  onFilterChange(value: string) {
    this.selectedFilter = value;
    this.fetchDashboardStats(false);
    this.dateRange.start = null;
    this.dateRange.end = null;
  }

  onDateRangeChange(event: MatDatepickerInputEvent<Date>) {
    if (this.dateRange.start && this.dateRange.end) {
      const startDate = this.formatDate(this.dateRange.start);
      const endDate = this.formatDate(this.dateRange.end);
      this.dateRangeFilter = `start_date=${startDate}&end_date=${endDate}`;
      this.fetchDashboardStats(true);
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD"
  }

} 