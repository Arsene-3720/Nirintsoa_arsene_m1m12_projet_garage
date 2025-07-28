import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mecanicien-verif-postulation',
  standalone: true,
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2">Vérification de votre statut</h2>
      <input type="email" [(ngModel)]="email" placeholder="Entrez votre email" class="border p-2 rounded" />
      <button (click)="verifierStatut()" class="bg-blue-500 text-white p-2 rounded ml-2">Vérifier</button>

      @if (message) {
        <p class="mt-4 text-gray-700">{{ message }}</p>
      }
    </div>
  `,
  imports: [FormsModule],
})
export class MecanicienVerifPostulationComponent {
  email = '';
  message = '';
  http = inject(HttpClient);
  router = inject(Router);

  verifierStatut() {
    this.http.get<{ statut: string }>(`http://localhost:5000/api/PostulMeca/statut-postulation?email=${this.email}`).subscribe({
      next: (res) => {
        const statut = res.statut;
        if (statut === 'accepte') {
          this.router.navigate(['/mecanicien/inscription'], { queryParams: { email: this.email } });
        } else if (statut === 'en attente') {
          this.message = 'Votre demande est encore en attente de validation.';
        } else if (statut === 'rejeté') {
          this.message = 'Votre demande a été rejetée par le manager.';
        } else {
           this.message = 'status inconnu. Veuillez contacter le support.';
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/postulation'], { queryParams: { email: this.email } });
        } else {
          this.message = 'Erreur serveur.';
        }
      },
    });
  }
}

