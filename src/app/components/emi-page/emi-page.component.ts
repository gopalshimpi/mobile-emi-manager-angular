import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SalesService } from '../../shared/services/sales.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-emi-page',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatIconModule, MatButtonModule, MatCardModule, 
    MatSnackBarModule],
  templateUrl: './emi-page.component.html',
  styleUrl: './emi-page.component.scss'
})

export class EmiPageComponent implements AfterViewInit {
  emiList: any[] = [];

  displayedColumns: string[] = ['customer_name', 'emi_amount', 'due_date', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog,
     private salesService: SalesService,
     private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.fetchUpcommingEmis();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  markAsPaid(emi: any) {
    debugger
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Mark as Paid',
        message: `Are you sure you want to mark this EMI as paid?`,
        confirmText: 'Yes, Mark as Paid',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.handleMarkAsPaid(emi.id);
      }
    });
  }

  fetchUpcommingEmis() {
    this.salesService.getUpcommingEmis().subscribe({
      next: resp => {
        if(resp) {
          this.emiList = resp;
          this.dataSource = new MatTableDataSource(this.emiList);
        }
      }, error: error => {

      }
    })
  }

  handleMarkAsPaid(emiId: number) {
    this.salesService.markEmiAsPaid(emiId).subscribe({
      next: resp => {
        this.showSnackBar(`${resp.message}`, 'success');
        this.fetchUpcommingEmis();
      }, error: error => {

      }
    })
  }

  isUnpaid(emi: any): boolean {
    return emi.status === 'unpaid';
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
