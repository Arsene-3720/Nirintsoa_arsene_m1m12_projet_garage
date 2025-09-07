import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-mecanicien',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class DashboardMecanicienComponent {
  router = inject(Router);
  http = inject(HttpClient);

  mecanicien: any = null;
  tachesEnAttente = [];
  tachesEnCours = [];

  ngOnInit() {
    // Exemple : tu peux remplacer ça par un vrai service/token
    const data = localStorage.getItem('mecanicien');
    if (data) {
      this.mecanicien = JSON.parse(data);
      this.mecanicien.taches = [
      { titre: 'Vidange moteur', date: '2025-07-30', heure: '09:00', statut: 'en_attente', groupe: false },
      { titre: 'Changement freins', date: '2025-07-28', heure: '10:30', statut: 'en_cours', groupe: true }
    ];

    // this.tachesEnAttente = this.mecanicien.taches.filter(t => t.statut === 'en_attente');
    // this.tachesEnCours = this.mecanicien.taches.filter(t => t.statut === 'en_cours');
    } else {
      this.router.navigate(['/mecanicien/connexion']);
    }
    
  }

  logout() {
    localStorage.removeItem('mecanicien');
    this.router.navigate(['/mecanicien/connexion']);
  }
}
