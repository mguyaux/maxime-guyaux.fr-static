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
        Une collection d’articles et de notes. Le contenu est chargé depuis des fichiers Markdown.
      </p>

      <div class="list">
        <article class="card res" *ngFor="let res of resources">
          <header class="head">
            <h3 class="title">{{ res.title }}</h3>
            <span class="date" *ngIf="res.date">{{ res.date }}</span>
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
    .list { display: flex; flex-direction: column; gap: 1rem; margin-top: .75rem; }
    .res { padding: 1rem; border: 1px solid var(--gray-medium); border-radius: .75rem; background: color-mix(in srgb, var(--accent) 3%, transparent); }
    .head { display: flex; align-items: baseline; gap: .5rem; justify-content: space-between; }
    .title { margin: 0; font-size: 22px; line-height: 1.35; font-family: 'Playfair Display', serif; }
    .date { color: var(--text-secondary); font-size: .9rem; }
    .desc { margin: .25rem 0 .5rem; color: var(--text-secondary); }
    .md :where(h1,h2,h3) { font-family: 'Playfair Display', serif; }
    .md :where(pre,code) { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .md pre { padding: .75rem; background: color-mix(in srgb, var(--accent) 6%, transparent); border-radius: .5rem; overflow: auto; }
    .md code { background: color-mix(in srgb, var(--accent) 9%, transparent); padding: .1rem .3rem; border-radius: .35rem; }
    .md p { margin: .5rem 0; }
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
      const idx = fencedBlocks.push(`<pre><code>${escapeHtml(p1)}</code></pre>`) - 1;
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
      if (/^\s*<\/?(h\d|ul|pre|blockquote)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    });

    let html = lines.join('\n');
    // Restore fenced code blocks
    html = html.replace(/\{\{FENCED_(\d+)\}\}/g, (_m, idx) => fencedBlocks[Number(idx)] || '');
    return html;
  }
}
