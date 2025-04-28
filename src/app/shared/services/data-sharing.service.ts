import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  public setAppHeaderSub = new Subject();

  constructor() { }

  setAppHeader(message: any) {
    this.setAppHeaderSub.next(message);
  }

  getAppHeader(): Observable<any> {
    return this.setAppHeaderSub.asObservable();
  }
}
