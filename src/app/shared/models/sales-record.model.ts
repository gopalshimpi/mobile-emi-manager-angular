export interface SalesRecord {
  id?: number;
  customer_name: string;
  mobile_imei_number: string;
  customer_mobile_number: string;
  mobile_model: string;
  date_of_purchase: Date;
  pan_number: string;
  aadhar_number: string;
  price: number;
  down_payment_amount: number;
  pending_amount: number;
  number_of_emis: number;
  processing_fees: number;
  emi_amount: number;
  emi_due_date: Date;
  created_by?: number;
  created_at?: Date;
  updated_at?: Date;
} 