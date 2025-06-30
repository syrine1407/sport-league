import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from '../../../../models/event';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-match-qr-code',
  standalone: true,
  imports: [QRCodeModule, CommonModule, MatButtonModule],
  templateUrl: './match-qr-code.component.html',
  styleUrls: ['./match-qr-code.component.css']
})
export class MatchQrCodeComponent {
  constructor(
    public dialogRef: MatDialogRef<MatchQrCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public match: Event
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  get qrData(): string {
    return JSON.stringify({
      matchId: this.match.uuid,
      homeTeam: this.match.homeTeam.name,
      awayTeam: this.match.awayTeam.name,
      date: this.match.date,
      time: this.match.time,
      stadium: this.match.stadium?.name,
      address: this.match.stadium?.address,
      coordinates: {
        lat: this.match.stadium?.latitude,
        lng: this.match.stadium?.longitude
      }
    });
  }
}