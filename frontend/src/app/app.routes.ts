import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { LoginManagerComponent } from './manager/manager';
import { DashboardManagerComponent  } from './manager/dashboard/dashboard';
import { PostulationMecanicienComponent } from './postulation/postulation';
import { MecanicienVerifPostulationComponent } from './postulation/verification/verification';
import { GestionMecaniciensComponent } from './manager/dashboard/gestion-mecanicien/gestion-mecanicien';
import { InscriptionMecanicienComponent } from './mecanicien/inscription/inscription';;
 


// import { Contact } from './contact';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'connexion-manager', component: LoginManagerComponent },
  { path: 'manager/dashboard', component: DashboardManagerComponent  },
  { path: 'manager/dashboard/gestion-mecanicien', component: GestionMecaniciensComponent  },
  { path: 'postulation', component: PostulationMecanicienComponent  },
  { path: 'verifier-statut', component: MecanicienVerifPostulationComponent  },
  { path: 'mecanicien/inscription', component: InscriptionMecanicienComponent  },

//   { path: 'contact', component: Contact }
];
