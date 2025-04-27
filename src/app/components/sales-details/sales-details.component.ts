import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalesRecord } from '../../shared/models/sales-record.model';

@Component({
  selector: 'app-sales-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.css']
})
export class SalesDetailsComponent implements OnInit {
  salesRecord: SalesRecord;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<SalesDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { salesRecord: SalesRecord }
  ) {
    this.salesRecord = data.salesRecord;
  }

  ngOnInit() {
    // No need to load data as it's passed directly
  }

  closeDialog() {
    this.dialogRef.close();
  }
} 