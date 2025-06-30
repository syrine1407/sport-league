import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStats } from '../../../models/admin-stats';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent {
  @Input({ required: true }) stats!: AdminStats;
}