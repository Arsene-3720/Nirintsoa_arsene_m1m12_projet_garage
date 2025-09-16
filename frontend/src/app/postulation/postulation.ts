import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-postulation-mecanicien',
  imports: [CommonModule, FormsModule],
  templateUrl: './postulation.html',
})
export class PostulationMecanicienComponent {
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  specialites = '';
  experience = '';
  cv: File | null = null;
  message = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  chargerCV(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.cv = input.files[0];
    }
  }

  envoyerPostulation() {
    const formData = new FormData();
    formData.append('nom', this.nom);
    formData.append('prenom', this.prenom);
    formData.append('email', this.email);
    formData.append('telephone', this.telephone);
    formData.append('experience', this.experience);
    formData.append('specialites', this.specialites);
    if (this.cv) formData.append('cv', this.cv);

    this.http.post(`${environment.apiUrl}/api/PostulMeca/postuler-mecanicien`, formData)
      .subscribe({
        next: res => {
          this.message = 'Votre postulation a été envoyée avec succès.';
          this.router.navigate(['/verifier-statut'], { queryParams: { email: this.email } });
        },
        error: err => {
          this.message = 'Erreur lors de la postulation : ' + err.error?.message || err.message;
        }
      });
  }
}
