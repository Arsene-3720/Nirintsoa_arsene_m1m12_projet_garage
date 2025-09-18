import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  private router = inject(Router);

  // ✅ Comptes managers enregistrés en dur
  private comptesManagers = [
    {
      email: 'admin@mail.com',
      motDePasse: '1234567',
      typeManager: 'global'
    },
    {
      email: 'admin-meca@mail.com',
      motDePasse: '1234567',
      typeManager: 'client-mecanicien'
    }
  ];

  seConnecter() {
    const email = this.email.value;
    const motDePasse = this.motDePasse.value;

    if (!email || !motDePasse) {
      this.erreur = 'Veuillez remplir tous les champs';
      return;
    }

    // Vérifier si les identifiants correspondent à un manager enregistré
    const compte = this.comptesManagers.find(
      (c) => c.email === email && c.motDePasse === motDePasse
    );

    if (!compte) {
      this.erreur = 'Identifiants incorrects';
      return;
    }

    // Sauvegarde en localStorage
    localStorage.setItem('utilisateur', JSON.stringify(compte));

    // Redirection selon le type
    if (compte.typeManager === 'global') {
      this.router.navigate(['/manager/dashboard']);
    } else if (compte.typeManager === 'client-mecanicien') {
      this.router.navigate(['/manager/dashboard']);
    }
  }
}




