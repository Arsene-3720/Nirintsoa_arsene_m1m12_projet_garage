import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'mecanicien-verif-postulation',
  standalone: true,
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-2">Vérification de votre statut</h2>
      <!-- <input type="email" [(ngModel)]="email" placeholder="Entrez votre email" class="border p-2 rounded" /> -->
      <button (click)="verifierStatut()" class="bg-blue-500 text-white p-2 rounded ml-2">Vérifier</button>

      @if (message) {
        <p class="mt-4 text-gray-700">{{ message }}</p>
      }
    </div>
  `,
  imports: [],
})
export class MecanicienVerifPostulationComponent {
  email = '';
  message = '';
  http = inject(HttpClient);
  router = inject(Router);

  verifierStatut() {
    this.http.get<{ statut: string }>(`http://localhost:3000/api/statut-postulation/${this.email}`).subscribe({
      next: (res) => {
        const statut = res.statut;
        if (statut === 'accepté') {
          this.router.navigate(['/inscription-mecanicien'], { queryParams: { email: this.email } });
        } else if (statut === 'en attente') {
          this.message = 'Votre demande est encore en attente de validation.';
        } else if (statut === 'rejeté') {
          this.message = 'Votre demande a été rejetée par le manager.';
        } else {
          this.message = 'Statut inconnu.';
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/postulation-mecanicien'], { queryParams: { email: this.email } });
        } else {
          this.message = 'Erreur serveur.';
        }
      },
    });
  }
}
