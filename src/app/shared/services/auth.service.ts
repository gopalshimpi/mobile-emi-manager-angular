import { Injectable } from '@angular/core';
import { RequestService } from '../requests/request.service';
import { ApiUrl } from '../app-data.constant';
import { StorageService } from './storage.service';
import { AppConst } from '../app-data.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private requestService: RequestService,
    private storageService: StorageService
  ) { }

  login(user: any) {
    return this.requestService.post(`${ApiUrl.backendUri}/${ApiUrl.login}`, user);
  }

  logout() {
    this.storageService.remove(AppConst.currentUserKey);
    this.storageService.remove(AppConst.token);
  }

  get isLoggedIn(): boolean {
    return !!this.storageService.get(AppConst.token);
  }

  get currentUser() {
    return this.storageService.get(AppConst.currentUserKey);
  }
}
