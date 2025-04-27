import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { SalesRecordComponent } from './components/sales-record/sales-record.component';
import { SalesDetailsComponent } from './components/sales-details/sales-details.component';

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
    path: 'sales/:id', 
    component: SalesDetailsComponent 
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  }
];
