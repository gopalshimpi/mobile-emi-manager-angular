import { Injectable } from '@angular/core';
import { RequestService } from '../requests/request.service';
import { ApiUrl } from '../app-data.constant';
import { StorageService } from './storage.service';
import { AppConst } from '../app-data.constant';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { DataSharingService } from './data-sharing.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private requestService: RequestService,
    private storageService: StorageService,
    private dataSharingService: DataSharingService,
    private router: Router
  ) { }

  login(user: any) {
    return this.requestService.post(`${ApiUrl.backendUri}/${ApiUrl.login}`, user);
  }

  register(user: User): Observable<any> {
    return this.requestService.post(`${ApiUrl.backendUri}/${ApiUrl.users}`, user);
  }

  logout() {
    this.storageService.remove(AppConst.currentUserKey);
    this.storageService.remove(AppConst.token);
    this.dataSharingService.setAppHeader(false);
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.storageService.get(AppConst.token);
  }

  get currentUser(): User {
    return this.storageService.get(AppConst.currentUserKey);
  }

  get isSuperAdmin(): boolean {
     return this.currentUser?.role === 'admin';
  }

  getToken() {
    return this.storageService.get(AppConst.token);
  }

  getAuthHeader() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
  }
}
