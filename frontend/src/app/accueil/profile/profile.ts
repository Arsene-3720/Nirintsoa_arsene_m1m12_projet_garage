import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class ProfileComponent {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  client = signal<any>(null);
  vehicules = signal<any[]>([]);
  rendezvous = signal<any[]>([]);

  ancienPassword = signal<string>(''); 

  message = signal<string>('');
  nouveauPassword = signal<string>('');

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user?._id) return;

    this.http.get(`http://localhost:5000/api/clients/${user.refId}/profile`)
      .subscribe((data: any) => {
        this.client.set(data.client);
        this.vehicules.set(data.vehicules);
        this.rendezvous.set(data.rendezvous);
      });
  }

  changerMotDePasse() {
    const user = this.authService.getUser();
    this.http.put(`http://localhost:5000/api/clients/${user.refId}/password`, {
      ancien: this.ancienPassword(),
      nouveau: this.nouveauPassword()
    }).subscribe({
      next: () => this.message.set('Mot de passe changé avec succès ✅'),
      error: err => this.message.set('Erreur : ' + err.error.error)
    });
  }
}
