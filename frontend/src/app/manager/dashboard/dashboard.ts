import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardManagerComponent implements OnInit {
  typeManager: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const utilisateurJson = localStorage.getItem('utilisateur');
    if (utilisateurJson) {
      const utilisateur = JSON.parse(utilisateurJson);
      this.typeManager = utilisateur.typeManager;
    } else {
      // Pas connecté ou info manquante, redirection vers login
      this.router.navigate(['/connexion-manager']);
    }
  }
}
