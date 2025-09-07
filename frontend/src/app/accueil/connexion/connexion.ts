import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/services';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.html'
})
export class ConnexionComponent {
  email = '';
  motDePasse = '';
  erreur = '';
  success = false;
  loading = false;

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  seConnecter() {
    if (!this.email || !this.motDePasse) {
      this.erreur = 'Veuillez saisir email et mot de passe';
      return;
    }

    this.loading = true;
    this.erreur = '';

    this.authService.loginClient({ email: this.email, motDePasse: this.motDePasse })
      .subscribe({
        next: res => {
          this.loading = false;

          if (res.status === 'ok') {
            // ⚡ Mettre à jour AuthService
            this.authService.login(res.client, res.token);

            this.success = true;
            this.erreur = '';
            // Redirection
            setTimeout(() => {
            this.router.navigate(['/']);
          }, 50); 

          } else if (res.status === 'not-found') {
            this.erreur = res.message || "Aucun compte trouvé, veuillez vous inscrire.";
            this.router.navigate(['/inscription']);

          } else if (res.status === 'error') {
            this.erreur = res.message || "Email ou mot de passe incorrect.";
          } else {
            this.erreur = 'Réponse serveur inattendue';
          }
        },
        error: err => {
          this.loading = false;
          this.success = false;
          this.erreur = err.error?.message || 'Erreur serveur, réessayez plus tard';
          console.error('Erreur login-client:', err);
        }
      });
  }
}
