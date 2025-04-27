import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SalesRecord } from '../../shared/models/sales-record.model';
import { SalesService } from '../../shared/services/sales.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sales-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.css']
})
export class SalesDetailsComponent implements OnInit {
  salesRecord: SalesRecord;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<SalesDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { salesRecord: SalesRecord },
    private router: Router,
    private salesService: SalesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.salesRecord = data.salesRecord;
  }

  ngOnInit() {
    // No need to load data as it's passed directly
  }

  editRecord() {
    this.dialogRef.close();
    this.router.navigate(['/sales/create'], { queryParams: { id: this.salesRecord.id } });
  }

  deleteRecord() {
    if (!this.salesRecord.id) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the sales record for ${this.salesRecord.customer_name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading = true;
        this.salesService.deleteSalesRecord(this.salesRecord.id!).subscribe({
          next: () => {
            this.showSnackBar('Sales record deleted successfully', 'success');
            this.dialogRef.close({ deleted: true });
          },
          error: (error) => {
            console.error('Error deleting sales record:', error);
            this.showSnackBar('Error deleting sales record', 'error');
            this.loading = false;
          }
        });
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
} 