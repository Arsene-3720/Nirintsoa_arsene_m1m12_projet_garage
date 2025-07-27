// src/app/services/services.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signal, computed, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export interface Service {
  _id: string;
  nom: string;
  description: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/services';

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.baseUrl);
  }
}
