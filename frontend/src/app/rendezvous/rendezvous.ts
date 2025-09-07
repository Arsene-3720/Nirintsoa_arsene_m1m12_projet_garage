import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 max-w-lg mx-auto">
      <h2 class="text-xl font-bold mb-4">Prendre un rendez-vous</h2>

      @if (sousService()) {
        <p>Sous-service sélectionné : <strong>{{ sousService()?.nom }}</strong></p>
      } @else {
        <p>Aucun sous-service sélectionné.</p>
      }

      <!-- <h3>Choisissez un créneau disponible :</h3>
      <ul>
        @for (const c of creneauxDisponibles)
          <li>
            <button (click)="selectCreneau(c.debut, c.fin)">
              {{ c.debut }} - {{ c.fin }}
            </button>
          </li>
      </ul> -->


      <form (ngSubmit)="prendreRDV()">
        <div class="mb-2">
          <label class="block mb-1">Nom du client</label>
          <input type="text" [(ngModel)]="form.nomClient" name="nomClient" class="border rounded p-1 w-full" required>
        </div>

        <div class="mb-2">
          <label class="block mb-1">Date et heure</label>
          <input type="datetime-local" [(ngModel)]="form.dateHeure" name="dateHeure" class="border rounded p-1 w-full" required>
        </div>

        <div class="mb-2">
          <label class="block mb-1">Commentaire</label>
          <textarea [(ngModel)]="form.commentaire" name="commentaire" class="border rounded p-1 w-full"></textarea>
        </div>

        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Confirmer</button>
      </form>
    </div>
  `
})
export class RendezvousComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  sousService = signal<any | null>(null);

  form = {
    nomClient: '',
    dateHeure: '',
    commentaire: ''
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Charger le sous-service depuis le backend
      this.http.get(`http://localhost:5000/api/sousservices/${id}`).subscribe({
        next: (data) => this.sousService.set(data),
        error: () => this.sousService.set(null)
      });
    }
  }

  prendreRDV() {
    const payload = {
      sousService: this.sousService()?. _id,
      nomClient: this.form.nomClient,
      dateHeure: this.form.dateHeure,
      commentaire: this.form.commentaire
    };

    this.http.post('http://localhost:5000/api/rendezvous', payload).subscribe({
      next: () => {
        alert('Rendez-vous créé avec succès !');
        this.router.navigate(['/services']);
      },
      error: (err) => alert('Erreur lors de la création du rendez-vous : ' + err.message)
    });
  }
}
