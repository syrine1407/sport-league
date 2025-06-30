import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { MatchesChartData } from '../../../models/admin-stats';
import { ChartConfiguration, Chart } from 'chart.js';
import { BarController, CategoryScale, LinearScale, BarElement, Legend, Title, Tooltip } from 'chart.js';

// Register the required components
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-matches-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './matches-chart.component.html',
  styleUrls: ['./matches-chart.component.css']
})
export class MatchesChartComponent implements OnInit {
  @Input({ required: true }) data!: MatchesChartData;
  
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Matches Overview'
      }
    }
  };

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Matches per Team',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  ngOnInit() {
    if (this.data && this.data.matchesPerTeam) {
      this.chartData.labels = Object.keys(this.data.matchesPerTeam);
      this.chartData.datasets[0].data = Object.values(this.data.matchesPerTeam);
    }
  }
}