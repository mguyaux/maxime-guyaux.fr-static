# Composants standalone Angular

Depuis Angular 14, il est possible de créer des composants « standalone » sans module NgModule. Cela simplifie l’architecture et le chargement.

## Avantages

- Moins de fichiers et de boilerplate
- Import explicite des dépendances au niveau du composant
- Meilleure isolation et réutilisabilité

## Exemple

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hello-standalone',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Hello Standalone</h1>`
})
export class HelloStandalone {}
```

## Conseils

- Utilisez `provideRouter` et `provideHttpClient` dans `main.ts`.
- Préférez les composants standalone pour les nouvelles pages.
