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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emi-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule
  ],
  templateUrl: './emi-page.component.html',
  styleUrl: './emi-page.component.scss'
})

export class EmiPageComponent implements AfterViewInit {
  emiList: any[] = [];
  overDueEmiList: any[] = [];
  isOverdueTab = false;

  displayedColumns: string[] = ['customer_name','customer_mobile_number', 'emi_amount', 'due_date', 'status', 'actions'];
  overdueDisplayedColumns: string[] = ['customer_name', 'customer_mobile_number','emi_amount', 'due_date', 'days_overdue', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  overdueDataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog,
     private salesService: SalesService,
     private snackBar: MatSnackBar, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
          this.isOverdueTab = params['overdue'];      
        });
      
     }

  ngOnInit() {
    this.fetchUpcommingEmis();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  markAsPaid(emi: any) {
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
          this.emiList = resp.upcoming_emis;
          this.overDueEmiList = resp.overdue_emis;
          this.dataSource = new MatTableDataSource(this.emiList);
          this.overdueDataSource = new MatTableDataSource(this.overDueEmiList);
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

  private isOverdue(emi: any): boolean {
    if (emi.status === 'paid') return false;
    const dueDate = new Date(emi.due_date);
    const today = new Date();
    return dueDate < today;
  }

  getDaysOverdue(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
