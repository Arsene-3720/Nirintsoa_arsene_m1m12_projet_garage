
import { Router, RouterLink } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService, Service, SousService } from '../services/services';
import { AuthService } from '../services/services';


@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, ConnexionComponent, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil {
  afficherConnexion = signal<boolean>(false);

  private serviceApi = inject(ServicesService);
  services = signal<Service[]>([]);
  sousServices = signal<SousService[]>([]);
  activeServiceId = signal<string | null>(null); // Id du service sélectionné

  // Auth
  public authService = inject(AuthService);
  isConnected$ = this.authService.isConnected$;

  constructor() {
    // Récupérer tous les services
    this.serviceApi.getServices().subscribe({
      next: data => this.services.set(data),
      error: () => this.services.set([])
    });

    // Récupérer tous les sous-services
    this.serviceApi.getSousServices().subscribe({
      next: data => this.sousServices.set(data),
      error: () => this.sousServices.set([])
    });

  }

    // Toggle formulaire de connexion
  toggleConnexion() {
    if (this.authService.isLoggedIn()) {
      // Déconnexion
      this.authService.logout();
      this.afficherConnexion.set(false);
    } else {
      // Afficher le formulaire
      this.afficherConnexion.update(v => !v);
    }
  }

  get boutonConnexionLabel() {
  return this.authService.isConnected() ? 'Déconnexion' : (this.afficherConnexion() ? 'Retour' : 'Connexion');
}


  toggleSousServices(serviceId: string) {
    // Si on clique sur le même service, on cache, sinon on affiche
    if (this.activeServiceId() === serviceId) {
      this.activeServiceId.set(null);
    } else {
      this.activeServiceId.set(serviceId);
    }
  }

  getSousServicesPour(serviceId: string) {
  return this.sousServices().filter(ss => ss.service._id === serviceId);
}
}



