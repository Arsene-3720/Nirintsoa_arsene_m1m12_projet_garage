import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';

interface Creneau {
  debut: string;
  fin: string;
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
  private router = inject(Router);

  sousService = signal<any | null>(null);
  creneauxDisponibles = signal<Creneau[]>([]);
  creneauSelectionne = signal<Creneau | null>(null);

  dateChoisie = signal<string>(new Date().toISOString().split('T')[0]);

  

  form = {
    nomClient: '',
    commentaire: ''
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Charger le sous-service
      this.http.get(`http://localhost:5000/api/sousservices/${id}`)
        .subscribe({
          next: data => this.sousService.set(data),
          error: () => this.sousService.set(null)
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
  }

  selectCreneau(c: Creneau) {
    this.creneauSelectionne.set(c);
  }

  prendreRDV() {
    if (!this.creneauSelectionne()) {
      alert('Veuillez choisir un créneau avant de confirmer.');
      return;
    }

    const payload = {
      sousService: this.sousService()?._id,
      nomClient: this.form.nomClient,
      commentaire: this.form.commentaire,
      date: this.dateChoisie(),
      heureDebut: this.creneauSelectionne()?.debut,
      heureFin: this.creneauSelectionne()?.fin
    };

    this.http.post('http://localhost:5000/api/rendezvous', payload)
      .subscribe({
        next: () => {
          alert('Rendez-vous créé avec succès !');
          this.router.navigate(['/services']);
        },
        error: err => alert('Erreur lors de la création du rendez-vous : ' + err.message)
      });
  }
}
