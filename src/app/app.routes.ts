import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { SalesRecordComponent } from './components/sales-record/sales-record.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'sales/create', 
    component: SalesRecordComponent 
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  }
];
