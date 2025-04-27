import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SalesService } from '../../shared/services/sales.service';
import { SalesRecord } from '../../shared/models/sales-record.model';
import { SalesDetailsComponent } from '../sales-details/sales-details.component';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule
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
    private dialog: MatDialog
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
      }
    });
  }

  viewDetails(record: SalesRecord) {
    this.dialog.open(SalesDetailsComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { salesRecord: record }
    });
  }

  createNewRecord() {
    this.router.navigate(['/sales/create']);
  }
} 