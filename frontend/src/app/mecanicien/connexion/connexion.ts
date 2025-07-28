import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-mecanicien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 max-w-md mx-auto shadow-xl rounded-2xl">
      <h2 class="text-xl font-bold mb-4">Connexion Mécanicien</h2>

      <form (ngSubmit)="login()" class="flex flex-col gap-3">
        <input type="email" [(ngModel)]="email" name="email" placeholder="Email" class="p-2 border rounded" required>
        <input type="password" [(ngModel)]="password" name="password" placeholder="Mot de passe" class="p-2 border rounded" required>

        <button type="submit" class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Se connecter</button>
      </form>

      @if (erreur) {
        <p class="text-red-500 mt-2">{{ erreur }}</p>
      }

      @if (success) {
        <p class="text-green-600 mt-2">Connexion réussie !</p>
      }
    </div>
  `
})
export default class LoginMecanicienComponent {
  email = '';
  password = '';
  erreur = '';
  success = false;

  http = inject(HttpClient);
  router = inject(Router);

  login() {
    this.http.post<any>('http://localhost:5000/api/login-mecanicien', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        this.success = true;
        this.erreur = '';
        console.log('Connexion réussie', res);
        // Rediriger ou stocker les infos si besoin
        // this.router.navigate(['/mecanicien/dashboard']);
      },
      error: err => {
        this.success = false;
        this.erreur = err.error?.error || 'Erreur lors de la connexion';
      }
    });
  }
}
