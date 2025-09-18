import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/services';
import { HttpClient, provideHttpClient } from '@angular/common/http';

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
  templateUrl: './rendezvous.html'
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
  nomClient = signal<string>('');

  dateChoisie = signal<string>(new Date().toISOString().split('T')[0]);

  
  form = {
    nomClient: '',
    commentaire: ''
  };


  // Signal pour récupérer le nom du client connecté
  nomClientConnecte = computed(() => {
    const user = this.authService.userSubject.value;
    return user ? user.nom : '';
  });


  ngOnInit() {

    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Charger le sous-service
      this.http.get(`http://localhost:5000/api/sousservices/${id}`)
        .subscribe({
          next: data => this.sousService.set(data),
          error: () => this.sousService.set(null)
        });

      this.authService.user$.subscribe(user => {
        console.log('DEBUG: user$', user);
        if (user && user.email) {
          this.nomClient.set(user.email);
          console.log('DEBUG: form.nomClient set to', this.form.nomClient);
          this.http.get<Vehicule[]>(`http://localhost:5000/api/clients/${user.refId}/vehicules`)
        .subscribe(v => this.vehicules.set(v));
        }
      });


      // Charger les créneaux disponibles pour aujourd'hui par défaut
      this.chargerCreneaux(id, this.dateChoisie());
    }
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
      this.creneauSelectionne.set(null);
  }

  selectCreneau(c: Creneau) {
    console.log('Clic sur le créneau', c); // debug ici, dans le TS
    this.creneauSelectionne.set(c);
  }

  selectVehicule(id: string) {
  const vehicule = this.vehicules().find(v => v._id === id) || null;
  this.vehiculeSelectionne.set(vehicule);
  console.log('Véhicule sélectionné:', vehicule); // debug
}


  prendreRDV() {
    if (!this.creneauSelectionne()) {
      alert('Veuillez choisir un créneau avant de confirmer.');
      return;
    }

    if (!this.vehiculeSelectionne()) {
      alert('Veuillez choisir un véhicule.');
      return;
    }

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

    console.log('DEBUG: Payload RDV', payload);

    this.http.post('http://localhost:5000/api/rendezvous', payload)
      .subscribe({
        next: () => {
          alert('Rendez-vous créé avec succès !');
          this.router.navigate(['/profile']);
        },
        error: err => alert('Erreur lors de la création du rendez-vous : ' + err.message)
      });
  })

}
}
