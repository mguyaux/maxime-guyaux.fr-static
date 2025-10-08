import { Component } from '@angular/core';

@Component({
  selector: 'app-talks',
  standalone: true,
  template: `
    <section class="section">
      <h2>Talks</h2>
      <p class="muted intro">
        Quelques conférences et meetups auxquels j’ai eu le plaisir d’assister ou de contribuer.
      </p>

      <div class="list">
        <article class="card talk">
          <h3 class="title">Devoxx 2023</h3>
          <p class="desc">Présence à l’édition 2023 de Devoxx France.</p>
        </article>
        <article class="card talk">
          <h3 class="title">Devoxx 2024</h3>
          <p class="desc">Présence à l’édition 2024 de Devoxx France.</p>
        </article>
        <article class="card talk">
          <h3 class="title">Lyon JUG</h3>
          <p class="desc">Participation régulière aux rencontres du Java User Group de Lyon.</p>
        </article>
        <article class="card talk">
          <h3 class="title">Blend Web Mix Lyon</h3>
          <p class="desc">Intervention au nom de l’université Lyon 1 sur des sujets d’interopérabilité.</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .intro { margin-top: .25rem; }
    .list { display: flex; flex-direction: column; gap: 1rem; margin-top: .75rem; }
    .talk { padding: 1rem; border: 1px solid var(--gray-medium); border-radius: .75rem; background: color-mix(in srgb, var(--accent) 3%, transparent); }
    .title { margin: 0 0 .25rem; font-size: 22px; line-height: 1.35; font-family: 'Playfair Display', serif; }
    .desc { margin: 0; color: var(--text-secondary); }
  `]
})
export class TalksComponent {}
