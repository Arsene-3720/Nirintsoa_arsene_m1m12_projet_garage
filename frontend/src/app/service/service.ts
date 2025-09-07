import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services/services';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Détails du service</h2>

      <ul>
        @for (ss of sousServices(); track ss._id) {
          <li 
            class="p-2 mb-2 rounded border" 
            [class.bg-yellow-100]="ss._id === selectedId"
          >
            <h3 class="font-semibold">{{ ss.nom }}</h3>
            <p>Durée : {{ ss.dureeEstimee }} min</p>
            <p>Prix : {{ ss.prix }} Ar</p>
            <p>{{ ss.description }}</p>
            <button 
          class="mt-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          [routerLink]="['/rendezvous', ss._id]"
        >
          Prendre rendez-vous
        </button>

        <!-- Bouton Retour -->
        <button 
          class="mt-2 ml-2 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
          [routerLink]="['/service']"
        >
          Retour
        </button>
          </li>
        }
      </ul>
    </div>
  `
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ServiceService = inject(ServicesService);

  sousServices = signal<any[]>([]);
  selectedId!: string;

  ngOnInit() {
    this.selectedId = this.route.snapshot.paramMap.get('id')!;

    // Charger tous les sous-services depuis le backend
    this.ServiceService.getSousServiceById(this.selectedId).subscribe(data => {
      this.sousServices.set([data]);
    });
  }
}
