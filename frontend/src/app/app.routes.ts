import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { LoginManagerComponent } from './manager/manager';
import { DashboardManagerComponent  } from './manager/dashboard/dashboard';
// import { Contact } from './contact';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'connexion-manager', component: LoginManagerComponent },
  { path: 'manager/dashboard', component: DashboardManagerComponent  },
//   { path: 'contact', component: Contact }
];
