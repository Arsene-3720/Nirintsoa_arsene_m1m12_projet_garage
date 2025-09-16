import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services/services';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détails du service</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            min-height: 100vh;
            padding: 2rem 1rem;
            color: #1e293b;
            line-height: 1.6;
        }
        
        .service-container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(226, 232, 240, 0.6);
        }
        
        .service-header {
            text-align: center;
            margin-bottom: 2.5rem;
            position: relative;
        }
        
        .service-title {
            font-size: 2.25rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .service-subtitle {
            color: #64748b;
            font-size: 1.1rem;
            font-weight: 500;
        }
        
        .service-header::after {
            content: '';
            position: absolute;
            bottom: -1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
        }
        
        .services-list {
            list-style: none;
            display: grid;
            gap: 1.5rem;
        }
        
        .service-item {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 2px solid #e2e8f0;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .service-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
            transition: background 0.3s ease;
        }
        
        .service-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
            border-color: #3b82f6;
        }
        
        .service-item:hover::before {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }
        
        .service-item-selected {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-color: #f59e0b;
            transform: translateY(-5px);
            box-shadow: 0 20px 50px rgba(245, 158, 11, 0.3);
        }
        
        .service-item-selected::before {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .service-name {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
        }
        
        .service-name::before {
            content: '🔧';
            margin-right: 0.75rem;
            font-size: 1.25rem;
        }
        
        .service-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .detail-item {
            background: rgba(59, 130, 246, 0.05);
            padding: 0.75rem 1rem;
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
            font-size: 0.95rem;
            color: #334155;
        }
        
        .detail-label {
            font-weight: 600;
            color: #1e40af;
            margin-right: 0.5rem;
        }
        
        .service-description {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
            padding: 1.25rem;
            border-radius: 12px;
            border: 1px solid rgba(139, 92, 246, 0.1);
            color: #4c1d95;
            font-style: italic;
            margin-bottom: 1.5rem;
            position: relative;
        }
        
        .service-description::before {
            content: '"';
            position: absolute;
            top: 0.5rem;
            left: 0.75rem;
            font-size: 2rem;
            color: #8b5cf6;
            opacity: 0.3;
        }
        
        .action-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 0.875rem 1.75rem;
            border-radius: 12px;
            border: none;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-family: inherit;
            min-width: 160px;
            justify-content: center;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #1e40af, #1d4ed8);
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
        }
        
        .btn-primary::before {
            content: '📅';
            font-size: 1rem;
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #64748b, #475569);
            color: white;
            box-shadow: 0 8px 25px rgba(100, 116, 139, 0.3);
        }
        
        .btn-secondary:hover {
            background: linear-gradient(135deg, #475569, #334155);
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(100, 116, 139, 0.4);
        }
        
        .btn-secondary::before {
            content: '←';
            font-size: 1.1rem;
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
            top: 0;
            left: 0;
        }
        
        .shape {
            position: absolute;
            background: rgba(59, 130, 246, 0.05);
            border-radius: 50%;
            animation: float 15s ease-in-out infinite;
        }
        
        .shape-1 {
            width: 120px;
            height: 120px;
            top: 10%;
            left: 5%;
            animation-delay: 0s;
        }
        
        .shape-2 {
            width: 80px;
            height: 80px;
            top: 70%;
            right: 10%;
            animation-delay: 5s;
        }
        
        .shape-3 {
            width: 100px;
            height: 100px;
            top: 50%;
            left: 2%;
            animation-delay: 10s;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) scale(1);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-40px) scale(1.1);
                opacity: 0.6;
            }
        }
        
        .stats-bar {
            display: flex;
            justify-content: space-around;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(59, 130, 246, 0.05);
            border-radius: 16px;
            border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 1.5rem;
            font-weight: 800;
            color: #3b82f6;
            display: block;
        }
        
        .stat-label {
            font-size: 0.8rem;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        @media (max-width: 768px) {
            .service-container {
                padding: 1.5rem;
                margin: 1rem;
                border-radius: 16px;
            }
            
            .service-title {
                font-size: 1.75rem;
            }
            
            .service-details {
                grid-template-columns: 1fr;
            }
            
            .action-buttons {
                flex-direction: column;
            }
            
            .btn {
                min-width: auto;
            }
            
            .stats-bar {
                flex-direction: column;
                gap: 1rem;
            }
        }
        
        @media (max-width: 480px) {
            body {
                padding: 1rem 0.5rem;
            }
            
            .service-container {
                padding: 1rem;
            }
            
            .service-title {
                font-size: 1.5rem;
            }
            
            .service-item {
                padding: 1.5rem;
            }
        }
        
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: #64748b;
        }
        
        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .empty-state-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .empty-state-text {
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
    </div>
    
    <div class="service-container">
        <div class="service-header">
            <h2 class="service-title">Détails du service</h2>
            <p class="service-subtitle">Découvrez nos prestations et prenez rendez-vous</p>
        </div>

        <ul class="services-list">
            @for (ss of sousServices(); track ss._id) {
                <li 
                    class="service-item"
                    [class.service-item-selected]="ss._id === selectedId"
                >
                    <h3 class="service-name">{{ ss.nom }}</h3>
                    
                    <div class="service-details">
                        <div class="detail-item">
                            <span class="detail-label">Durée :</span>
                            {{ ss.dureeEstimee }} min
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Prix :</span>
                            {{ ss.prix }} Ar
                        </div>
                    </div>
                    
                    <div class="service-description">
                        {{ ss.description }}
                    </div>
                    
                    <div class="action-buttons">
                        <button 
                            class="btn btn-primary"
                            [routerLink]="['/rendezvous', ss._id]"
                        >
                            Prendre rendez-vous
                        </button>
                        
                        <!-- Bouton Retour -->
                        <button 
                            class="btn btn-secondary"
                            [routerLink]="['/service']"
                        >
                            Retour
                        </button>
                    </div>
                </li>
            }
        </ul>
    </div>
</body>
</html>
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
