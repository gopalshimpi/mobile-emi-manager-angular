import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface EmiScheduleData {
  number_of_emis: number;
  emi_due_date: string;
  emi_amount: number;
}

interface EmiScheduleItem {
  number: number;
  date: Date;
  amount: number;
}

@Component({
  selector: 'app-emi-schedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './emi-schedule-dialog.component.html',
  styleUrls: ['./emi-schedule-dialog.component.css']
})
export class EmiScheduleDialogComponent {
  schedule: EmiScheduleItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmiScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmiScheduleData
  ) {
    this.generateSchedule();
  }

  generateSchedule() {
    const startDate = new Date(this.data.emi_due_date);
    for (let i = 0; i < this.data.number_of_emis; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      this.schedule.push({
        number: i + 1,
        date,
        amount: this.data.emi_amount
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
} 