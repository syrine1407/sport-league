import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EventListComponent } from '../components/list-items/event-list/event-list.component';
import { MatButtonModule } from '@angular/material/button';
import { TeamListComponent } from '../components/list-items/team-list/team-list.component';
import { StadiumListComponent } from '../components/list-items/stadium-list/stadium-list.component';
import { CityListComponent } from '../components/list-items/city-list/city-list.component';
import { EventItemComponent } from '../components/single-items/event-item/event-item.component';
import { StadiumItemComponent } from '../components/single-items/stadium-item/stadium-item.component';
import { CityItemComponent } from '../components/single-items/city-item/city-item.component';
import { TeamItemComponent } from '../components/single-items/team-item/team-item.component';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupEventComponent } from '../components/popups/create-popups/popup-event/popup-event.component';
import { Team } from '../models/team';
import { City } from '../models/city';
import { PopupTeamComponent } from '../components/popups/create-popups/popup-team/popup-team.component';
import { Stadium } from '../models/stadium';
import { Event } from '../models/event';
import { PopupStadiumComponent } from '../components/popups/create-popups/popup-stadium/popup-stadium.component';
import { PopupCityComponent } from '../components/popups/create-popups/popup-city/popup-city.component';
import { Division } from '../models/division';
import { DivisionListComponent } from '../components/list-items/division-list/division-list.component';
import { PopupDivisionComponent } from '../components/popups/create-popups/popup-division/popup-division.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

