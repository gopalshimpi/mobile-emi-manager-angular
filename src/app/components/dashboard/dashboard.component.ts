import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/auth.service';
import { SalesRecordComponent } from '../sales-record/sales-record.component';
import { DataSharingService } from '../../shared/services/data-sharing.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  isSuperAdmin = false;

  constructor(
    private authService: AuthService,
    public router: Router,
    private dialog: MatDialog,
    private dataSharingService: DataSharingService) {
    this.user = this.authService.currentUser;
    this.isSuperAdmin = this.user?.role === 'super_admin';
  }

  ngOnInit() {
    if (!this.authService.currentUser) {
      this.router.navigate(['/login']);
    }
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.dataSharingService.setAppHeader(false);
  }
} 