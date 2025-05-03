import { Injectable } from '@angular/core';
import { RequestService } from '../requests/request.service';
import { ApiUrl } from '../app-data.constant';
import { SalesRecord } from '../models/sales-record.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  constructor(private requestService: RequestService) { }

  createSalesRecord(record: SalesRecord): Observable<SalesRecord> {
    return this.requestService.post(`${ApiUrl.backendUri}/sales`, record);
  }

  getSalesRecords(): Observable<SalesRecord[]> {
    return this.requestService.get(`${ApiUrl.backendUri}/sales`);
  }

  getSalesRecord(id: number): Observable<SalesRecord> {
    return this.requestService.get(`${ApiUrl.backendUri}/sales/${id}`);
  }

  updateSalesRecord(id: number, record: SalesRecord): Observable<SalesRecord> {
    return this.requestService.put(`${ApiUrl.backendUri}/sales/${id}`, record);
  }

  deleteSalesRecord(id: number): Observable<any> {
    return this.requestService.delete(`${ApiUrl.backendUri}/sales/${id}`);
  }

  getDashboardSummery(isCustomDate: boolean, filterParams: any, customDate: any) {
    let url = `dashboard/summary?filter=${filterParams}`;

    if(isCustomDate) url = `dashboard/summary?${customDate}`; 

    return this.requestService.get(`${ApiUrl.backendUri}/${url}`);
  }

  getEmiSchedule(saleId: number) {
    return this.requestService.get(`${ApiUrl.backendUri}/sales/${saleId}/emi_schedule`);
  }

  getUpcommingEmis() {
    return this.requestService.get(`${ApiUrl.backendUri}/emis/upcoming_emis`);
  }

  markEmiAsPaid(emiId: number) {
    return this.requestService.patch(`${ApiUrl.backendUri}/emis/${emiId}/mark_as_paid`, {});
  }
} 