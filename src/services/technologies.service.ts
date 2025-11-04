import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Raw JSON as stored in src/assets/technos.json
interface TechnologyRaw {
  'Nom': string;
  'Description': string;
  'Niveau': number; // relative level (e.g., 1..5)
}

export interface Technology {
  nom: string;
  description: string;
  niveau: number;
}

@Injectable({ providedIn: 'root' })
export class TechnologiesService {
  constructor(private http: HttpClient) {}

  getTechnologies(): Observable<Technology[]> {
    return this.http.get<TechnologyRaw[]>('assets/technos.json').pipe(
      map(arr => arr.map(t => ({
        nom: t['Nom'],
        description: t['Description'],
        niveau: t['Niveau']
      }))),
      map(techs => techs.sort((a, b) => b.niveau - a.niveau))
    );
  }
}
