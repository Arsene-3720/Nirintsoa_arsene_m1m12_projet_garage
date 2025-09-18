import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'mecanicien-verif-postulation',
  standalone: true,
  template: `
    <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de statut</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            line-height: 1.6;
        }
        
        .verification-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 3rem 2.5rem;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            width: 100%;
            max-width: 500px;
            position: relative;
            overflow: hidden;
        }
        
        .verification-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
        }
        
        .verification-header {
            text-align: center;
            margin-bottom: 2.5rem;
        }
        
        .verification-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }
        
        .verification-icon::before {
            content: '🔍';
            font-size: 2rem;
        }
        
        .verification-title {
            font-size: 1.75rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .verification-subtitle {
            color: #64748b;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .verification-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .input-group {
            position: relative;
        }
        
        .form-input {
            width: 100%;
            padding: 1.25rem 1.5rem;
            padding-left: 3.5rem;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            font-size: 1rem;
            background: #ffffff;
            transition: all 0.3s ease;
            color: #334155;
            font-family: inherit;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
            transform: translateY(-2px);
        }
        
        .form-input::placeholder {
            color: #94a3b8;
            font-weight: 500;
        }
        
        .input-icon {
            position: absolute;
            left: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: #94a3b8;
            transition: color 0.3s ease;
            font-size: 1.1rem;
        }
        
        .input-group:focus-within .input-icon {
            color: #6366f1;
        }
        
        .email-icon::before {
            content: '✉️';
        }
        
        .verify-button {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            padding: 1.25rem 2rem;
            border: none;
            border-radius: 16px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .verify-button::before {
            content: '🔍';
            font-size: 1.2rem;
        }
        
        .verify-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(99, 102, 241, 0.5);
            background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
        }
        
        .verify-button:active {
            transform: translateY(-1px);
        }
        
        .verify-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        .status-message {
            margin-top: 2rem;
            padding: 1.5rem;
            border-radius: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            animation: slideIn 0.5s ease-out;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .status-message::before {
            margin-right: 0.75rem;
            font-size: 1.2rem;
        }
        
        .status-success {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
            border: 2px solid rgba(16, 185, 129, 0.3);
            color: #065f46;
        }
        
        .status-success::before {
            content: '✅';
        }
        
        .status-warning {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1));
            border: 2px solid rgba(245, 158, 11, 0.3);
            color: #92400e;
        }
        
        .status-warning::before {
            content: '⚠️';
        }
        
        .status-info {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1));
            border: 2px solid rgba(99, 102, 241, 0.3);
            color: #4338ca;
        }
        
        .status-info::before {
            content: 'ℹ️';
        }
        
        .status-error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
            border: 2px solid rgba(239, 68, 68, 0.3);
            color: #dc2626;
        }
        
        .status-error::before {
            content: '❌';
        }
        
        @keyframes slideIn {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .info-panel {
            background: rgba(99, 102, 241, 0.05);
            border: 1px solid rgba(99, 102, 241, 0.1);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            color: #4338ca;
            font-size: 0.95rem;
        }
        
        .info-panel::before {
            content: '💡';
            margin-right: 0.5rem;
            font-size: 1.1rem;
        }
        
        .floating-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        }
        
        .floating-element {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            animation: float 10s ease-in-out infinite;
        }
        
        .element-1 {
            width: 60px;
            height: 60px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .element-2 {
            width: 40px;
            height: 40px;
            top: 70%;
            right: 15%;
            animation-delay: 3s;
            border-radius: 50%;
        }
        
        .element-3 {
            width: 80px;
            height: 30px;
            top: 80%;
            left: 20%;
            animation-delay: 6s;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-25px) rotate(180deg);
                opacity: 0.8;
            }
        }
        
        @media (max-width: 768px) {
            .verification-container {
                padding: 2rem 1.5rem;
                margin: 1rem;
                border-radius: 20px;
            }
            
            .verification-title {
                font-size: 1.5rem;
            }
            
            .verification-icon {
                width: 60px;
                height: 60px;
                margin-bottom: 1rem;
            }
            
            .verification-icon::before {
                font-size: 1.5rem;
            }
            
            .form-input {
                padding: 1rem 1.25rem;
                padding-left: 3rem;
            }
        }
        
        @media (max-width: 480px) {
            body {
                padding: 1rem 0.5rem;
            }
            
            .verification-container {
                padding: 1.5rem;
            }
            
            .verification-title {
                font-size: 1.25rem;
            }
        }
        
        .loading-state {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body>
    <div class="floating-elements">
        <div class="floating-element element-1"></div>
        <div class="floating-element element-2"></div>
        <div class="floating-element element-3"></div>
    </div>
    
    <div class="verification-container">
        <div class="verification-header">
            <div class="verification-icon"></div>
            <h2 class="verification-title">Vérification de votre statut</h2>
            <p class="verification-subtitle">Contrôlez l'état de votre candidature</p>
        </div>

        <div class="info-panel">
            Saisissez l'adresse email utilisée lors de votre candidature pour connaître le statut actuel de votre dossier.
        </div>

        <div class="verification-form">
            <div class="input-group">
                <div class="input-icon email-icon"></div>
                <input 
                    type="email" 
                    [(ngModel)]="email" 
                    placeholder="Entrez votre adresse email" 
                    class="form-input"
                />
            </div>

            <button 
                (click)="verifierStatut()" 
                class="verify-button"
            >
                Vérifier le statut
            </button>
        </div>

        @if (message) {
            <div class="status-message status-info">{{ message }}</div>
        }
    </div>
</body>
</html>
  `,
  imports: [FormsModule],
})
export class MecanicienVerifPostulationComponent {
  email = '';
  message = '';
  http = inject(HttpClient);
  router = inject(Router);

  verifierStatut() {
    this.http.get<{ statut: string }>(`${environment.apiUrl}/PostulMeca/statut-postulation?email=${this.email}`).subscribe({
      next: (res) => {
        const statut = res.statut;
        if (statut === 'accepte') {
          this.router.navigate(['/mecanicien/inscription'], { queryParams: { email: this.email } });
        } else if (statut === 'en attente') {
          this.message = 'Votre demande est encore en attente de validation.';
        } else if (statut === 'rejeté') {
          this.message = 'Votre demande a été rejetée par le manager.';
        } else {
           this.router.navigate(['/postulation'])
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/postulation'], { queryParams: { email: this.email } });
        } else {
          this.message = 'Erreur serveur.';
        }
      },
    });
  }
}

