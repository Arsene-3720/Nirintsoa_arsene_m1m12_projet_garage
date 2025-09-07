import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/services';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insription.html'
})
export class RegisterClientComponent {
  private authService = inject(AuthService);

  clientData = {
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    telephone: '',
    motDePasse: '',
    adresse: '',
    codePostal: '',
    ville: '',
    autresInfos: '',
    vehicule: {
      marque: '',
      modele: '',
      immatriculation: '',
      annee: null
    }
  };

  message = '';

  onSubmit() {
    // Debug avant envoi
    console.log('=== DEBUG FRONTEND INSCRIPTION ===');
    console.log('Mot de passe saisi:', `"${this.clientData.motDePasse}"`);
    console.log('Length:', this.clientData.motDePasse.length);
    console.log('Données complètes:', this.clientData);

    this.authService.registerClient(this.clientData).subscribe({
      next: (res) => {
        this.message = 'Inscription réussie ✅';
        console.log('Réponse serveur:', res);
      },
      error: (err) => {
        this.message = 'Erreur: ' + (err.error?.message || 'serveur');
        console.error('Erreur inscription:', err);
      }
    });
  }
}