import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
  standalone: true,
  selector: 'app-inscription-mecanicien',
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription.html',
})
export class InscriptionMecanicienComponent {
  email = '';
  motDePasse = '';
  image: File | null = null;
  message = '';

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  chargerImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      this.image = fileInput.files[0];
    }
  }

  validerInscription() {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('motDePasse', this.motDePasse);
    if (this.image) formData.append('images', this.image);

    this.http.post(`${environment.apiUrl}/api/Mecaniciens/register-mecanicien`, formData)
      .subscribe({
        next: res => {
          this.message = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          this.router.navigate(['/connexion-mecanicien']);
        },
        error: err => {
          this.message = 'Erreur lors de l’inscription : ' + err.error?.message || err.message;
        }
      });
  }
}
