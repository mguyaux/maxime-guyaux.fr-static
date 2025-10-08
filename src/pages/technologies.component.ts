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
    .list { display: flex; flex-direction: column; gap: 1rem; margin-top: .75rem; }
    .card { display: grid; grid-template-columns: 1fr auto; gap: .75rem; align-items: center; padding: 1rem; border: 1px solid var(--gray-medium); border-radius: .75rem; background: color-mix(in srgb, var(--accent) 3%, transparent); }
    .title { margin: 0 0 .35rem; font-size: 22px; line-height: 1.35; font-family: 'Playfair Display', serif; }
    .desc { margin: 0; color: var(--text-secondary); }
    .level { display: flex; gap: .35rem; margin-top: .6rem; }
    .dot { width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--gray-medium); background: transparent; transition: background-color .2s ease, border-color .2s ease; }
    .dot.filled { background: var(--accent); border-color: color-mix(in srgb, var(--accent) 60%, var(--gray-medium)); }
    .muted { color: var(--text-secondary); }
    @media (max-width: 700px) { .card { grid-template-columns: 1fr; } }
  `]
})
export class TechnologiesComponent {
  technologies$: Observable<Technology[]> = this.technologiesService.getTechnologies();
  constructor(private technologiesService: TechnologiesService) {}
}
