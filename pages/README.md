# Pages

## Conventions

Every page is a folder with 4 files:

```
pages/my-page/
├── index.js      # Page logic (Page() constructor)
├── index.json    # Component declarations
├── index.wxml    # Template
└── index.wxss    # Styles (can be empty)
```

### Required Patterns

1. **Register in `app.json`** — Every page must be in the `pages` array
2. **Await `initPromise`** — If the page needs app data:
   ```javascript
   async onLoad() {
     await app.globalData.initPromise;
   }
   ```
3. **Cleanup in `onUnload`** — Unsubscribe from EventBus, clear timers
4. **Declare components** — Register used components in `index.json`

## Current Pages

| Page | Route | Purpose |
|------|-------|---------|
| Accueil | `pages/index/index` | Tableau de bord, montants estimés, prochaines échéances |
| Bénéficiaires | `pages/employees/index` | Recherche, modification, suspension et programmation d'un bénéficiaire |
| Formulaire bénéficiaire | `pages/employee-form/index` | Ajout ou modification d'un bénéficiaire |
| Programmer | `pages/schedule/index` | Bénéficiaire, montant, fréquence et dates |
| Confirmation | `pages/confirmation/index` | Récapitulatif, accord et enregistrement simulé |
| Calendrier | `pages/calendar/index` | Échéances par mois et par jour |
| Historique | `pages/history/index` | Opérations fictives et filtres de statut |
| Détail paiement | `pages/payment-detail/index` | Détail d'une opération fictive |
| Paiements à vérifier | `pages/failures/index` | Vérification et nouvelle tentative simulées |
| [Demo](demo/README.md) | `pages/demo/index` | Component showcase. Demonstrates stepper, modal, WXS, Behavior, EventBus helpers |

Les neuf pages AutoPay possèdent chacune leur dossier et les fichiers `index.js`, `index.json`, `index.wxml` et `index.wxss`. Le stockage et les calculs communs sont dans `utils/autopay/`.

## Adding a New Page

See [Recipes: Adding a New Page](../docs/14-recipes.md#adding-a-new-page) for the complete template.

## See Also

- [Mini-Program Concepts: Page Lifecycle](../docs/01-mini-program-concepts.md#page-lifecycle)
- [Navigation Guide](../docs/12-navigation-guide.md)
