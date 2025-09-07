// rendezvous-creneaux.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreneauService } from '../../services/services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rendezvous-creneaux',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './creneaux.html',
})
export class RendezvousCreneauxComponent {
  private creneauService = inject(CreneauService);

  sousServiceId = ''; // récupéré depuis route param ou selection du client
  selectedDate = '';  // date choisie par le client
  creneauxDisponibles: { debut: string, fin: string }[] = [];

  selectedCreneau: { debut: string, fin: string } | null = null;

  // Charger les créneaux depuis le backend
  chargerCreneaux() {
    if (!this.sousServiceId || !this.selectedDate) return;
    this.creneauService.getCreneaux(this.sousServiceId, this.selectedDate)
      .subscribe(data => this.creneauxDisponibles = data);
  }

  // Sélection du créneau
  selectCreneau(creneau: { debut: string, fin: string }) {
    this.selectedCreneau = creneau;
  }
}
