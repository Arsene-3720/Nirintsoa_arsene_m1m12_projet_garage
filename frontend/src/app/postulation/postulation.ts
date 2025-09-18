import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-postulation-mecanicien',
  imports: [CommonModule, FormsModule],
  templateUrl: './postulation.html',
})
export class PostulationMecanicienComponent implements OnInit {
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  experience = '';
  cv: File | null = null;
  message = '';

  services: { nom: string, checked: boolean }[] = []; // liste des services avec checkbox
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // récupérer l'email depuis les query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    // récupérer la liste des services depuis l'API
    this.http.get<{ nom: string }[]>(`${environment.apiUrl}/services`).subscribe({
      next: data => {
        this.services = data.map(s => ({ ...s, checked: false }));
      },
      error: err => console.error('Erreur récupération services', err)
    });
  }

  toggleSpecialite(service: { nom: string, checked: boolean }) {
    service.checked = !service.checked;
  }

  chargerCV(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.cv = input.files[0];
    }
  }

  envoyerPostulation() {
    const specialitesArray = this.services
      .filter(s => s.checked)
      .map(s => s.nom);

    if (specialitesArray.length === 0) {
      this.message = 'Vous devez sélectionner au moins une spécialité.';
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.nom);
    formData.append('prenom', this.prenom);
    formData.append('email', this.email);
    formData.append('telephone', this.telephone);
    formData.append('experience', this.experience);
    formData.append('specialites', JSON.stringify(specialitesArray));
    if (this.cv) formData.append('cv', this.cv);

    this.http.post(`${environment.apiUrl}/PostulMeca/postuler-mecanicien`, formData)
      .subscribe({
        next: res => {
          this.message = 'Votre postulation a été envoyée avec succès.';
          this.router.navigate(['/verifier-statut'], { queryParams: { email: this.email } });
        },
        error: err => {
          this.message = 'Erreur lors de la postulation : ' + (err.error?.error || err.message);
        }
      });
  }
}
