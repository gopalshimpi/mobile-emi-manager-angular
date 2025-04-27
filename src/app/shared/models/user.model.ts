export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  contact_number?: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
