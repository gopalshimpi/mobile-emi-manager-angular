import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SalesService } from '../../shared/services/sales.service';
import { SalesRecord } from '../../shared/models/sales-record.model';

@Component({
  selector: 'app-sales-record',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.scss']
})
export class SalesRecordComponent {
  salesForm: FormGroup;
  showErrorMsg = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private salesService: SalesService
  ) {
    this.salesForm = this.fb.group({
      customer_name: ['', [Validators.required]],
      mobile_imei_number: ['', [Validators.required, Validators.pattern('^[0-9]{15}$')]],
      customer_mobile_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mobile_model: ['', [Validators.required]],
      date_of_purchase: ['', [Validators.required]],
      pan_number: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      aadhar_number: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      price: ['', [Validators.required, Validators.min(0)]],
      down_payment_amount: ['', [Validators.required, Validators.min(0)]],
      pending_amount: ['', [Validators.required, Validators.min(0)]],
      number_of_emis: ['', [Validators.required, Validators.min(1)]],
      processing_fees: ['', [Validators.required, Validators.min(0)]],
      emi_amount: ['', [Validators.required, Validators.min(0)]],
      emi_due_date: ['', [Validators.required]]
    });

    // Subscribe to price and down payment changes for pending amount calculation
    this.salesForm.get('price')?.valueChanges.subscribe(() => this.calculatePendingAmount());
    this.salesForm.get('down_payment_amount')?.valueChanges.subscribe(() => this.calculatePendingAmount());

    // Subscribe to pending amount and number of EMIs changes for EMI amount calculation
    this.salesForm.get('pending_amount')?.valueChanges.subscribe(() => this.calculateEMIAmount());
    this.salesForm.get('number_of_emis')?.valueChanges.subscribe(() => this.calculateEMIAmount());
  }

  calculatePendingAmount() {
    const price = parseFloat(this.salesForm.get('price')?.value || '0');
    const downPayment = parseFloat(this.salesForm.get('down_payment_amount')?.value || '0');
    
    if (price >= 0 && downPayment >= 0) {
      const pendingAmount = price - downPayment;
      this.salesForm.get('pending_amount')?.setValue(pendingAmount.toFixed(2), { emitEvent: false });
      this.calculateEMIAmount(); // Recalculate EMI amount when pending amount changes
    }
  }

  calculateEMIAmount() {
    const pendingAmount = parseFloat(this.salesForm.get('pending_amount')?.value || '0');
    const numberOfEMIs = parseInt(this.salesForm.get('number_of_emis')?.value || '0');
    
    if (pendingAmount > 0 && numberOfEMIs > 0) {
      const emiAmount = pendingAmount / numberOfEMIs;
      this.salesForm.get('emi_amount')?.setValue(emiAmount.toFixed(2), { emitEvent: false });
    }
  }

  onSubmit() {
    this.showErrorMsg = false;
    if (this.salesForm.valid) {
      const record: SalesRecord = {
        ...this.salesForm.value,
        date_of_purchase: new Date(this.salesForm.value.date_of_purchase),
        emi_due_date: new Date(this.salesForm.value.emi_due_date)
      };
      
      this.salesService.createSalesRecord(record).subscribe({
        next: (resp) => {
          if (resp) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.showErrorMsg = true;
          this.errorMessage = error.error?.message || 'Failed to create sales record. Please try again.';
        }
      });
    }
  }

  get customer_name() {
    return this.salesForm.get('customer_name');
  }

  get mobile_imei_number() {
    return this.salesForm.get('mobile_imei_number');
  }

  get customer_mobile_number() {
    return this.salesForm.get('customer_mobile_number');
  }

  get mobile_model() {
    return this.salesForm.get('mobile_model');
  }

  get date_of_purchase() {
    return this.salesForm.get('date_of_purchase');
  }

  get pan_number() {
    return this.salesForm.get('pan_number');
  }

  get aadhar_number() {
    return this.salesForm.get('aadhar_number');
  }

  get price() {
    return this.salesForm.get('price');
  }

  get down_payment_amount() {
    return this.salesForm.get('down_payment_amount');
  }

  get pending_amount() {
    return this.salesForm.get('pending_amount');
  }

  get number_of_emis() {
    return this.salesForm.get('number_of_emis');
  }

  get processing_fees() {
    return this.salesForm.get('processing_fees');
  }

  get emi_amount() {
    return this.salesForm.get('emi_amount');
  }

  get emi_due_date() {
    return this.salesForm.get('emi_due_date');
  }
} 