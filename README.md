# maxime-guyaux.fr (Angular)

Site personnel (frontend only) construit avec Angular, prévu pour être déployé sur GitHub Pages.

## Prérequis
- Node.js 18+ recommandé
- npm 9+

## Installation
```bash
npm install
```

## Développement local
```bash
npm start
```
Ouvre http://localhost:4200 avec rechargement à chaud.

## Build de production
```bash
npm run build
```
Le build est généré dans `dist/maxime-guyaux-fr/` avec `base-href` configuré pour GitHub Pages (`/maxime-guyaux.fr-static/`).

## Déploiement sur GitHub Pages
Le déploiement est géré par GitHub Actions.

- Un workflow est défini dans `.github/workflows/deploy-pages.yml`.
- Il se déclenche à chaque `push` sur la branche `main` et sur déclenchement manuel.
- Le workflow construit l'application (`npm ci && npm run build`) puis publie le dossier `dist/maxime-guyaux-fr` sur GitHub Pages.

Configuration côté GitHub (à faire une seule fois):
1. Allez dans Settings → Pages
2. Build and deployment → Source: `GitHub Actions`

URL de prod:
```
https://<votre-utilisateur>.github.io/maxime-guyaux.fr-static/
```

### Astuces
- Si vous renommez le dépôt ou changez l'URL du projet, mettez à jour le `base-href` dans:
  - `package.json` (script `build`)
- Pour un domaine personnalisé, configurez un enregistrement DNS (CNAME) vers `<votre-utilisateur>.github.io` et ajoutez un fichier `CNAME` au root de GitHub Pages via l'action (ex: étape dédiée dans le workflow si nécessaire).

## Structure minimale
- `src/index.html`, `src/main.ts`, `src/app.component.ts` (standalone)
- `src/styles.css`
- `src/404.html` (redirection SPA pour GitHub Pages)
- `src/favicon.svg`
- `src/assets/` (dossier statique)

## Licence
Ce dépôt est privé/personal. Ajoutez une licence si nécessaire.


## CV
Placez votre fichier PDF de CV à l'emplacement suivant pour activer le bouton de téléchargement de la page "Présentation" :

```
src/assets/cv/Maxime_Guyaux_CV.pdf
```

Lors du build, ce fichier sera copié dans `assets/cv/` et accessible via `assets/cv/Maxime_Guyaux_CV.pdf`.
