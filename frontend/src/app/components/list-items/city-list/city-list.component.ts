// Import des décorateurs et classes nécessaires depuis Angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Import du modèle City
import { City } from '../../../models/city';
// Import du composant CityItem
import { CityItemComponent } from '../../single-items/city-item/city-item.component';

// Décorateur Component qui définit les métadonnées du composant
@Component({
  selector: 'app-city-list', // Le sélecteur HTML pour ce composant
  standalone: true, // Indique que c'est un composant autonome
  imports: [CityItemComponent], // Import des composants nécessaires
  templateUrl: './city-list.component.html', // Template HTML associé
  styleUrl: './city-list.component.css', // Feuille de style CSS associée
})
export class CityListComponent implements OnInit {
  // Input property: reçoit la liste des villes depuis le composant parent
  @Input() cities: City[] = [];
  
  // Output property: émet un événement pour demander le rafraîchissement des villes
  @Output() refreshHomeCities: EventEmitter<void> = new EventEmitter<void>();

  // Constructeur du composant
  constructor() {}

  // Méthode du cycle de vie OnInit (exécutée après la création du composant)
  ngOnInit() {}

  // Méthode pour déclencher l'événement de rafraîchissement
  refreshCities() {
    this.refreshHomeCities.emit();
  }

  // Méthode pour exporter les données des villes en CSV
  exportToCSV() {
    // Vérification s'il y a des données à exporter
    if (!this.cities || this.cities.length === 0) {
      console.warn('Aucune donnée à exporter');
      return;
    }

    try {
      // 1. Préparation des en-têtes du CSV
      // On prend les clés du premier objet city et on les formate
      const headers = Object.keys(this.cities[0])
        .map(header => this.capitalizeHeader(header))
        .join(',');

      // 2. Préparation des données
      const rows = this.cities.map(city => {
        return Object.values(city)
          .map(value => {
            // Conversion des dates en format ISO
            if (value instanceof Date) {
              return `"${value.toISOString()}"`;
            }
            // Gestion des objets/tableaux (conversion en JSON)
            if (typeof value === 'object' && value !== null) {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            // Gestion des valeurs nulles ou undefined
            if (value === null || value === undefined) {
              return '""';
            }
            // Échappement des guillemets dans les strings
            return `"${value.toString().replace(/"/g, '""')}"`;
          })
          .join(',');
      }).join('\n');

      // 3. Création du contenu CSV complet (en-têtes + données)
      const csvContent = "data:text/csv;charset=utf-8," + headers + '\n' + rows;

      // 4. Encodage de l'URI pour les caractères spéciaux
      const encodedUri = encodeURI(csvContent);

      // 5. Création et déclenchement du téléchargement
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      // Nom du fichier avec la date du jour
      link.setAttribute('download', `cities_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click(); // Déclenche le téléchargement
      document.body.removeChild(link); // Nettoie le DOM

    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
    }
  }

  // Méthode privée pour formater les en-têtes
  private capitalizeHeader(header: string): string {
    return header
      .replace(/([A-Z])/g, ' $1') // Ajoute un espace avant les majuscules
      .replace(/^./, str => str.toUpperCase()) // Capitalise la première lettre
      .trim(); // Supprime les espaces superflus
  }
}