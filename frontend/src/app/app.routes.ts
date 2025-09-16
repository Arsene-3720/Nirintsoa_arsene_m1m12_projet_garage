import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { LoginManagerComponent } from './manager/manager';
import { DashboardManagerComponent  } from './manager/dashboard/dashboard';
import { PostulationMecanicienComponent } from './postulation/postulation';
import { MecanicienVerifPostulationComponent } from './postulation/verification/verification';
import { DashboardMecanicienComponent } from './mecanicien/dashboard/dashboard';
import { GestionMecaniciensComponent } from './manager/dashboard/gestion-mecanicien/gestion-mecanicien';
import { InscriptionMecanicienComponent } from './mecanicien/inscription/inscription';
import  LoginMecanicienComponent  from './mecanicien/connexion/connexion';
import { GestionServiceComponent } from './manager/dashboard/gestion-service/gestion-service';
import { RegisterClientComponent } from './accueil/insription/insription';
import { ServiceDetailComponent } from './service/service';
import { RendezvousComponent } from './rendezvous/rendezvous';
import { authGuard } from './services/services';
import { ConnexionComponent } from './accueil/connexion/connexion';
 


// import { Contact } from './contact';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'inscription', component: RegisterClientComponent },
  { path: 'connexion', component: ConnexionComponent  },
  { path: 'connexion-manager', component: LoginManagerComponent },
  { path: 'manager/dashboard', component: DashboardManagerComponent  },
  { path: 'manager/dashboard/gestion-mecanicien', component: GestionMecaniciensComponent  },
  { path: 'postulation', component: PostulationMecanicienComponent  },
  { path: 'verifier-statut', component: MecanicienVerifPostulationComponent  },
  { path: 'mecanicien/inscription', component: InscriptionMecanicienComponent  },
  { path: 'mecanicien/connexion', component: LoginMecanicienComponent },
  { path: 'mecanicien/dashboard', component: DashboardMecanicienComponent },
  { path: 'manager/gestion-service', component: GestionServiceComponent },
  { path: 'service/:id', component: ServiceDetailComponent },
  { path: 'rendezvous/:id', component: RendezvousComponent, canActivate: [authGuard] },
  { path: 'rendezvous', component: RendezvousComponent, canActivate: [authGuard] },
//   { path: 'contact', component: Contact }
];
