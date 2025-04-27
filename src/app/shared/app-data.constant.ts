import { environment } from "../environments/enviromments";

export class ApiUrl {
  static backendUri = `${environment.backend_uri}`;
  static login = 'login';
  static users = 'users';
}

export class AppConst {
  static currentUserKey = 'currentUser';
  static token = 'token';
}