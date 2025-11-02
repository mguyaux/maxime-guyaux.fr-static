# Bienvenue sur la section Ressources

Cette section regroupe des articles et notes au format Markdown. Les fichiers sont listés dans `resources.json` et rendus en HTML au chargement de la page.

## Comment ça marche ?

- Un index JSON référence chaque article avec un `title`, un `summary`, une `date` et le nom du `file`.
- Le composant Angular télécharge le Markdown et l’affiche dynamiquement.

```ts
// Exemple de structure JSON
[
  { "title": "Mon article", "summary": "Résumé court", "date": "2025-01-01", "file": "mon-article.md" }
]
```

Bonnes lectures !
