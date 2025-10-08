import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgIf],
  template: `
    <section class="section">
      <h2>Contact</h2>
      <article class="card contact-card" aria-labelledby="contact-title">
        <h3 id="contact-title">Me contacter par e‑mail</h3>
        <p class="muted">Le plus simple est de m’écrire un e‑mail.</p>

        <div class="email-row">
          <span class="label">Adresse</span>
          <!-- Rendered safely via JS to prevent scraping -->
          <a class="email-link" href="#" (click)="compose($event)" rel="nofollow noopener" aria-label="Envoyer un email">Afficher l'adresse</a>
          <button *ngIf="emailVisible" class="icon-btn copy-btn" type="button" (click)="copyEmail()" [attr.title]="copyTooltip" aria-label="Copier l’adresse e‑mail">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
        </div>

      </article>
    </section>
  `,
  styles: [`
    .contact-card { padding: 1.25rem; }
    .email-row { display:flex; align-items:center; gap:.75rem; margin-top:.5rem; }
    .label { color: var(--text-secondary); }
    .email-link { font-weight:600; }
    .copy-btn { width: 32px; height: 32px; border-radius: var(--radius-pill); border: 1.5px solid var(--accent); color: var(--accent); background: transparent; display:inline-flex; align-items:center; justify-content:center; }
    .copy-btn:hover { background: rgba(0,191,166,0.06); transform: translateY(-1px); }
    .copy-btn svg { width: 18px; height: 18px; }
    .tooltip { color: var(--text-secondary); font-size: .9rem; }
    .hints { margin-top: .75rem; }
    .hints ul { margin:.25rem 0 0; padding-left: 1.25rem; }
  `]
})
export class ContactComponent {
  private readonly user = 'pro';
  private readonly domain1 = 'maxime-g';
  private readonly domain2 = 'uyaux';

  emailVisible = false;
  copyTooltip = 'Copier';
  private currentAddress = '';

  compose(event: MouseEvent) {
    event.preventDefault();
    const addr = `${this.user}@${this.domain1}${this.domain2}.fr`;
    this.currentAddress = addr;
    // set href on the fly to avoid static email harvesting
    const a = event.currentTarget as HTMLAnchorElement;
    a.href = `mailto:${addr}`;
    a.textContent = addr;
    this.emailVisible = true;
    this.copyTooltip = 'Copier';
    // Optionally open mail client (defer to let button render)
    // Do not auto-open the mail client to avoid navigation interrupting DOM updates.
    // Users can click the revealed address to open their mail app.
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.currentAddress);
      this.copyTooltip = 'Copié !';
      setTimeout(() => this.copyTooltip = 'Copier', 2000);
    } catch {
      // Fallback: create a temporary textarea
      const ta = document.createElement('textarea');
      ta.value = this.currentAddress;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.copyTooltip = 'Copié !';
      setTimeout(() => this.copyTooltip = 'Copier', 2000);
    }
  }
}
