import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Stadium } from '../../../models/stadium';
import { StadiumItemComponent } from '../../single-items/stadium-item/stadium-item.component';
import { StadiumMapComponent } from '../../single-items/stadium-item/stadium-map/stadium-map.component';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [StadiumItemComponent, StadiumMapComponent],
  templateUrl: './stadium-list.component.html',
  styleUrls: ['./stadium-list.component.css']
})
export class StadiumListComponent implements OnInit {
  @Input() stadiums: Stadium[] = [];
  @Input() isFirst: boolean = false;
  @Output() refreshHomeStadiums: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('exportContent') exportContent!: ElementRef;

  constructor() {}

  ngOnInit() {}

  refreshStadiums() {
    this.refreshHomeStadiums.emit();
  }

  exportToCSV() {
    if (!this.stadiums || this.stadiums.length === 0) {
      console.warn('Aucun stade à exporter');
      return;
    }

    const headers = Object.keys(this.stadiums[0]);
    let csvContent = headers.join(';') + '\n';

    this.stadiums.forEach(stadium => {
      const row = headers.map(header => {
        const value = stadium[header as keyof Stadium] ?? '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvContent += row.join(';') + '\n';
    });

    this.downloadFile(csvContent, 'stades_export.csv', 'text/csv');
  }

  async exportToPDF() {
    if (!this.exportContent?.nativeElement) {
      console.warn('Aucun contenu à exporter en PDF');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(this.exportContent.nativeElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('stades_export.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  }

  private downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}