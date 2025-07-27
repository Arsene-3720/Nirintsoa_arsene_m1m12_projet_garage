import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  imports: [CommonModule, FormsModule],
  template:  `
    <section>
      <h2>Connexion</h2>
      <form (ngSubmit)="seConnecter()">
        <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
        <input type="password" [(ngModel)]="motDePasse" name="motDePasse" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
    </section>
  `
  
})
export class ConnexionComponent {
  
  email = '';
  motDePasse = '';

  seConnecter() {
    console.log('Connexion envoyée :', this.email, this.motDePasse);
    
  }
}

