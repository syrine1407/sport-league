import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Stadium } from '../../../models/stadium';
import { StadiumItemComponent } from '../../single-items/stadium-item/stadium-item.component';
import { StadiumMapComponent } from '../../single-items/stadium-item/stadium-map/stadium-map.component';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [StadiumItemComponent, StadiumMapComponent],
  templateUrl: './stadium-list.component.html',
  styleUrl: './stadium-list.component.css',
})
export class StadiumListComponent implements OnInit {
  @Input() stadiums: Stadium[] = [];
  @Input() isFirst: boolean = false;
  @Output() refreshHomeStadiums: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  refreshStadiums() {
    this.refreshHomeStadiums.emit();
  }
}