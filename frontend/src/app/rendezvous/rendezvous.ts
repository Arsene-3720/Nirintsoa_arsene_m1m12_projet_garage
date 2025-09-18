import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/services';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Creneau {
  debut: string;
  fin: string;
}

interface Vehicule {
  _id: string;
  marque: string;
  modele: string;
  immatriculation: string;
}

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rendezvous.html',
})
export class RendezvousComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  sousService = signal<any | null>(null);
  creneauxDisponibles = signal<Creneau[]>([]);
  creneauSelectionne = signal<Creneau | null>(null);
  vehicules = signal<Vehicule[]>([]);
  vehiculeSelectionne = signal<Vehicule | null>(null);

  dateChoisie = signal<string>(new Date().toISOString().split('T')[0]);
  dateMin: string = '';

  form = {
    emailClient: ''
  };

  nomClientConnecte = computed(() => {
    const user = this.authService.userSubject.value;
    return user ? user.nom : '';
  });

  ngOnInit() {
    // Date minimale pour la réservation
    const today = new Date();
    if (today.getHours() >= 18) today.setDate(today.getDate() + 1);
    this.dateMin = today.toISOString().split('T')[0];
    this.dateChoisie.set(this.dateMin);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Charger le sous-service
    this.http.get(`${environment.apiUrl}/sousservices/${id}`).subscribe({
      next: (data: any) => this.sousService.set(data),
      error: () => this.sousService.set(null)
    });

    // Récupérer les véhicules du client connecté
    this.authService.user$.subscribe(user => {
      if (!user) return;

      this.form.emailClient = user.email || '';
      this.http.get<Vehicule[]>(`${environment.apiUrl}/clients/${user.refId}/vehicules`)
        .subscribe({
          next: data => this.vehicules.set(data),
          error: () => this.vehicules.set([])
        });
    });

    // Charger les créneaux disponibles pour aujourd'hui
    this.chargerCreneaux(id, this.dateChoisie());
  }

  chargerCreneaux(sousServiceId: string, date: string) {
    this.http.get<Creneau[]>(`${environment.apiUrl}/creneaux/${sousServiceId}?date=${date}`)
      .subscribe({
        next: data => this.creneauxDisponibles.set(data),
        error: err => this.creneauxDisponibles.set([])
      });
    this.creneauSelectionne.set(null);
  }

  selectCreneau(c: Creneau) {
    this.creneauSelectionne.set(c);
  }

  selectVehicule(id: string) {
    const vehicule = this.vehicules().find(v => v._id === id) || null;
    this.vehiculeSelectionne.set(vehicule);
  }

  prendreRDV() {
    if (!this.creneauSelectionne()) { alert('Veuillez choisir un créneau.'); return; }
    if (!this.vehiculeSelectionne()) { alert('Veuillez choisir un véhicule.'); return; }

    this.authService.user$.subscribe(user => {
      if (!user) return;

      const payload = {
        client: user._id,
        vehicule: this.vehiculeSelectionne()?._id,
        sousService: this.sousService()?._id,
        nomClient: this.nomClientConnecte(),
        date: this.dateChoisie(),
        heureDebut: this.creneauSelectionne()?.debut,
        heureFin: this.creneauSelectionne()?.fin,
        urgence: false
      };

      this.http.post(`${environment.apiUrl}/rendezvous`, payload)
        .subscribe({
          next: () => {
            alert('Rendez-vous créé avec succès !');
            this.router.navigate(['/profile']);
          },
          error: err => alert('Erreur lors de la création du rendez-vous : ' + err.message)
        });
    });
  }
}
