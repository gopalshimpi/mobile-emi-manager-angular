import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SalesService } from '../../shared/services/sales.service';
import { SalesRecord } from '../../shared/models/sales-record.model';
import { SalesDetailsComponent } from '../sales-details/sales-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  displayedColumns: string[] = [
    'customer_name',
    'mobile_model',
    'price',
    'down_payment_amount',
    'pending_amount',
    'number_of_emis',
    'emi_amount',
    'emi_due_date',
    'actions'
  ];
  dataSource: SalesRecord[] = [];

  constructor(
    private salesService: SalesService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSalesRecords();
  }

  loadSalesRecords() {
    this.salesService.getSalesRecords().subscribe({
      next: (records) => {
        // Calculate pending amount for each record
        this.dataSource = records.map(record => ({
          ...record,
          pending_amount: record.price - record.down_payment_amount
        }));
      },
      error: (error) => {
        console.error('Error loading sales records:', error);
        this.showSnackBar('Error loading sales records', 'error');
      }
    });
  }

  viewDetails(record: SalesRecord) {
    const dialogRef = this.dialog.open(SalesDetailsComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { salesRecord: record }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.deleted) {
        this.loadSalesRecords();
      }
    });
  }

  editRecord(record: SalesRecord) {
    this.router.navigate(['/sales/create'], { queryParams: { id: record.id } });
  }

  deleteRecord(record: SalesRecord) {
    if (!record.id) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the sales record for ${record.customer_name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salesService.deleteSalesRecord(record.id!).subscribe({
          next: () => {
            this.showSnackBar('Sales record deleted successfully', 'success');
            this.loadSalesRecords();
          },
          error: (error) => {
            console.error('Error deleting sales record:', error);
            this.showSnackBar('Error deleting sales record', 'error');
          }
        });
      }
    });
  }

  createNewRecord() {
    this.router.navigate(['/sales/create']);
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
} 