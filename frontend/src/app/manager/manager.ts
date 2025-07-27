import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 max-w-md mx-auto">
      <h2 class="text-2xl font-bold mb-4">Connexion Manager</h2>

      <input [formControl]="email" type="email" placeholder="Email" class="border p-2 w-full mb-2 rounded" />
      <input [formControl]="motDePasse" type="password" placeholder="Mot de passe" class="border p-2 w-full mb-4 rounded" />

      <button (click)="seConnecter()" class="bg-blue-600 text-white px-4 py-2 rounded">Se connecter</button>

      @if (erreur) {
        <p class="text-red-500 mt-4">{{ erreur }}</p>
      }
    </div>
  `
})
export class LoginManagerComponent {
  email = new FormControl('');
  motDePasse = new FormControl('');
  erreur = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  seConnecter() {
    this.http.post<any>('http://localhost:3000/api/login', {
      email: this.email.value,
      motDePasse: this.motDePasse.value
    }).subscribe({
      next: (utilisateur) => {
        // 🔐 Vérifie s'il est bien un manager
        if (utilisateur.role === 'manager') {
          if (utilisateur.typeManager === 'global') {
            this.router.navigate(['/manager-global/dashboard']);
          } else if (utilisateur.typeManager === 'client-mecanicien') {
            this.router.navigate(['/manager-client/dashboard']);
          } else {
            this.erreur = 'Type de manager inconnu';
          }
        } else {
          this.erreur = 'Vous n’êtes pas un manager';
        }
      },
      error: (err) => {
        this.erreur = err.error?.error || 'Erreur lors de la connexion';
      }
    });
  }
}
