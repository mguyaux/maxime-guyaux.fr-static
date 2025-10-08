import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { Project, ProjectsService } from '../services/projects.service';

interface Vm { loaded: boolean; project?: Project }

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterLink],
  template: `
    <section class="section" *ngIf="vm$ | async as vm">
      <ng-container *ngIf="!vm.loaded">
        <p class="muted">Chargement…</p>
      </ng-container>
      <ng-container *ngIf="vm.loaded && !vm.project">
        <p class="muted">Projet introuvable.</p>
        <p><a routerLink="/projets">← Retour à la liste des projets</a></p>
      </ng-container>
      <ng-container *ngIf="vm.loaded && vm.project as p">
        <a routerLink="/projets" class="back">← Retour aux projets</a>

        <header class="header">
          <img class="cover" [src]="p.imageFile" [alt]="'Image du projet ' + p.titre" width="640" height="360" loading="lazy"/>
          <div>
            <h1 class="title">{{ p.titre }}</h1>
            <p class="meta">
              Client final : <strong>{{ p.clientFinal }}</strong>
              <span *ngIf="p.via"> · Via {{ p.via }}</span>
              <span *ngIf="p.duree"> · Durée {{ p.duree }}</span>
            </p>
            <p class="short">{{ p.descriptionCourte }}</p>
          </div>
        </header>

        <article class="content">
          <h2>Description</h2>
          <div class="rich" [innerHTML]="p.description"></div>

          <h2>Technologies</h2>
          <ul class="tags">
            <li *ngFor="let t of p.technologies">{{ t }}</li>
          </ul>
        </article>
      </ng-container>
    </section>
  `,
  styles: [`
    .back { display:inline-block; margin-bottom:.5rem; color: var(--accent); text-decoration:none; }
    .header { display:grid; grid-template-columns: 280px 1fr; gap:1rem; align-items:start; }
    .cover { width:280px; height:200px; object-fit:cover; border-radius:.5rem; border:1px solid var(--gray-medium); }
    .title { margin: 0 0 .25rem; font-size: 28px; }
    .meta { margin: 0 0 .5rem; color: var(--text-secondary); }
    .short { margin: 0; }
    .content { margin-top: 1rem; }
    .rich :where(p, ul, ol) { margin: .5rem 0; }
    .rich ul { padding-left: 1.25rem; }
    .rich li { margin: .25rem 0; }
    .rich b, .rich strong { font-weight: 600; }
    .tags { display:flex; flex-wrap:wrap; gap:.5rem; list-style:none; padding:0; margin:.5rem 0 0; }
    .tags li { padding:.25rem .5rem; border:1px solid var(--gray-medium); border-radius:999px; }
    .muted { color: var(--text-secondary); }
    @media (max-width: 700px) {
      .header { grid-template-columns: 1fr; }
      .cover { width:100%; height:220px; }
    }
  `]
})
export class ProjetDetailComponent {
  vm$: Observable<Vm> = this.route.paramMap.pipe(
    switchMap(params => this.projects.getBySlug(params.get('slug') || '').pipe(
      map(project => ({ loaded: true, project } as Vm)),
      startWith({ loaded: false } as Vm)
    ))
  );

  constructor(private route: ActivatedRoute, private projects: ProjectsService) {}
}
