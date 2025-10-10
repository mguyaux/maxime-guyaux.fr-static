import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgIf, NgFor, AsyncPipe, SlicePipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import { ProjectsService, Project } from '../services/projects.service';

@Component({
  selector: 'app-presentation',
  standalone: true,
  template: `
    <section class="hero reveal">
      <img
        class="portrait"
        src="assets/images/portrait.jpg"
        alt="Portrait de Maxime Guyaux"
        width="160" height="160" loading="lazy"
      />
      <div class="hero-text">
        <h1>Maxime Guyaux</h1>
        <h2>Lead Tech Fullstack</h2>
        <div class="links">
          <a class="primary" routerLink="/contact" aria-label="Envoyer un email">Me contacter</a>
          <a class="secondary" href="https://github.com/mguyaux" target="_blank" rel="noopener"
             aria-label="Profil GitHub">GitHub</a>
          <a class="secondary" href="https://www.linkedin.com/in/maximeguyaux" target="_blank" rel="noopener"
             aria-label="Profil LinkedIn">LinkedIn</a>
        </div>
      </div>
    </section>

    <section class="cards-grid reveal">
      <article class="card">
        <h3>À propos</h3>
        <p>
          Passionné par la conception d’applications et l’innovation digitale, je transforme des idées en projets
          concrets, en créant des solutions robustes et performantes avec un souci constant de qualité et de
          fiabilité. </p>
      </article>

      <article class="card">
        <h3>Informations</h3>
        <ul class="info-list">
          <li><span>Âge</span><strong>{{ age }} ans</strong></li>
          <li><span>Expérience</span><strong>{{ experience }} ans</strong></li>
          <li><span>Localisation</span><strong>Lyon · Remote</strong></li>
          <li><span>Langues</span><strong>Français, Anglais</strong></li>
        </ul>
      </article>

      <article class="card">
        <h3>Curriculum Vitae</h3>
        <p>Téléchargez mon CV pour plus de détails sur mon parcours et mes réalisations.</p>
        <div class="links">
          <a class="primary" href="assets/cv/Maxime_Guyaux_CV.pdf" download
             aria-label="Télécharger le CV de Maxime Guyaux">Télécharger le CV</a>
        </div>
      </article>
    </section>

    <section class="section reveal">
      <h2>Projets récents</h2>
      <div *ngIf="projects$ | async as projects; else loading" class="recent">
        <a class="card proj" *ngFor="let p of projects | slice:0:3" [routerLink]="['/projet-detail', p.slug]" [attr.aria-label]="'Voir le projet ' + p.titre">
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
        <p *ngIf="!(projects?.length > 0)" class="muted">Aucun projet pour le moment.</p>
      </div>
      <ng-template #loading>
        <p class="muted">Chargement des projets…</p>
      </ng-template>
    </section>

    <section class="section reveal formation">
      <h2>Formation</h2>
      <ol class="edu-timeline" aria-label="Parcours de formation">
        <li class="edu-item">
          <div class="edu-year">2016</div>
          <div class="edu-content">
            <h3>Master II Technologies de l'Information</h3>
            <p class="edu-place">Université Lyon II</p>
          </div>
        </li>
        <li class="edu-item">
          <div class="edu-year">2014</div>
          <div class="edu-content">
            <h3>Licence Informatique</h3>
            <p class="edu-place">Aix-Marseille Université</p>
          </div>
        </li>
        <li class="edu-item">
          <div class="edu-year">2008</div>
          <div class="edu-content">
            <h3>Baccalauréat Scientifique</h3>
            <p class="edu-place">—</p>
          </div>
        </li>
      </ol>
    </section>
  `,
  imports: [
    RouterLink, NgIf, NgFor, AsyncPipe, SlicePipe
  ],
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem 0 0.5rem;
    }

    .portrait {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 2px 10px color-mix(in srgb, var(--text) 10%, transparent);
      border: 2px solid var(--accent);
      transition: transform .25s ease, box-shadow .25s ease;
    }

    .portrait:hover {
      transform: scale(1.015);
      box-shadow: 0 8px 20px rgba(0, 191, 166, 0.15);
    }

    .hero-text h1 {
      margin: 0;
      font-size: 48px;
      line-height: 1.25;
    }

    .hero-text h2 {
      margin: 0.2rem 0 0;
      font-weight: 500;
      color: var(--text-secondary);
      font-size: clamp(1rem, 2.2vw, 1.15rem);
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1.25rem;
    }

    /* Recent projects list (reuse styles from Projets page) */
    .recent { display: flex; flex-direction: column; gap: 1rem; margin-top: .75rem; }
    .proj { display: grid; grid-template-columns: 220px 1fr auto; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid var(--gray-medium); border-radius: .75rem; text-decoration: none; color: inherit; background: color-mix(in srgb, var(--accent) 3%, transparent); transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
    .proj:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.08); border-color: color-mix(in srgb, var(--accent) 35%, var(--gray-medium)); }
    .proj:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 40%, transparent); }
    .thumb { width: 220px; height: 150px; object-fit: cover; border-radius: .5rem; border: 1px solid var(--gray-medium); }
    .title { margin: 0 0 .25rem; font-size: 22px; line-height: 1.35; font-family: 'Playfair Display', serif; }
    .meta { margin: 0 0 .35rem; color: var(--text-secondary); }
    .desc { margin: 0; }
    .tags { display:flex; flex-wrap:wrap; gap:.4rem; list-style:none; padding:0; margin:.5rem 0 0; }
    .tags li { padding:.25rem .5rem; border:1px solid var(--gray-medium); border-radius: 999px; font-size: .85rem; color: var(--text-secondary); }
    .chevron { color: var(--accent); font-size: 1.25rem; padding: 0 .25rem; transition: transform .2s ease; }
    .proj:hover .chevron { transform: translateX(2px); }

    .card h3 {
      margin: 0 0 0.5rem;
      font-size: 24px;
      line-height: 1.35;
    }

    .card p {
      margin: 0.25rem 0 0;
    }

    .info-list {
      list-style: none;
      margin: 0.25rem 0 0;
      padding: 0;
      display: grid;
      gap: 0.5rem;
    }

    .info-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.35rem 0;
      border-bottom: 1px dashed var(--gray-medium);
    }

    .info-list li:last-child {
      border-bottom: none;
    }

    .info-list span {
      color: var(--text-secondary);
    }

    .info-list strong {
      font-weight: 600;
    }

    /* Formation section */
    .formation { margin-top: 2rem; }
    .formation h2 { margin: 0 0 .75rem; font-size: 32px; line-height: 1.3; }
    .edu-timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: .75rem; }
    .edu-item { display: grid; grid-template-columns: 90px 1fr; gap: 1rem; align-items: start; padding: .85rem 1rem; border: 1px solid var(--gray-medium); border-radius: .75rem; background: color-mix(in srgb, var(--accent) 3%, transparent); }
    .edu-year { font-family: 'Playfair Display', serif; font-weight: 600; color: var(--accent); font-size: 1.05rem; padding-top: .2rem; }
    .edu-content h3 { margin: 0; font-size: 20px; line-height: 1.35; font-family: 'Playfair Display', serif; }
    .edu-place { margin: .2rem 0 0; color: var(--text-secondary); }

    @media (max-width: 540px) {
      .edu-item { grid-template-columns: 1fr; }
      .edu-year { padding-top: 0; }
    }

    @media (max-width: 880px) {
      .cards-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 540px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .portrait {
        margin: 0 auto;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Responsive adjustments for recent projects */
    @media (max-width: 880px) {
      .proj { grid-template-columns: 180px 1fr auto; }
      .thumb { width: 180px; height: 120px; }
      .title { font-size: 20px; }
    }

    @media (max-width: 640px) {
      .proj { grid-template-columns: 1fr; grid-template-rows: auto auto auto; text-align: left; }
      .thumb { width: 100%; height: auto; aspect-ratio: 16 / 10; }
      .chevron { justify-self: end; }
      .proj { align-items: start; }
    }

    @media (max-width: 420px) {
      .tags li { font-size: .8rem; padding: .2rem .45rem; }
      .meta { font-size: .95rem; }
    }
  `]
})
export class PresentationComponent {
  projects$: Observable<Project[]> = this.projectsService.getProjects();

  private readonly birthDate = new Date(1990, 6, 21); // 21 juillet 1990 (mois 0-index)
  private readonly startDate = new Date(2016, 8, 26); // 26 septembre 2016

  constructor(private projectsService: ProjectsService) {}

  get age(): number {
    return this.yearsBetween(this.birthDate, new Date());
  }

  get experience(): number {
    return this.yearsBetween(this.startDate, new Date());
  }

  private yearsBetween(from: Date, to: Date): number {
    let years = to.getFullYear() - from.getFullYear();
    const m = to.getMonth() - from.getMonth();
    if (m < 0 || (m === 0 && to.getDate() < from.getDate())) {
      years--;
    }
    return years;
  }
}