// Admin Login Dialog Component
@Component({
  selector: 'app-admin-login-dialog',
  template: `
    <div class="login-container">
      <h2 class="login-title">Admin Login</h2>
      <div class="login-form">
        <div class="form-field">
          <label for="username">Username:</label>
          <input id="username" class="input-field" [(ngModel)]="username" required>
          <div class="input-underline"></div>
        </div>
        
        <div class="form-field">
          <label for="password">Password:</label>
          <input id="password" class="input-field" type="password" [(ngModel)]="password" required>
          <div class="input-underline"></div>
        </div>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
      <div class="login-actions">
        <button class="btn-cancel" (click)="onCancel()">Cancel</button>
        <button class="btn-login" (click)="onLogin()">Login</button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      padding: 24px;
      background: linear-gradient(145deg, #ffffff, #f5f5f5);
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .login-title {
      color: #5c2d91;
      font-size: 24px;
      margin-bottom: 24px;
      text-align: center;
      font-weight: 600;
      position: relative;
    }
    
    .login-title:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #5c2d91, #9c27b0);
      transform: translateX(-50%);
      border-radius: 3px;
      animation: widthGrow 0.5s ease-out forwards;
    }
    
    @keyframes widthGrow {
      from { width: 0; }
      to { width: 60px; }
    }
    
    .login-form {
      margin-bottom: 24px;
    }
    
    .form-field {
      margin-bottom: 20px;
      position: relative;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #666;
      font-size: 14px;
      transition: color 0.3s;
    }
    
    .input-field {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s;
      background-color: rgba(255, 255, 255, 0.8);
    }
    
    .input-field:focus {
      outline: none;
      border-color: #5c2d91;
      box-shadow: 0 0 0 3px rgba(92, 45, 145, 0.2);
    }
    
    .input-underline {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 0;
      background: linear-gradient(90deg, #5c2d91, #9c27b0);
      transition: width 0.3s ease;
    }
    
    .input-field:focus + .input-underline {
      width: 100%;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from { width: 0; }
      to { width: 100%; }
    }
    
    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 8px;
      padding: 8px;
      background-color: rgba(244, 67, 54, 0.1);
      border-radius: 4px;
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    .login-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }
    
    .btn-cancel, .btn-login {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-cancel {
      background-color: #f5f5f5;
      color: #666;
    }
    
    .btn-cancel:hover {
      background-color: #e0e0e0;
      transform: translateY(-2px);
    }
    
    .btn-login {
      background: linear-gradient(135deg, #5c2d91, #9c27b0);
      color: white;
      box-shadow: 0 4px 10px rgba(92, 45, 145, 0.3);
    }
    
    .btn-login:hover {
      background: linear-gradient(135deg, #7b3dbd, #c238e0);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(92, 45, 145, 0.4);
    }
    
    .btn-login:active {
      transform: translateY(1px);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminLoginDialogComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<AdminLoginDialogComponent>,
    private router: Router
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onLogin(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      // Add success animation before redirecting
      this.dialogRef.close(true);
      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 300);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    EventListComponent,
    MatButtonModule,
    TeamListComponent,
    StadiumListComponent,
    CityListComponent,
    EventItemComponent,
    StadiumItemComponent,
    CityItemComponent,
    TeamItemComponent,
    MatDialogModule,
    DivisionListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [ApiService],
})
export class HomeComponent implements OnInit {
  teams: Team[] = [];
  cities: City[] = [];
  stadiums: Stadium[] = [];
  events: Event[] = [];
  divisions: Division[] = [];
  selectedListType: string = 'Events'; // Default selected list

  constructor(
    private dialog: MatDialog, 
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Event
    this.apiService.getEvent().subscribe((events) => {
      this.events = events;
    });

    this.apiService.refreshEvents$.subscribe(() => {
      this.apiService.getEvent().subscribe((events) => {
        this.events = events;
      });
    });

    //Team
    this.apiService.getTeam().subscribe((teams) => {
      this.teams = teams;
    });

    this.apiService.refreshTeams$.subscribe(() => {
      this.apiService.getTeam().subscribe((teams) => {
        this.teams = teams;
      });
    });

    //City
    this.apiService.getCity().subscribe((cities) => {
      this.cities = cities;
    });

    this.apiService.refreshCities$.subscribe(() => {
      this.apiService.getCity().subscribe((cities) => {
        this.cities = cities;
      });
    });

    //Stadium
    this.apiService.getStadium().subscribe((stadiums) => {
      this.stadiums = stadiums;
    });

    this.apiService.refreshStadiums$.subscribe(() => {
      this.apiService.getStadium().subscribe((stadiums) => {
        this.stadiums = stadiums;
      });
    });

    //Division
    this.apiService.getDivision().subscribe((divisions) => {
      this.divisions = divisions;
    });

    this.apiService.refreshDivisions$.subscribe(() => {
      this.apiService.getDivision().subscribe((divisions) => {
        this.divisions = divisions;
      });
    });
  }

  refreshHomeEvents() {
    this.apiService.refreshEvents$.next();
  }

  refreshHomeTeams() {
    this.apiService.refreshTeams$.next();

    //To spread and see changes in other components after updation
    this.refreshHomeEvents();
  }
  refreshHomeStadiums() {
    this.apiService.refreshStadiums$.next();

    //To spread and see changes in other components after updation
    this.refreshHomeEvents();
    this.refreshHomeTeams();
  }
  refreshHomeCities() {
    this.apiService.refreshCities$.next();

    //To spread and see changes in other components after updation
    this.refreshHomeEvents();
    this.refreshHomeTeams();
  }

  refreshHomeDivisions() {
    this.apiService.refreshDivisions$.next();

    //To spread and see changes in other components after updation
    this.refreshHomeEvents();
    this.refreshHomeTeams();
  }
  //List entity selector
  onListToggleClick(listType: string) {
    this.selectedListType = listType;
  }

  // CREATE EVENT POPUP
  openEventPopup() {
    const dialogRef = this.dialog.open(PopupEventComponent, {
      width: '40%',
      height: 'auto',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
      data: {
        title: 'Create new event!',
        teams: this.teams,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.refreshEvents$.next(); // Trigger refreshEvents if result === true, so an event was created.
      }
    });
  }

  // CREATE TEAM POPUP
  openTeamPopup() {
    const dialogRef = this.dialog.open(PopupTeamComponent, {
      width: '30%',
      height: 'auto',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
      data: {
        cities: this.cities,
        stadiums: this.stadiums,
        divisions: this.divisions,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.refreshTeams$.next(); // Trigger refreshTeams if result === true, so a team was created.
      }
    });
  }

  // CREATE STADIUM POPUP
  openStadiumPopup() {
    const dialogRef = this.dialog.open(PopupStadiumComponent, {
      width: '20%',
      height: 'auto',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
      data: {
        title: 'Create new Stadium!',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.refreshStadiums$.next(); // Trigger refreshStadiums if result === true, so a team was created.
      }
    });
  }

  // CREATE CITY POPUP
  openCityPopup() {
    const dialogRef = this.dialog.open(PopupCityComponent, {
      width: '20%',
      height: 'auto',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
      data: {
        title: 'Create new City!',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.refreshCities$.next();
      }
    });
  }

  // CREATE DIVISION POPUP
  openDivisionPopup() {
    const dialogRef = this.dialog.open(PopupDivisionComponent, {
      width: '20%',
      height: 'auto',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
      data: {
        title: 'Create new Division!',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.refreshDivisions$.next(); // Trigger refreshDivisions if result === true, so a Division was created.
      }
    });
  }

  // Open Admin Login Dialog
  openAdminLogin() {
    const dialogRef = this.dialog.open(AdminLoginDialogComponent, {
      width: '350px',
      height: 'auto',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Successful login handled in the dialog component
      }
    });
  }
}
