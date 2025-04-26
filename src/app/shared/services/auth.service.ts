import { Injectable } from '@angular/core';
import { RequestService } from '../requests/request.service';
import { ApiUrl } from '../app-data.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private requestService: RequestService,
  ) { }

  login(user: any) {
    return this.requestService.post(`${ApiUrl.backendUri}/${ApiUrl.login}`, user);
  }
}
