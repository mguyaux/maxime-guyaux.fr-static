import { Routes } from '@angular/router';
import { PresentationComponent } from './pages/presentation.component';
import { ProjetsComponent } from './pages/projets.component';
import { TechnologiesComponent } from './pages/technologies.component';
import { ContactComponent } from './pages/contact.component';
import { ProjetDetailComponent } from './pages/projet-detail.component';
import { ResourcesComponent } from './pages/resources.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', title: 'Présentation — Maxime Guyaux', component: PresentationComponent },
  { path: 'projets', title: 'Projets — Maxime Guyaux', component: ProjetsComponent },
  { path: 'projet-detail/:slug', title: 'Détail projet — Maxime Guyaux', component: ProjetDetailComponent },
  { path: 'technologies', title: 'Technologies — Maxime Guyaux', component: TechnologiesComponent },
  { path: 'ressources', title: 'Ressources — Maxime Guyaux', component: ResourcesComponent },
  { path: 'talks', redirectTo: 'ressources' },
  { path: 'contact', title: 'Contact — Maxime Guyaux', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
