import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesService, Service, SousService } from '../../../services/services';

@Component({
  selector: 'app-gestion-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-service.html',
  styleUrls: ['./gestion-service.css']
})
export class GestionServiceComponent {
  private serviceApi = inject(ServicesService);

  // Données
  readonly services = signal<Service[]>([]);
  readonly sousServices = signal<SousService[]>([]);

  // Formulaire service
  nouveauService: Partial<Service> = { nom: '', description: '', image: '' };
  serviceEdit: Service | null = null;

  // Formulaire sous-service
  nouveauSousService: Partial<SousService & { prix?: number }> = { nom: '', description: '', dureeEstimee: 60, prix: 0, service: { _id: '', nom: '' }  };
  sousServiceEdit: SousService | null = null;

  constructor() {
    this.loadServices();
    this.loadSousServices();
  }

  loadServices() {
    this.serviceApi.getServices().subscribe({
      next: data => this.services.set(data),
      error: () => this.services.set([])
    });
  }

  loadSousServices() {
    this.serviceApi.getSousServices().subscribe({
      next: data => this.sousServices.set(data),
      error: () => this.sousServices.set([])
    });
  }

  // --- Services ---
  addService() {
  this.serviceApi.ajoutService(this.nouveauService as Service).subscribe({
    next: s => {
      this.services.update(arr => [...arr, s]); // ✅ ajoute un élément
      this.nouveauService = { nom: '', description: '', image: '' };
    }
  });
}

  editService(s: Service) {
    this.serviceEdit = { ...s };
  }

  updateService() {
    if (!this.serviceEdit) return;
    this.serviceApi.modifService(this.serviceEdit._id!, this.serviceEdit).subscribe({
      next: s => {
        this.loadServices();
        this.serviceEdit = null;
      }
    });
  }

  deleteService(id: string | undefined) {
    if (!id) return;
    this.serviceApi.delService(id).subscribe({ next: () => this.loadServices() });
  }

  // --- Sous-services ---
  addSousService() {
  if (!this.nouveauSousService.service?._id) {
    return alert('Veuillez sélectionner un service parent');
  }
  this.serviceApi.ajoutSousService(this.nouveauSousService).subscribe({
    next: ss => {
      this.sousServices.update(arr => [...arr, ss]); // ✅ ajoute un élément
      this.nouveauSousService = { nom: '', description: '', dureeEstimee: 60, service: { _id: '', nom: '' }, prix: 0  };
    }
  });
}
  editSousService(ss: SousService) {
    this.sousServiceEdit = { ...ss };
  }

  updateSousService() {
    if (!this.sousServiceEdit) return;
    this.serviceApi.modifSousService(this.sousServiceEdit._id, this.sousServiceEdit).subscribe({
      next: ss => {
        this.loadSousServices();
        this.sousServiceEdit = null;
      }
    });
  }

  deleteSousService(id: string) {
    this.serviceApi.delSousService(id).subscribe({ next: () => this.loadSousServices() });
  }
}
