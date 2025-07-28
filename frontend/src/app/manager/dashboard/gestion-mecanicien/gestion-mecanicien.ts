import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  standalone: true,
  selector: 'app-gestion-mecaniciens',
  templateUrl: './gestion-mecanicien.html',
  imports: [CommonModule]
})
export class GestionMecaniciensComponent implements OnInit {
  postulants: any[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.chargerPostulations();
  }

  chargerPostulations() {
    this.http.get<any[]>('http://localhost:5000/api/PostulMeca/liste-postulation')
      .subscribe({
        next: res => this.postulants = res,
        error: () => this.message = 'Erreur lors du chargement des postulants'
      });
  }

  changerStatut(id: string, statut: string) {
    this.http.put(`http://localhost:5000/api/PostulMeca/statut-manager/${id}`, { statut })
      .subscribe({
        next: () => {
          this.message = `Postulation ${statut}`;
          this.chargerPostulations();
        },
        error: () => this.message = `Erreur lors du changement de statut`
      });
  }
}
