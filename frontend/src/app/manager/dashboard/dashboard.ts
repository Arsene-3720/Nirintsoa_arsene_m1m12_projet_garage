import { Component, OnInit  } from '@angular/core';
import { Router, RouterLink, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',

  
  standalone: true, 
  imports: [CommonModule, RouterModule],

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

  allerVersGestionMecaniciens() {
    this.router.navigate(['/manager/dashboard/gestion-mecanicien']);
  }
}
