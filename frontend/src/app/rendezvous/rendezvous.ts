import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthService } from '../services/services';

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
  private router = inject(Router);
  private authService = inject(AuthService);

  sousService = signal<any | null>(null);
  creneauxDisponibles = signal<Creneau[]>([]);
  creneauSelectionne = signal<Creneau | null>(null);

  vehicules = signal<Vehicule[]>([]);
  vehiculeSelectionne = signal<Vehicule | null>(null);

  dateChoisie = signal<string>(new Date().toISOString().split('T')[0]);

  form = {
    nomClient: '',
    commentaire: ''
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // 1️⃣ Charger le sous-service
    this.http.get(`http://localhost:5000/api/sousservices/${id}`).subscribe({
      next: (data: any) => this.sousService.set(data),
      error: () => this.sousService.set(null)
    });

    // 2️⃣ Récupérer les véhicules du client connecté
    this.authService.user$.subscribe(user => {
      if (!user) return;

      this.form.nomClient = user.nom || ''; // nom du client
      this.http.get<Vehicule[]>(`http://localhost:5000/api/clients/${user.refId}/vehicules`)
        .subscribe({
          next: data => this.vehicules.set(data),
          error: () => this.vehicules.set([])
        });
    });

    // 3️⃣ Charger les créneaux disponibles
    if (id) this.chargerCreneaux(id, this.dateChoisie());
  }

  chargerCreneaux(sousServiceId: string, date: string) {
    this.http.get<Creneau[]>(`http://localhost:5000/api/creneaux/${sousServiceId}?date=${date}`)
      .subscribe({
        next: data => this.creneauxDisponibles.set(data),
        error: err => {
          console.error('Erreur chargement créneaux', err);
          this.creneauxDisponibles.set([]);
        }
      });
  }

  selectCreneau(c: Creneau) {
    this.creneauSelectionne.set(c);
  }

  selectVehicule(id: string) {
    const vehicule = this.vehicules().find(v => v._id === id) || null;
    this.vehiculeSelectionne.set(vehicule);
    console.log('Véhicule sélectionné:', vehicule);
  }

  prendreRDV() {
    if (!this.creneauSelectionne()) {
      alert('Veuillez choisir un créneau.');
      return;
    }
    if (!this.vehiculeSelectionne()) {
      alert('Veuillez choisir un véhicule.');
      return;
    }

    this.authService.user$.subscribe(user => {
        if (!user) return;

        const payload = {
          client: user._id,                // <-- ID du client connecté
          vehicule: this.vehiculeSelectionne()?._id,
          sousService: this.sousService()?._id,
          mecaniciens: [],                 // si applicable
          date: this.dateChoisie(),
          heureDebut: this.creneauSelectionne()?.debut,
          heureFin: this.creneauSelectionne()?.fin,
          urgence: false,
          commentaireClient: this.form.commentaire
        };

        console.log('DEBUG: Payload RDV', payload);
        this.http.post('http://localhost:5000/api/rendezvous', payload).subscribe({
      next: () => {
        alert('Rendez-vous créé avec succès !');
        this.router.navigate(['/services']);
      },
      error: err => alert('Erreur lors de la création du rendez-vous : ' + err.message)
    });
        
      });


    
  }
}
