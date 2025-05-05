import { environment } from "../../environments/environment";

export class ApiUrl {
  static backendUri = `${environment.apiUrl}`;
  static login = 'login';
  static users = 'users';
}

export class AppConst {
  static currentUserKey = 'currentUser';
  static token = 'token';
}