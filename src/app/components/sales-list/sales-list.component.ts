import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { SalesService } from '../../shared/services/sales.service';
import { SalesRecord } from '../../shared/models/sales-record.model';
import { SalesDetailsComponent } from '../sales-details/sales-details.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SalesRecordComponent } from '../sales-record/sales-record.component';
import { MatNativeDateModule } from '@angular/material/core';
import { EmiScheduleDialogComponent } from '../emi-schedule-dialog/emi-schedule-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';

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
    MatTooltipModule,
    MatPaginatorModule,
    MatNativeDateModule,
    NgxPaginationModule,
    MatMenuModule
  ],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  displayedColumns: string[] = [
    'customer_name',
    'mobile_model',
    'price',
    'down_payment_amount',
    'pending_amount',
    'number_of_emis',
    'remaining_emis',
    'emi_amount',
    'emi_due_date',
    'next_emi_due_date',
    'actions'
  ];
  dataSource = new MatTableDataSource<SalesRecord>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  salesList: Array<SalesRecord> = [];
  totalLists = 0;
  itemsPerPage = 5;
  page = 1;

  constructor(
    private salesService: SalesService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadSalesRecords();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadSalesRecords() {
    this.salesService.getSalesRecords(this.page, this.itemsPerPage).subscribe({
      next: (resp: any) => {
        this.salesList = resp.sales;
        this.totalLists = resp.total_records;
        this.page = resp.current_page;
        this.itemsPerPage = resp.per_page;
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
    const dialogRef = this.dialog.open(SalesRecordComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { recordId: record.id?.toString() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSalesRecords();
      }
    });
  }

  deleteRecord(record: SalesRecord) {
    if (!record.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
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
    const dialogRef = this.dialog.open(SalesRecordComponent, {
      width: '800px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSalesRecords();
      }
    });
  }

  viewEmiSchedule(record: SalesRecord) {
    this.dialog.open(EmiScheduleDialogComponent, {
      width: '500px',
      data: record
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;  // Page index starts from 0
    this.itemsPerPage = event.pageSize;
    this.loadSalesRecords();
  }

  perPageChange(perPage: any) {
    this.itemsPerPage = perPage;
    this.page = 1;
    this.loadSalesRecords();
  }
} 