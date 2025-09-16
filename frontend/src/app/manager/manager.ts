import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'login-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manager.html'
})
export class LoginManagerComponent {
  email = new FormControl('');
  motDePasse = new FormControl('');
  erreur = '';

  private http = inject(HttpClient);
  private router = inject(Router);



  seConnecter() {
    const email = this.email.value;
    const motDePasse = this.motDePasse.value;

    if (!email || !motDePasse) {
      this.erreur = 'Veuillez remplir tous les champs';
      return;
    }

    console.log('Tentative de connexion avec :', { email, motDePasse });
  this.http.post<any>(`${environment.apiUrl}/Managers/login-manager`, {
    email,
    motDePasse
  }).subscribe({
    next: (response) => {

      console.log('Réponse brute du backend :', response);
      const utilisateur = response?.utilisateur;

      if (!utilisateur) {
        this.erreur = 'Réponse invalide : utilisateur manquant';
        return;
      }

      
      console.log('🔐 Utilisateur connecté :', utilisateur);

      localStorage.setItem('token', response.token);

      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
        
        if (utilisateur.role && utilisateur.role.startsWith('manager')) {
          console.log('Redirection vers le dashboard manager');
          this.router.navigate(['/manager/dashboard']);
          
        } else {
          console.error('Redirection échouée : rôle invalide', utilisateur.role);
          this.erreur = 'Vous n’êtes pas un manager';
        }
    },
    error: (err) => {
      console.error('Erreur de connexion :', err);
      this.erreur = err.error?.error || 'Erreur lors de la connexion';
    }
  });
}

}
