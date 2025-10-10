import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <nav class="top-nav" [class.nav-open]="menuOpen">
      <a class="brand" [routerLink]="['/']">Maxime Guyaux</a>
      <div class="spacer"></div>

      <!-- Desktop links -->
      <div class="nav-links">
        <a [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">Présentation</a>
        <a routerLink="/projets" routerLinkActive="active" (click)="closeMenu()">Projets</a>
        <a routerLink="/technologies" routerLinkActive="active" (click)="closeMenu()">Technologies</a>
        <a routerLink="/talks" routerLinkActive="active" (click)="closeMenu()">Talks</a>
        <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a>
      </div>

      <button class="icon-btn theme-toggle" type="button"
              (click)="toggleTheme()"
              [attr.aria-label]="isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'"
              [attr.title]="isDarkMode ? 'Mode clair' : 'Mode sombre'">
        <svg *ngIf="isDarkMode" viewBox="0 0 24 24" aria-hidden="true">
          <!-- Sun icon -->
          <path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.03 2.64l1.8-1.8-1.79-1.79-1.8 1.79 1.79 1.8zM17 13h3v-2h-3v2zM12 6a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8zm7 7h-2v-3h2v3zM5 23H3v-3h2v3zm13.66-3.34l-1.8-1.8 1.79-1.79 1.8 1.79-1.79 1.8zM4.34 19.66l-1.79-1.8 1.8-1.79 1.79 1.79-1.8 1.8z"/>
        </svg>
        <svg *ngIf="!isDarkMode" viewBox="0 0 24 24" aria-hidden="true">
          <!-- Moon icon -->
          <path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
        </svg>
      </button>

      <!-- Hamburger -->
      <button class="icon-btn hamburger" type="button"
              (click)="menuOpen = !menuOpen"
              [attr.aria-expanded]="menuOpen"
              aria-controls="mobile-menu"
              aria-label="Menu">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>
      </button>

      <!-- Mobile drawer -->
      <div id="mobile-menu" class="mobile-menu" *ngIf="menuOpen">
        <a [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">Présentation</a>
        <a routerLink="/projets" routerLinkActive="active" (click)="closeMenu()">Projets</a>
        <a routerLink="/technologies" routerLinkActive="active" (click)="closeMenu()">Technologies</a>
        <a routerLink="/talks" routerLinkActive="active" (click)="closeMenu()">Talks</a>
        <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer>© {{ year }} · Maxime Guyaux</footer>
  `,
})
export class AppComponent {
  year = new Date().getFullYear();
  isDarkMode = false;
  menuOpen = false;

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      this.isDarkMode = saved === 'dark';
      this.applyTheme();
    } else {
      this.isDarkMode = false;
      this.applyTheme();
    }
  }

  closeMenu() { this.menuOpen = false; }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    const root = document.documentElement;
    const theme = this.isDarkMode ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (metaTheme) {
      metaTheme.content = this.isDarkMode ? '#0D0D0D' : '#00BFA6';
    }
  }
}
