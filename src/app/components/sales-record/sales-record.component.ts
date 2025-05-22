import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SalesService } from '../../shared/services/sales.service';
import { SalesRecord } from '../../shared/models/sales-record.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

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
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.scss']
})
export class SalesRecordComponent implements OnInit {
  salesForm: FormGroup;
  showErrorMsg = false;
  errorMessage = '';
  isEditMode = false;
  recordId: string | null = null;
  isLoading = false;
  isDialog = false;

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() private dialogRef: MatDialogRef<SalesRecordComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { recordId?: string }
  ) {
    this.isDialog = !!dialogRef;
    this.salesForm = this.fb.group({
      customer_name: ['', Validators.required],
      mobile_imei_number: ['', [Validators.required, Validators.pattern(/^\d{15}$/)]],
      customer_mobile_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      mobile_model: ['', Validators.required],
      date_of_purchase: ['', Validators.required],
      pan_number: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      aadhar_number: ['', [Validators.pattern(/^\d{12}$/)]],
      price: ['', [Validators.required, Validators.min(0)]],
      down_payment_amount: ['', [Validators.required, Validators.min(0)]],
      pending_amount: [''],
      number_of_emis: ['', [Validators.required, Validators.min(1)]],
      processing_fees: ['', [Validators.required, Validators.min(0)]],
      emi_amount: [''],
      emi_due_date: ['', Validators.required]
    });

    this.salesForm.valueChanges.subscribe(() => {
      this.calculateAmounts();
    });

    this.salesForm.get('date_of_purchase')?.valueChanges.subscribe(date => {
      if (!this.isEditMode && date) {
        const purchaseDate = new Date(date);
        let year = purchaseDate.getFullYear();
        let month = purchaseDate.getMonth() + 1; // Move to next month

        // Handle December to January transition
        if (month > 11) {
          month = 0; // January
          year += 1;
        }

        const emiDueDate = new Date(year, month, 5); // Set to 5th of next month

        this.salesForm.patchValue(
          { emi_due_date: emiDueDate },
          { emitEvent: false }
        );
      }
    });

  }

  ngOnInit() {
    // Check for recordId in route params or dialog data
    const routeId = this.route.snapshot.queryParams['id'];
    const dialogId = this.data?.recordId;

    if (routeId || dialogId) {
      this.isEditMode = true;
      this.recordId = routeId || dialogId;
      if (this.recordId) {
        this.loadSalesRecord(this.recordId);
      }
    }
  }

  private calculateAmounts() {
    const price = this.salesForm.get('price')?.value || 0;
    const downPayment = parseInt(this.salesForm.get('down_payment_amount')?.value) || 0;
    const processingFees = parseInt(this.salesForm.get('processing_fees')?.value) || 0;
    const numberOfEmis = parseInt(this.salesForm.get('number_of_emis')?.value) || 0;

    const pendingAmount = price - downPayment + processingFees;
    const emiAmount = numberOfEmis > 0 ? Math.ceil((pendingAmount) / numberOfEmis) : 0;

    this.salesForm.patchValue({
      pending_amount: pendingAmount,
      emi_amount: emiAmount
    }, { emitEvent: false });
  }

  private loadSalesRecord(id: string) {
    this.isLoading = true;
    this.salesService.getSalesRecord(parseInt(id)).subscribe({
      next: (record) => {
        this.salesForm.patchValue(record);
        // Disable specific fields in edit mode
        this.salesForm.get('mobile_imei_number')?.disable();
        this.salesForm.get('date_of_purchase')?.disable();
        this.salesForm.get('down_payment_amount')?.disable();
        this.salesForm.get('processing_fees')?.disable();
        this.salesForm.get('number_of_emis')?.disable();
        this.isLoading = false;
      },
      error: (error) => {
        this.showErrorMsg = true;
        this.errorMessage = 'Failed to load sales record. Please try again.';
        this.isLoading = false;
        this.showSnackBar('Error loading sales record', 'error');
      }
    });
  }

  onSubmit() {
    if (this.salesForm.valid) {
      // Enable disabled fields before getting form value
      if (this.isEditMode) {
        this.salesForm.get('mobile_imei_number')?.enable();
        this.salesForm.get('date_of_purchase')?.enable();
        this.salesForm.get('down_payment_amount')?.enable();
        this.salesForm.get('processing_fees')?.enable();
        this.salesForm.get('number_of_emis')?.enable();
      }
      
      const formData = this.salesForm.getRawValue();

      if (this.isEditMode && this.recordId) {
        this.salesService.updateSalesRecord(parseInt(this.recordId), formData).subscribe({
          next: () => {
            this.showSnackBar('Sales record updated successfully', 'success');
            if (this.isDialog) {
              this.dialogRef?.close(true);
            } else {
              this.router.navigate(['/sales']);
            }
          },
          error: (error) => {
            this.showErrorMsg = true;
            this.errorMessage = 'Failed to update sales record. Please try again.';
            this.showSnackBar('Error updating sales record', 'error');
            // Re-disable fields after error
            if (this.isEditMode) {
              this.salesForm.get('mobile_imei_number')?.disable();
              this.salesForm.get('date_of_purchase')?.disable();
              this.salesForm.get('down_payment_amount')?.disable();
              this.salesForm.get('processing_fees')?.disable();
              this.salesForm.get('number_of_emis')?.disable();
            }
          }
        });
      } else {
        this.salesService.createSalesRecord(formData).subscribe({
          next: () => {
            this.showSnackBar('Sales record created successfully', 'success');
            if (this.isDialog) {
              this.dialogRef?.close(true);
            } else {
              this.router.navigate(['/sales']);
            }
          },
          error: (error) => {
            this.showErrorMsg = true;
            if(error.error.errors) {
              this.errorMessage = error.error.errors[0];
              this.showSnackBar(this.errorMessage, 'error');
            } else {
              this.errorMessage = 'Failed to create sales record. Please try again.';
              this.showSnackBar('Error creating sales record', 'error');
            }
          }
        });
      }
    }
  }

  onCancel() {
    if (this.isDialog) {
      this.dialogRef?.close();
    } else {
      this.router.navigate(['/sales']);
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
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