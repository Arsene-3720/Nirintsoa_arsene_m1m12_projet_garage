// src/app/services/services.component.ts
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService, Service } from '../services/services';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  template: `
    <section class="services-container">
      <h2>Nos Services</h2>

      @if (services().length === 0) {
        <p>Aucun service disponible.</p>
      } @else {
        <ul class="service-list">
          @for (s of services(); track s._id) {
            <li class="service-card">
              <h3>{{ s.nom }}</h3>
              <p>{{ s.description }}</p>
              <img [src]="s.image" alt="{{ s.nom }}">
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [`
    .services-container { padding: 1rem; }
    .service-list { display: flex; flex-wrap: wrap; gap: 1rem; list-style: none; padding: 0; }
    .service-card { border: 1px solid #ccc; padding: 1rem; width: 250px; }
    img { width: 100%; height: auto; border-radius: 0.5rem; }
  `]
})
export class ServicesComponent {
  private readonly serviceApi = inject(ServicesService);
  readonly services = signal<Service[]>([]);

  constructor() {
    this.serviceApi.getServices().subscribe({
      next: data => this.services.set(data),
      error: () => this.services.set([]),
    });
  }
}
