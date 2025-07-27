import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [ConnexionComponent],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil {
  afficherConnexion = false;
}

