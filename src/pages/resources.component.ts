import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ResourceMeta {
  title: string;
  summary?: string;
  date?: string; // ISO or human readable
  file: string; // relative to /assets/resources
}

interface ResourceItem extends ResourceMeta {
  html?: string; // rendered markdown
  loading?: boolean;
  error?: string | null;
}

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, HttpClientModule],
  template: `
    <section class="section">
      <h2>Ressources</h2>
      <p class="muted intro">
        Une collection d’articles et de notes.
      </p>

      <div class="list">
        <article class="card res" *ngFor="let res of resources">
          <header class="head">
            <h3 class="title">{{ res.title }}</h3>
            <span class="date" *ngIf="res.date">{{ formatDate(res.date) }}</span>
          </header>
          <p class="desc" *ngIf="res.summary">{{ res.summary }}</p>

          <div class="md" *ngIf="res.loading">Chargement…</div>
          <div class="md error" *ngIf="res.error">{{ res.error }}</div>
          <div class="md" *ngIf="!res.loading && !res.error" [innerHTML]="res.html"></div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .intro { margin-top: .25rem; }
    .list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: .75rem; }

    .res {
      padding: 1rem 1.1rem;
      border: 1px solid var(--gray-medium);
      border-radius: .9rem;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 4%, transparent),
        color-mix(in srgb, var(--accent) 2%, transparent)
      );
      box-shadow: 0 1px 2px color-mix(in srgb, #000 10%, transparent);
      transition: box-shadow .2s ease, transform .15s ease, border-color .2s ease;
      overflow: hidden; /* ensure inner overflow scrollbars stay within the card */
    }
    .res:hover { box-shadow: 0 4px 18px color-mix(in srgb, #000 14%, transparent); transform: translateY(-1px); border-color: color-mix(in srgb, var(--accent) 35%, var(--gray-medium)); }

    .head { display: flex; align-items: center; gap: .75rem; justify-content: space-between; flex-wrap: wrap; }
    .title { margin: 0; font-size: 22px; line-height: 1.35; font-family: 'Playfair Display', serif; flex: 1 1 auto; min-width: 0; }
    .date { color: var(--text-secondary); font-size: .85rem; padding: .15rem .5rem; border-radius: .5rem; background: color-mix(in srgb, var(--accent) 10%, transparent); }

    .desc { margin: .2rem 0 .6rem; color: var(--text-secondary); }

    .md { overflow-wrap: anywhere; /* prevent layout blowout by long URLs/words while preserving code */ }
    .md :where(h1,h2,h3) { font-family: 'Playfair Display', serif; margin: .6rem 0 .35rem; }
    .md :where(h4,h5,h6) { margin: .5rem 0 .25rem; }

    .md :where(pre,code) { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .md p.code-block {
      margin: .75rem 0;
      padding: .75rem .9rem;
      background: color-mix(in srgb, var(--accent) 7%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--gray-medium));
      border-radius: .6rem;
      max-width: 100%;
      box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent);
    }
    .md p.code-block code {
      display: block;
      white-space: pre-wrap; /* wrap long lines */
      background: transparent;
      padding: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    .md code { background: color-mix(in srgb, var(--accent) 12%, transparent); padding: .12rem .35rem; border-radius: .35rem; }

    .md p { margin: .55rem 0; line-height: 1.6; }

    .md ul { margin: .4rem 0 .6rem; padding-left: 1.25rem; }
    .md li { margin: .2rem 0; }

    .md a { color: color-mix(in srgb, var(--accent) 65%, #00695c); text-decoration: underline; text-underline-offset: 2px; }
    .md a:hover { text-decoration-thickness: 2px; }

    .md blockquote {
      margin: .6rem 0;
      padding: .5rem .8rem;
      border-left: 3px solid color-mix(in srgb, var(--accent) 45%, var(--gray-medium));
      background: color-mix(in srgb, var(--accent) 6%, transparent);
      border-radius: .5rem;
    }

    /* Wrapping behavior: allow code blocks to wrap, keep inline code tidy */
    .md :not(pre) code { overflow-wrap: normal; word-break: normal; }

    .error { color: #c62828; }
  `]
})
export class ResourcesComponent {
  resources: ResourceItem[] = [];

  constructor(private http: HttpClient) {
    this.loadIndex();
  }

  private loadIndex() {
    this.http.get<ResourceMeta[]>(`assets/resources/resources.json`).subscribe({
      next: (list) => {
        this.resources = list.map(item => ({ ...item, loading: true, error: null }));
        // Fetch all markdowns in parallel
        for (const item of this.resources) {
          this.http.get(`assets/resources/${item.file}`, { responseType: 'text' }).subscribe({
            next: (md) => {
              item.html = this.renderMarkdown(md);
              item.loading = false;
            },
            error: () => {
              item.error = `Impossible de charger le fichier: ${item.file}`;
              item.loading = false;
            }
          });
        }
      },
      error: () => {
        this.resources = [
          { title: 'Erreur', summary: 'Index introuvable', date: undefined, file: '', html: '', loading: false, error: 'Le fichier resources.json est introuvable.' }
        ];
      }
    });
  }

  // Formatte une date ISO (YYYY-MM-DD) au format français lisible
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    // Détecte un format ISO simple YYYY-MM-DD
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    let d: Date | null = null;
    if (isoMatch) {
      const [, y, m, dStr] = isoMatch;
      d = new Date(Number(y), Number(m) - 1, Number(dStr)); // évite les décalages de fuseau
    } else {
      // Tentative de parsing générique, en dernier recours
      const tmp = new Date(dateStr);
      if (!isNaN(tmp.getTime())) d = tmp;
    }
    if (!d) return dateStr; // si on ne sait pas parser, retourne tel quel

    const fmt = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    return fmt.format(d);
  }

  // Très simple rendu Markdown -> HTML (titres, listes, gras, italique, liens, code inline et blocs)
  private renderMarkdown(src: string): string {
    // Escape HTML first to avoid injection, then selectively re-introduce tags
    const escapeHtml = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Handle code fences
    const codeFenceRegex = /```([\s\S]*?)```/g;
    let fencedBlocks: string[] = [];
    src = src.replace(codeFenceRegex, (_m, p1) => {
      const idx = fencedBlocks.push(`<p class="code-block"><code>${escapeHtml(p1)}</code></p>`) - 1;
      return `{{FENCED_${idx}}}`;
    });

    // Inline code
    src = src.replace(/`([^`]+)`/g, (_m, p1) => `<code>${escapeHtml(p1)}</code>`);

    // Headings
    src = src.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
             .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
             .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
             .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
             .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
             .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

    // Bold and italic
    src = src.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
             .replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links [text](url)
    src = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    src = src.replace(/^(?:- |\* )(.*)$/gm, '<li>$1</li>');
    // Wrap consecutive <li> in <ul>
    src = src.replace(/(?:<(?:li)>.*<\/li>\n?)+/g, (m) => `<ul>${m.replace(/\n/g, '')}</ul>`);

    // Paragraphs: wrap lines that are not block-level
    const lines = src.split(/\n{2,}/).map(block => {
      // Skip wrapping if the block is already a block-level element or a fenced code placeholder
      if (/^\s*(\{\{FENCED_\d+\}\}|<\/?(h\d|ul|pre|blockquote|p))/m.test(block)) return block;
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    });

    let html = lines.join('\n');
    // Restore fenced code blocks
    html = html.replace(/\{\{FENCED_(\d+)\}\}/g, (_m, idx) => fencedBlocks[Number(idx)] || '');
    return html;
  }
}
