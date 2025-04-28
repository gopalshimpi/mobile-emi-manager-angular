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

  getDashboardSummery() {
    return this.requestService.get(`${ApiUrl.backendUri}/dashboard/summary`);
  }
} 