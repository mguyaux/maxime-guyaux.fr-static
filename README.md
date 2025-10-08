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
Ce projet utilise `angular-cli-ghpages`.

1. Assurez-vous d'avoir les droits push sur le dépôt.
2. Déployez via:
   ```bash
   npm run deploy
   ```
   Cette commande construit l'app et publie le contenu dans la branche `gh-pages`.
3. Dans les paramètres GitHub du dépôt: Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` / `/ (root)`

Après quelques minutes, votre site sera disponible à l'adresse:
```
https://<votre-utilisateur>.github.io/maxime-guyaux.fr-static/
```

### Astuces
- Si vous renommez le dépôt, mettez à jour le `base-href` dans:
  - `package.json` (scripts `build` et `deploy`)
  - `angular.json` (section `deploy` → `baseHref` et éventuellement `assets` → `404.html`)
- Pour un domaine personnalisé, créez un enregistrement DNS (CNAME) vers `<votre-utilisateur>.github.io` et ajoutez un fichier `CNAME` à la racine de la branche `gh-pages`.

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
