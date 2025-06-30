import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { RevenueChartData } from '../../../models/admin-stats';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.css']
})
export class RevenueChartComponent {
  @Input({ required: true }) data!: RevenueChartData;
  
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue by Month'
      }
    }
  };

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: Object.keys(this.data?.revenueByMonth),
    datasets: [
      {
        label: 'Revenue ($)',
        data: Object.values(this.data.revenueByMonth),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
}