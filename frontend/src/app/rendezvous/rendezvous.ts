<<<<<<< HEAD
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
=======
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
>>>>>>> 260340f490d8a58a495c7dad29a71c84a547135a
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/services';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthService } from '../services/services';
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

<<<<<<< HEAD
=======

>>>>>>> 260340f490d8a58a495c7dad29a71c84a547135a
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
  private authService = inject(AuthService);


  sousService = signal<any | null>(null);
  creneauxDisponibles = signal<Creneau[]>([]);
  creneauSelectionne = signal<Creneau | null>(null);
  vehicules = signal<Vehicule[]>([]);
  vehiculeSelectionne = signal<Vehicule | null>(null);
  nomClient = signal<string>('');

  vehicules = signal<Vehicule[]>([]);
  vehiculeSelectionne = signal<Vehicule | null>(null);

  dateChoisie = signal<string>(new Date().toISOString().split('T')[0]);

<<<<<<< HEAD
  dateMin: string = '';

=======
  
>>>>>>> 260340f490d8a58a495c7dad29a71c84a547135a
  form = {
    emailClient: '' ,
    
  };


  // Signal pour récupérer le nom du client connecté
  nomClientConnecte = computed(() => {
    const user = this.authService.userSubject.value;
    return user ? user.nom : '';
  });


  ngOnInit() {
<<<<<<< HEAD

    // calcul de la date minimale
    const today = new Date();
    const hour = today.getHours();


    if (hour >= 18) {
    today.setDate(today.getDate() + 1);
  }

    // format YYYY-MM-DD
  this.dateMin = today.toISOString().split('T')[0];

  // Initialiser la date choisie au min autorisé
  this.dateChoisie.set(this.dateMin);
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // 1️⃣ Charger le sous-service
    this.http.get(`${environment.apiUrl}/sousservices/${id}`).subscribe({
      next: (data: any) => this.sousService.set(data),
      error: () => this.sousService.set(null)
    });

    // 2️⃣ Récupérer les véhicules du client connecté
    this.authService.user$.subscribe(user => {
      if (!user) return;

      this.form.emailClient = user.email || ''; // email du client
      this.http.get<Vehicule[]>(`${environment.apiUrl}/clients/${user.refId}/vehicules`)
        .subscribe({
          next: data => this.vehicules.set(data),
          error: () => this.vehicules.set([])
        });
    });

    // 3️⃣ Charger les créneaux disponibles
    if (id) this.chargerCreneaux(id, this.dateChoisie());
=======

    
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
>>>>>>> 260340f490d8a58a495c7dad29a71c84a547135a
  }

  chargerCreneaux(sousServiceId: string, date: string) {
    console.log("📌 Charger créneaux → sousServiceId:", sousServiceId, "date:", date);
    this.http.get<Creneau[]>(`${environment.apiUrl}/creneaux/${sousServiceId}?date=${date}`)
    
      .subscribe({
        next: data => {
      console.log("✅ Réponse backend créneaux:", data);
      this.creneauxDisponibles.set(data);
    },
        
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
<<<<<<< HEAD
    const vehicule = this.vehicules().find(v => v._id === id) || null;
    this.vehiculeSelectionne.set(vehicule);
    console.log('Véhicule sélectionné:', vehicule);
  }
=======
  const vehicule = this.vehicules().find(v => v._id === id) || null;
  this.vehiculeSelectionne.set(vehicule);
  console.log('Véhicule sélectionné:', vehicule); // debug
}

>>>>>>> 260340f490d8a58a495c7dad29a71c84a547135a

  prendreRDV() {
    if (!this.creneauSelectionne()) {
      alert('Veuillez choisir un créneau.');
      return;
    }
    if (!this.vehiculeSelectionne()) {
      alert('Veuillez choisir un véhicule.');
      return;
    }

<<<<<<< HEAD
    this.authService.user$.subscribe(user => {
        if (!user) return;

        const payload = {
          client: user.refId,                // <-- ID du client connecté
          vehicule: this.vehiculeSelectionne()?._id,
          sousService: this.sousService()?._id,
          mecaniciens: [],                 // si applicable
          date: this.dateChoisie(),
          heureDebut: this.creneauSelectionne()?.debut,
          heureFin: this.creneauSelectionne()?.fin,
          urgence: false,
          
        };

        console.log('DEBUG: Payload RDV', payload);
        this.http.post(`${environment.apiUrl}/rendezvous`, payload).subscribe({
      next: () => {
        alert('Rendez-vous créé avec succès !');
        this.router.navigate(['/services']);
      },
      error: err => alert('Erreur lors de la création du rendez-vous : ' + err.message)
    });
        
      });


    
  }
=======
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
>>>>>>> 260340f490d8a58a495c7dad29a71c84a547135a
}
