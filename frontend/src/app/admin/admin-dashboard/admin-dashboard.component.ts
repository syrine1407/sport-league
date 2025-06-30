import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardsComponent } from './components/stats-cards/stats-cards.component';
import { MatchesChartComponent } from './components/matches-chart/matches-chart.component';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { MonthlyRevenueChartComponent } from './components/monthly-revenue-chart/monthly-revenue-chart.component';
import { AdminStats } from '../models/admin-stats';
import { ApiService } from '../../service/api.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsCardsComponent,
    MatchesChartComponent,
    RevenueChartComponent,
    MonthlyRevenueChartComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  stats!: AdminStats;
  monthlyRevenue: Record<string, number> = {};
  loading = true;
  sidebarCollapsed = false;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.apiService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadMonthlyRevenue();
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }

  private loadMonthlyRevenue() {
    this.apiService.getMonthlyRevenue().subscribe({
      next: (data) => {
        this.monthlyRevenue = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading monthly revenue:', err);
        this.loading = false;
      }
    });
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}