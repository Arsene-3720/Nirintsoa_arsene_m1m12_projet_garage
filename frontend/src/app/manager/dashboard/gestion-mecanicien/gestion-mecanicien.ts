import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Component({
  standalone: true,
  selector: 'app-gestion-mecaniciens',
  templateUrl: './gestion-mecanicien.html',
  imports: [CommonModule]
})
export class GestionMecaniciensComponent implements OnInit {
  postulants: any[] = [];
  mecaniciens: any[] = [];  
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.chargerPostulations();
    this.chargerMecaniciens();
  }

  chargerPostulations() {
    this.http.get<any[]>(`${environment.apiUrl}/PostulMeca/liste-postulation`)
      .subscribe({
        next: res => this.postulants = res,
        error: () => this.message = 'Erreur lors du chargement des postulants'
      });
  }

  changerStatut(id: string, statut: string) {
    this.http.put(`${environment.apiUrl}/PostulMeca/statut-manager/${id}`, { statut })
      .subscribe({
        next: () => {
          this.message = `Postulation ${statut}`;
          this.chargerPostulations();
          this.chargerMecaniciens();
        },
        error: () => this.message = `Erreur lors du changement de statut`
      });
  }

  chargerMecaniciens() {
    this.http.get<any[]>(`${environment.apiUrl}/Mecaniciens/liste-mecaniciens`)
      .subscribe({
        next: res => this.mecaniciens = res,
        error: () => this.message = 'Erreur lors du chargement des mécaniciens'
      });
  }
}
