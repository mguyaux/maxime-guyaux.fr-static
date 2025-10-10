import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TechnologiesService, Technology } from '../services/technologies.service';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  template: `
    <section class="section">
      <h2>Technologies</h2>

      <aside class="scale card" aria-label="Barème d'évaluation des technologies">
        <strong>Barème</strong>
        <div class="scale-legend">
          <span class="legend-item" aria-label="Exemple niveau 1 sur 5">
            <span class="level" role="img">
              <span *ngFor="let i of [1,2,3,4,5]" class="dot" [class.filled]="i <= 1"></span>
            </span>
            <span class="legend-text">— j'ai déjà utilisé la technologie</span>
          </span>
          <span class="sep" aria-hidden="true">•</span>
          <span class="legend-item" aria-label="Exemple niveau 5 sur 5">
            <span class="level" role="img">
              <span *ngFor="let i of [1,2,3,4,5]" class="dot" [class.filled]="i <= 5"></span>
            </span>
            <span class="legend-text">— c'est la technologie que je connais le mieux</span>
          </span>
        </div>
      </aside>

      <div *ngIf="technologies$ | async as technos; else loading">
        <div class="list">
          <article class="card" *ngFor="let t of technos" [attr.aria-label]="'Technologie ' + t.nom">
            <div class="content">
              <h3 class="title">{{ t.nom }}</h3>
              <p class="desc">{{ t.description }}</p>
              <div class="level" [attr.aria-label]="'Niveau ' + t.niveau + ' sur 5'" role="img">
                <span *ngFor="let i of [1,2,3,4,5]" class="dot" [class.filled]="i <= t.niveau"></span>
              </div>
            </div>
          </article>
        </div>
        <p *ngIf="!technos.length" class="muted">Aucune technologie pour le moment.</p>
      </div>
      <ng-template #loading>
        <p class="muted">Chargement des technologies…</p>
      </ng-template>
    </section>
  `,
  styles: [`
    .scale { margin-top: .5rem; margin-bottom: .75rem; padding: .9rem 1rem; display: flex; align-items: center; gap: .75rem; }
    .scale strong { font-family: 'Playfair Display', serif; }
    .scale-legend { display: flex; flex-wrap: wrap; gap: .5rem .75rem; color: var(--text-secondary); align-items: center; }
    .scale .sep { color: var(--gray-medium); }
    .legend-item { display: inline-flex; align-items: center; gap: .45rem; }
    .legend-item .level { margin-top: 0; }
    .legend-text { white-space: nowrap; }

    .list { display: flex; flex-direction: column; gap: 1rem; margin-top: .75rem; }
    .card { display: grid; grid-template-columns: 1fr auto; gap: .75rem; align-items: center; padding: 1rem; border: 1px solid var(--gray-medium); border-radius: .75rem; background: color-mix(in srgb, var(--accent) 3%, transparent); }
    .title { margin: 0 0 .35rem; font-size: 22px; line-height: 1.35; font-family: 'Playfair Display', serif; }
    .desc { margin: 0; color: var(--text-secondary); }
    .level { display: flex; gap: .35rem; margin-top: .6rem; }
    .dot { width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--gray-medium); background: transparent; transition: background-color .2s ease, border-color .2s ease; }
    .dot.filled { background: var(--accent); border-color: color-mix(in srgb, var(--accent) 60%, var(--gray-medium)); }
    .muted { color: var(--text-secondary); }

    /* Hide the barème on small screens */
    @media (max-width: 640px) { .scale { display: none; } }

    @media (max-width: 700px) { .card { grid-template-columns: 1fr; } }
  `]
})
export class TechnologiesComponent {
  technologies$: Observable<Technology[]> = this.technologiesService.getTechnologies();
  constructor(private technologiesService: TechnologiesService) {}
}
