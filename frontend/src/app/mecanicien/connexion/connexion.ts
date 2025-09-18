import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-mecanicien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion Mécanicien</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            line-height: 1.6;
        }
        
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 3rem 2.5rem;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.3);
            width: 100%;
            max-width: 450px;
            position: relative;
            overflow: hidden;
        }
        
        .login-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(135deg, #1e3a8a, #3730a3);
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 2.5rem;
        }
        
        .login-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #1e3a8a, #3730a3);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            box-shadow: 0 10px 30px rgba(30, 58, 138, 0.3);
        }
        
        .login-icon::before {
            content: '🔧';
            font-size: 2rem;
        }
        
        .login-title {
            font-size: 2rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #1e3a8a, #3730a3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .login-subtitle {
            color: #64748b;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .form-group {
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
            border-color: #1e3a8a;
            box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.15);
            transform: translateY(-2px);
        }
        
        .form-input::placeholder {
            color: #94a3b8;
            font-weight: 500;
        }
        
        .form-input:required:invalid {
            box-shadow: none;
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
        
        .form-group:focus-within .input-icon {
            color: #1e3a8a;
        }
        
        .email-icon::before {
            content: '✉️';
        }
        
        .password-icon::before {
            content: '🔒';
        }
        
        .login-button {
            width: 100%;
            background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
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
            margin-top: 1rem;
            box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4);
            font-family: inherit;
        }
        
        .login-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(30, 58, 138, 0.5);
            background: linear-gradient(135deg, #1e40af 0%, #4338ca 100%);
        }
        
        .login-button:active {
            transform: translateY(-1px);
        }
        
        .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        .error-message {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #dc2626;
            font-weight: 600;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            margin-top: 1.5rem;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
            display: flex;
            align-items: center;
            animation: shake 0.5s ease-in-out;
        }
        
        .error-message::before {
            content: '⚠️';
            margin-right: 0.75rem;
            font-size: 1.1rem;
        }
        
        .success-message {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
            border: 1px solid rgba(16, 185, 129, 0.2);
            color: #065f46;
            font-weight: 600;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            margin-top: 1.5rem;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
            display: flex;
            align-items: center;
            animation: slideIn 0.5s ease-out;
        }
        
        .success-message::before {
            content: '✅';
            margin-right: 0.75rem;
            font-size: 1.1rem;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
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
        
        .mechanic-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(30, 58, 138, 0.1);
            border: 1px solid rgba(30, 58, 138, 0.2);
            border-radius: 12px;
            color: #1e3a8a;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .mechanic-badge::before {
            content: '🛠️';
            margin-right: 0.5rem;
        }
        
        .floating-tools {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        }
        
        .tool {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            animation: float 8s ease-in-out infinite;
        }
        
        .tool-1 {
            width: 60px;
            height: 20px;
            top: 15%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .tool-2 {
            width: 40px;
            height: 40px;
            top: 70%;
            right: 15%;
            animation-delay: 3s;
            border-radius: 50%;
        }
        
        .tool-3 {
            width: 30px;
            height: 60px;
            top: 85%;
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
                opacity: 0.7;
            }
        }
        
        @media (max-width: 768px) {
            .login-container {
                padding: 2rem 1.5rem;
                margin: 1rem;
                border-radius: 20px;
            }
            
            .login-title {
                font-size: 1.75rem;
            }
            
            .login-icon {
                width: 60px;
                height: 60px;
                margin-bottom: 1rem;
            }
            
            .login-icon::before {
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
            
            .login-container {
                padding: 1.5rem;
            }
            
            .login-title {
                font-size: 1.5rem;
            }
        }
        
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 0.5rem;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .button-loading {
            pointer-events: none;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="floating-tools">
        <div class="tool tool-1"></div>
        <div class="tool tool-2"></div>
        <div class="tool tool-3"></div>
    </div>
    
    <div class="login-container">
        <div class="login-header">
            <div class="login-icon"></div>
            <h2 class="login-title">Connexion Mécanicien</h2>
            <p class="login-subtitle">Accédez à votre espace technique</p>
        </div>

        <form (ngSubmit)="login()" class="login-form">
            <div class="form-group">
                <div class="input-icon email-icon"></div>
                <input 
                    type="email" 
                    [(ngModel)]="email" 
                    name="email" 
                    placeholder="Votre adresse email" 
                    class="form-input" 
                    required
                >
            </div>

            <div class="form-group">
                <div class="input-icon password-icon"></div>
                <input 
                    type="password" 
                    [(ngModel)]="password" 
                    name="password" 
                    placeholder="Votre mot de passe" 
                    class="form-input" 
                    required
                >
            </div>

            <button type="submit" class="login-button">
                Se connecter
            </button>
        </form>

        @if (erreur) {
            <div class="error-message">{{ erreur }}</div>
        }

        @if (success) {
            <div class="success-message">Connexion réussie !</div>
        }

        <div class="mechanic-badge">
            Espace Technicien Professionnel
        </div>
    </div>
</body>
</html>
  `
})
export default class LoginMecanicienComponent {
  email = '';
  password = '';
  erreur = '';
  success = false;

  http = inject(HttpClient);
  router = inject(Router);
  

  
  login() {
    this.http.post<any>(`${environment.apiUrl}/Mecaniciens/login-mecanicien`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        this.success = false;
        this.erreur = '';

        if (res.status === 'accepted') {
          // Connexion réussie
          this.success = true;
          localStorage.setItem('mecanicien', JSON.stringify(res.mecanicien)); 
          this.router.navigate(['/mecanicien/dashboard']);
        } 
        else if (res.status === 'pending') {
          this.erreur = "Votre candidature est encore en attente.";
          this.router.navigate(['/mecanicien/statut-postulation']);
        } 
        else if (res.status === 'not-found') {
          this.erreur = "Aucun compte trouvé, veuillez vous inscrire.";
          this.router.navigate(['postulation']);
        } 
        else if (res.status === 'rejected') {
          this.erreur = "Votre candidature a été rejetée.";
          this.router.navigate(['/mecanicien/statut-postulation']);
        }
      },
      error: err => {
        this.success = false;
        this.erreur = err.error?.error || 'Erreur lors de la connexion';
      }
    });
  }

}
