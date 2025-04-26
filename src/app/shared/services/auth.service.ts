import { Injectable } from '@angular/core';
import { RequestService } from '../requests/request.service';
import { ApiUrl, AppConst } from '../app-data.constant';
import { StorageService } from './storage.service';

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

  get isLoggedIn() {
    return (this.storageService.get(AppConst.currentUserKey) && this.storageService.get(AppConst.token))
  }
}
