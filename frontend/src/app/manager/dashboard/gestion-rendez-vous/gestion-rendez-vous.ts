import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

// Interfaces
interface Mecanicien {
  _id: string;
  nom: string;
  prenom: string;
  specialites: string[]; // liste d'IDs de sous-services qu'il sait faire
}

interface Client {
  nom: string;
  email: string;
}

interface SousService {
  _id: string;
  nom: string;
  service: string;
}

interface Rendezvous {
  _id: string;
  client: Client;
  sousService: SousService;
  date: string; // ISO string
  heureDebut: string;
  heureFin: string;
  mecaniciens?: Mecanicien[];         // déjà assignés
  selectedMecaniciens?: Mecanicien[]; // sélection du manager
  statut: string;
}

@Component({
  standalone: true,
  selector: 'app-gestion-rendez-vous',
  templateUrl: './gestion-rendez-vous.html',
  imports: [CommonModule, FormsModule]
})
export class GestionRendezVousComponent implements OnInit {
  rendezvous: Rendezvous[] = [];
  mecaniciens: Mecanicien[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.chargerRendezVous();
    this.chargerMecaniciens();
  }

  // Charger tous les rendez-vous
  chargerRendezVous() {
  this.http.get<Rendezvous[]>(`${environment.apiUrl}/rendezvous`)
    .subscribe({
      next: res => {
        console.log("📌 Rendezvous récupérés depuis l’API:", res);
        this.rendezvous = res.map(r => ({
          ...r,
          mecaniciens: r.mecaniciens || []
        }));
        console.log("✅ Rendezvous après mapping:", this.rendezvous);
      },
      error: err => {
        console.error("❌ Erreur chargement rendezvous:", err);
        this.message = '❌ Erreur lors du chargement des rendez-vous';
      }
    });
}
  // Charger tous les mécaniciens
  chargerMecaniciens() {
  this.http.get<Mecanicien[]>(`${environment.apiUrl}/mecaniciens/liste-mecaniciens`)
    .subscribe({
      next: res => {
        console.log("📌 Mécaniciens récupérés depuis l’API:", res);
        this.mecaniciens = res;
      },
      error: err => {
        console.error("❌ Erreur chargement mécaniciens:", err);
        this.message = '❌ Erreur lors du chargement des mécaniciens';
      }
    });
}



getMecaniciensDisponibles(rdv: Rendezvous) {
  const debutRdv = new Date(rdv.date);
  const [hDebut, mDebut] = rdv.heureDebut.split(':').map(Number);
  debutRdv.setHours(hDebut, mDebut, 0, 0);

  const finRdv = new Date(rdv.date);
  const [hFin, mFin] = rdv.heureFin.split(':').map(Number);
  finRdv.setHours(hFin, mFin, 0, 0);

  return this.mecaniciens.filter(m => {
    // Vérifier que le mécanicien a la spécialité requise
    const peutFaire = (m.specialites || []).includes(rdv.sousService.service);

    if (!peutFaire) return false;

    // Vérifier qu’il n’est pas déjà occupé
    const indisponible = this.rendezvous.some(r => {
      if (r._id === rdv._id) return false;
      if (!r.mecaniciens?.length) return false;

      const debutExist = new Date(r.date);
      const [hDebutExist, mDebutExist] = r.heureDebut.split(':').map(Number);
      debutExist.setHours(hDebutExist, mDebutExist, 0, 0);

      const finExist = new Date(r.date);
      const [hFinExist, mFinExist] = r.heureFin.split(':').map(Number);
      finExist.setHours(hFinExist, mFinExist, 0, 0);

      return r.mecaniciens.some(me => me._id === m._id) &&
             debutRdv < finExist && finRdv > debutExist;
    });

    return !indisponible;
  });
}





  // Assigner plusieurs mécaniciens à un rendez-vous
  assignerMecaniciens(rdv: Rendezvous) {
    console.log("🛠️ Assignation en cours pour rdv:", rdv);
    if (!rdv.selectedMecaniciens || rdv.selectedMecaniciens.length === 0) {
      this.message = '⚠️ Sélectionnez au moins un mécanicien';
      return;
    }

    const mecanicienIds = rdv.selectedMecaniciens.map(m => m._id);
    console.log("📌 IDs mécaniciens choisis:", mecanicienIds);
    this.http.put(`${environment.apiUrl}/rendezvous/${rdv._id}/assigner-mecaniciens`, {
      mecaniens: mecanicienIds
    }).subscribe({
      next: () => {
        // Ajouter les mécaniciens assignés dans l'objet rendez-vous local
        rdv.mecaniciens = [...(rdv.mecaniciens || []), ...rdv.selectedMecaniciens ||[]];
        rdv.selectedMecaniciens = [];
        console.log("✅ Mécaniciens après assignation locale:", rdv.mecaniciens);
        this.message = '✅ Mécaniciens assignés avec succès !';
      },
      
      error: err => {
      console.error("❌ Erreur assignation:", err);
      this.message = '❌ Erreur lors de l’assignation des mécaniciens';
    }
    });
  }

  // Changer le statut d’un rendez-vous
  changerStatut(id: string, statut: string) {
    this.http.put(`${environment.apiUrl}/rendezvous/${id}/statut`, { statut })
      .subscribe({
        next: () => {
          this.message = `✅ Rendez-vous ${statut}`;
          this.chargerRendezVous();
        },
        error: () => this.message = '❌ Erreur lors du changement de statut'
      });
  }
}
