import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { DataSharingService } from './shared/services/data-sharing.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'mobile-emi-manager';
  userLoggedIn: boolean = false;

  constructor(private authService: AuthService,
    private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.userLoggedIn = this.authService.isLoggedIn;

    this.dataSharingService.getAppHeader().subscribe({
      next: resp => {
        this.userLoggedIn = resp;
      }
    })
  }
}
