import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// Raw JSON shape stored in projects.json (French keys)
interface ProjectRaw {
  'Titre': string;
  'Client final': string;
  'Via'?: string | null;
  'DescriptionCourte': string;
  'Description': string;
  'Durée'?: string; // e.g., "3 mois", optional for backward compatibility
  'Technologies': string[];
  imageFile: string;
}

// Normalized model used throughout the app (camelCase)
export interface Project {
  titre: string;
  clientFinal: string;
  via?: string | null;
  descriptionCourte: string;
  description: string;
  duree?: string | null;
  technologies: string[];
  imageFile: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<ProjectRaw[]>('assets/projects.json').pipe(
      map((arr) => this.normalizeWithUniqueSlugs(arr))
    );
  }

  getBySlug(slug: string): Observable<Project | undefined> {
    return this.getProjects().pipe(
      map((list) => list.find((p) => p.slug === slug))
    );
  }

  private normalizeWithUniqueSlugs(arr: ProjectRaw[]): Project[] {
    const used = new Set<string>();
    return arr.map((p) => {
      const base = this.slugify(p['Titre']);
      let slug = base || 'projet';
      let n = 2;
      while (used.has(slug)) {
        slug = `${base}-${n++}`;
      }
      used.add(slug);
      return {
        titre: p['Titre'],
        clientFinal: p['Client final'],
        via: p['Via'] ?? null,
        descriptionCourte: p['DescriptionCourte'],
        description: p['Description'],
        duree: p['Durée'] ?? null,
        technologies: p['Technologies'],
        imageFile: p.imageFile,
        slug,
      };
    });
  }

  private slugify(value: string): string {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
