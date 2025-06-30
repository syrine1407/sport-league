import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-monthly-revenue-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './monthly-revenue-chart.component.html',
  styleUrls: ['./monthly-revenue-chart.component.css']
})
export class MonthlyRevenueChartComponent implements OnInit {
  @Input({ required: true }) monthlyRevenue!: Record<string, number>;
  
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Monthly Revenue'
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw?.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  chartData!: ChartConfiguration<'bar'>['data'];

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  private updateChart() {
    if (!this.monthlyRevenue) return;
    
    this.chartData = {
      labels: Object.keys(this.monthlyRevenue),
      datasets: [{
        data: Object.values(this.monthlyRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  }
}