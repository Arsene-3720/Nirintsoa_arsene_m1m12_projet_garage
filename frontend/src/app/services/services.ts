// src/app/services/services.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';

export interface Service {
  _id?: string;
  nom?: string;
  description?: string;
  image?: string;
}

export interface SousService {
  _id: string;
  nom: string;
  description: string;
  image: string;
  dureeEstimee: number;
  prix : 0,
  service: { _id: string; nom: string };
}

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isConnected()) {
    alert('Vous devez être connecté pour prendre un rendez-vous !');
    router.navigate(['/connexion']); // redirige vers la page de login/inscription
    return false;
  }
  return true;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/clients';
  private http = inject(HttpClient);

  // Suivi état connecté
  private connectedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isConnected$ = this.connectedSubject.asObservable();

  

  // Suivi info utilisateur
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  private getUserFromStorage(): any {
    const u = localStorage.getItem('client');
    return u ? JSON.parse(u) : null;
  }

  // --- Inscription ---
  registerClient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-client`, data);
  }

  // --- Connexion HTTP ---
  loginClient(credentials: { email: string, motDePasse: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login-client`, credentials);
  }

  // --- Mise à jour état après connexion ---
  login(user: any, token?: string) {
    localStorage.setItem('client', JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
    this.userSubject.next(user);
    this.connectedSubject.next(true);
  }

  // --- Déconnexion ---
  logout() {
    localStorage.removeItem('client');
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.connectedSubject.next(false);
  }

  // --- Vérification rapide ---
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  isConnected(): boolean {
    return this.connectedSubject.value;
  }
}

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private http = inject(HttpClient);
  private baseUrlServices = 'http://localhost:5000/api/services';
  private baseUrlSousServices = 'http://localhost:5000/api/sousservices';

  private getHeaders() {
    const token = localStorage.getItem('token'); // ton JWT stocké
    console.log('Token envoyé au backend:', localStorage.getItem('token'));
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  // --- Services ---
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.baseUrlServices, this.getHeaders());
  }

  getServiceById(id: string): Observable<Service> {
     return this.http.get<Service>(`${this.baseUrlServices}/${id}`, this.getHeaders());
  }

  ajoutService(service: Service): Observable<Service> {
     return this.http.post<Service>(`${this.baseUrlServices}/ajout-service`, service, this.getHeaders());
  
  }

  modifService(id: string, service: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.baseUrlServices}/modif-service/${id}`, service, this.getHeaders());
  }

  delService(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrlServices}/del-service/${id}`, this.getHeaders());
  }

  // --- Sous-services ---
  getSousServices(): Observable<SousService[]> {
    return this.http.get<SousService[]>(this.baseUrlSousServices, this.getHeaders());
  }

  getSousServiceById(id: string): Observable<SousService> {
  return this.http.get<SousService>(`${this.baseUrlSousServices}/${id}`, this.getHeaders());
}


  getSousServicesByService(serviceId: string): Observable<SousService[]> {
    return this.http.get<SousService[]>(`${this.baseUrlSousServices}?service=${serviceId}`, this.getHeaders());
  }

  ajoutSousService(ss: Partial<SousService>): Observable<SousService> {
    return this.http.post<SousService>(this.baseUrlSousServices, ss, this.getHeaders());
  }

  modifSousService(id: string, ss: Partial<SousService>): Observable<SousService> {
    return this.http.put<SousService>(`${this.baseUrlSousServices}/${id}`, ss, this.getHeaders());
  }

  delSousService(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrlSousServices}/${id}`, this.getHeaders());
  }
}

export interface Creneau {
  debut: string;
  fin: string;
}
@Injectable({ providedIn: 'root' })
export class CreneauService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/creneaux';

  getCreneaux(sousServiceId: string, date: string): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(`${this.baseUrl}/${sousServiceId}?date=${date}`);
  }
}


