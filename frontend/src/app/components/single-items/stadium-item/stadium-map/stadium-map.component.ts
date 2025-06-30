import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Stadium } from '../../../../models/stadium';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';

@Component({
  selector: 'app-stadium-map',
  templateUrl: './stadium-map.component.html',
  styleUrls: ['./stadium-map.component.css'],
  standalone: true,
})
export class StadiumMapComponent implements OnInit, OnChanges {
  @Input() stadiums: Stadium[] = [];
  private map!: L.Map;
  private markers: L.Marker[] = [];

  ngOnInit(): void {
    this.fixMarkerIcons(); // Fix marker icons before initializing map
    this.initMap();
  }

  private fixMarkerIcons(): void {
    // Fix for default marker icons
    const iconRetinaUrl = 'assets/leaflet/images/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/images/marker-icon.png';
    const shadowUrl = 'assets/leaflet/images/marker-shadow.png';
    
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    
    Marker.prototype.options.icon = iconDefault;
  }

  private initMap(): void {
    // Default coordinates (center of your map)
    const defaultLat = 39.8282;
    const defaultLng = -98.5795;
    
    this.map = L.map('map').setView([defaultLat, defaultLng], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add markers for each stadium
    this.addStadiumMarkers();
  }

  private addStadiumMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    this.stadiums.forEach(stadium => {
      if (stadium.latitude && stadium.longitude) {
        const marker = L.marker([stadium.latitude, stadium.longitude])
          .addTo(this.map)
          .bindPopup(`
            <b>${stadium.name}</b><br>
            Capacity: ${stadium.capacity}<br>
            ${stadium.address ? `Address: ${stadium.address}` : ''}
          `);
        this.markers.push(marker);
      }
    });

    // Fit map to markers if there are any
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  ngOnChanges(): void {
    if (this.map) {
      this.addStadiumMarkers();
    }
  }
}