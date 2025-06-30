import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { MatDialog } from '@angular/material/dialog';
import { Event } from '../../../../models/event';
import { EventDetailPopupComponent } from '../../../popups/event-detail-popup/event-detail-popup.component';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.css'],
  standalone: true,
  imports: [FullCalendarModule]
})
export class EventCalendarComponent {
  @Input() events: Event[] = [];
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: CalendarOptions;

  constructor(
    public dialogRef: MatDialogRef<EventCalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { events: Event[] },
    private dialog: MatDialog
  ) {
    this.events = data.events;
    
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      events: this.events.map(event => ({
        title: `${event.homeTeam.name} vs ${event.awayTeam.name}`,
        start: event.date,
        extendedProps: {
          event: event
        }
      })),
      eventMouseEnter: (mouseEnterInfo) => {
        mouseEnterInfo.el.style.cursor = 'pointer';
      },
      eventClick: (clickInfo: EventClickArg) => {
        this.openEventDetails(clickInfo.event.extendedProps['event']);
      },
      eventContent: (arg) => {
        return {
          html: `
            <div class="fc-event-main">
              <div class="fc-event-title">${arg.event.title}</div>
              <div class="fc-event-time">${arg.event.extendedProps['event'].time}</div>
            </div>
          `
        };
      }
    };
  }

  openEventDetails(event: Event): void {
    this.dialog.open(EventDetailPopupComponent, {
      width: '700px',
      data: event
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
  // Add these navigation methods
  nextWeek(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }
  
  previousWeek(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
  }
  
  goToToday(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.today();
  }
}