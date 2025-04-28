import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../shared/services/sales.service';


interface EmiScheduleItem {
  installment_number: number;
  due_date: Date;
  amount: number;
  status: string;
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
  saleData: any;
  customerName!: string;

  constructor(
    public dialogRef: MatDialogRef<EmiScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private salesService: SalesService
  ) {}

  ngOnInit() {
    debugger
    this.saleData = this.data;
    this.generateSchedule();
  }

  generateSchedule() {
    this.salesService.getEmiSchedule(this.saleData.id).subscribe({
      next: resp => {

        if(resp && resp.emi_schedule) {
          this.customerName = resp.customer_name;
          this.schedule = resp.emi_schedule;
        }
      }, error: error =>{

      }
    })

    // const startDate = new Date(this.data.emi_due_date);
    // for (let i = 0; i < this.data.number_of_emis; i++) {
    //   const date = new Date(startDate);
    //   date.setMonth(date.getMonth() + i);
    //   this.schedule.push({
    //     number: i + 1,
    //     date,
    //     amount: this.data.emi_amount
    //   });
    // }
  }

  close() {
    this.dialogRef.close();
  }
} 