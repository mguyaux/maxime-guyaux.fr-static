import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectsService, Project } from '../services/projects.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, RouterLink],
  template: `
    <section class="section">
      <h2>Projets</h2>

      <div *ngIf="projects$ | async as projects; else loading">
        <div class="list">
          <a class="card" *ngFor="let p of projects" [routerLink]="['/projet-detail', p.slug]" [attr.aria-label]="'Voir le projet ' + p.titre">
            <img class="thumb" [src]="p.imageFile" [alt]="'Image du projet ' + p.titre" width="200" height="140" loading="lazy"/>
            <div class="content">
              <h3 class="title">{{ p.titre }}</h3>
              <p class="meta">
                Client final : <strong>{{ p.clientFinal }}</strong>
                <span class="via" *ngIf="p.via"> · Via {{ p.via }}</span>
                <span class="duree" *ngIf="p.duree"> · Durée {{ p.duree }}</span>
              </p>
              <p class="desc">{{ p.descriptionCourte }}</p>
              <ul class="tags" *ngIf="p.technologies?.length">
                <li *ngFor="let t of p.technologies">{{ t }}</li>
              </ul>
            </div>
            <span class="chevron" aria-hidden="true">→</span>
          </a>
        </div>
        <p *ngIf="!projects.length" class="muted">Aucun projet pour le moment.</p>
      </div>
      <ng-template #loading>
        <p class="muted">Chargement des projets…</p>
      </ng-template>
    </section>
  `,
  styles: [`
    .list { display: flex; flex-direction: column; gap: 1rem; margin-top: .75rem; }
    .card { display: grid; grid-template-columns: 220px 1fr auto; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid var(--gray-medium); border-radius: .75rem; text-decoration: none; color: inherit; background: color-mix(in srgb, var(--accent) 3%, transparent); transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); border-color: color-mix(in srgb, var(--accent) 35%, var(--gray-medium)); }
    .card:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 40%, transparent); }
    .thumb { width: 220px; height: 150px; object-fit: cover; border-radius: .5rem; border: 1px solid var(--gray-medium); }
    .title { margin: 0 0 .25rem; font-size: 22px; line-height: 1.35; font-family: 'Playfair Display', serif; }
    .meta { margin: 0 0 .35rem; color: var(--text-secondary); }
    .desc { margin: 0; }
    .tags { display:flex; flex-wrap:wrap; gap:.4rem; list-style:none; padding:0; margin:.5rem 0 0; }
    .tags li { padding:.25rem .5rem; border:1px solid var(--gray-medium); border-radius: 999px; font-size: .85rem; color: var(--text-secondary); }
    .chevron { color: var(--accent); font-size: 1.25rem; padding: 0 .25rem; transition: transform .2s ease; }
    .card:hover .chevron { transform: translateX(2px); }
    .muted { color: var(--text-secondary); }

    /* Responsive adjustments aligned with Presentation page */
    @media (max-width: 880px) {
      .card { grid-template-columns: 180px 1fr auto; }
      .thumb { width: 180px; height: 120px; }
      .title { font-size: 20px; }
    }

    @media (max-width: 640px) {
      .card { grid-template-columns: 1fr; grid-template-rows: auto auto auto; text-align: left; align-items: start; }
      .thumb { width: 100%; height: auto; aspect-ratio: 16 / 10; display: block; }
      .chevron { justify-self: end; }
    }

    @media (max-width: 420px) {
      .tags li { font-size: .8rem; padding: .2rem .45rem; }
      .meta { font-size: .95rem; }
    }
  `]
})
export class ProjetsComponent {
  projects$: Observable<Project[]> = this.projectsService.getProjects();
  constructor(private projectsService: ProjectsService) {}
}
