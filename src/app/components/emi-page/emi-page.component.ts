import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-emi-page',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './emi-page.component.html',
  styleUrl: './emi-page.component.scss'
})

export class EmiPageComponent implements AfterViewInit {
  emiList = [
    {
      id: 12,
      emi_amount: '2500.00',
      due_date: '2025-05-02',
      status: 'unpaid',
      sale: {
        customer_name: 'Rahul Sharma'
      }
    }
  ];

  displayedColumns: string[] = ['customer_name', 'emi_amount', 'due_date', 'status', 'actions'];
  dataSource = new MatTableDataSource(this.emiList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {}

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
        emi.status = 'paid';
        this.dataSource.data = [...this.emiList]; // Refresh the table
      }
    });
  }

  isUnpaid(emi: any): boolean {
    return emi.status === 'unpaid';
  }
}
