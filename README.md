# Max it AutoPay

Mini-application TCMPP en JavaScript, WXML et WXSS pour organiser des paiements récurrents. Le parcours est conçu pour une démonstration mobile : bénéficiaires, échéances, calendrier, historique et vérification des incidents.

> **Mode démonstration :** les bénéficiaires, paiements, références et résultats sont fictifs. Aucune transaction ni aucun transfert réel n'est exécuté.

## Lancer l'application

1. Ouvrir le dossier du projet dans TCMPP Developer Tools.
2. Compiler et prévisualiser sur simulateur ou appareil.
3. Utiliser les quatre entrées de navigation en bas de l'écran : Accueil, Employés, Calendrier et Historique.

Les données de démonstration sont conservées localement. Utiliser le stockage de la mini-application pour réinitialiser les données après une présentation.

## Parcours de démonstration

1. Le tableau de bord présente le budget récurrent estimé, les bénéficiaires actifs et les prochaines échéances.
2. Depuis **Programmer un paiement**, choisir un bénéficiaire actif, un montant, une fréquence et des dates.
3. Vérifier le récapitulatif et accepter explicitement le mode démonstration.
4. Consulter l'échéance créée dans le calendrier, puis l'historique et le détail d'une opération.
5. Dans **À vérifier**, vérifier d'abord le paiement échoué. La nouvelle tentative disponible ensuite est elle aussi simulée.

L'application permet également d'ajouter, modifier, rechercher et suspendre des bénéficiaires. Elle vérifie les champs obligatoires, le numéro, le montant et l'ordre des dates.

## Organisation

- `app.js` : cycle de vie TCMPP, état global, réseau et plugin natif de profil.
- `pages/index/` : accueil et tableau de bord.
- `pages/employees/` : liste et recherche des bénéficiaires.
- `pages/employee-form/` : ajout et modification d'un bénéficiaire.
- `pages/schedule/` : détails de la programmation récurrente.
- `pages/confirmation/` : récapitulatif et activation de démonstration.
- `pages/calendar/` : échéances par mois et par jour.
- `pages/history/` : historique filtrable.
- `pages/payment-detail/` : détail d'une opération.
- `pages/failures/` : vérification et nouvelle tentative simulée.
- `pages/demo/` : page de démonstration des composants du socle.
- `components/ui/` : composants d'interface réutilisables du projet.
- `utils/event/` : EventBus pour événements et état partagé.
- `utils/autopay/` : persistance des données fictives, calculs d'échéance et navigation partagée.
- `utils/apis/` : client HTTP, authentification OAuth2, wrappers de plugins natifs et service backend d'exemple.
- `utils/json-sculpt/` : transformation déclarative des données.
- `ecrans/` : maquettes UI de référence du produit.
- `docs/` : guides du runtime, de l'architecture et des utilitaires.

Les données AutoPay de démonstration sont stockées sous la clé locale `maxit_autopay_demo_v1`. Elles sont séparées des appels réseau et peuvent être remplacées par un service backend adapté.

## Limites d'intégration

- Le parcours UI n'appelle aucune API de transfert. Il ne prouve ni ne déclenche un paiement réel.
- L'API backend n'est pas configurée : `utils/config.js` manque et les endpoints dans `utils/apis/index.js` sont des exemples.
- Une intégration réelle doit s'appuyer sur les API officiellement autorisées, une exécution sécurisée côté serveur, l'idempotence, la vérification de statut et la réconciliation des paiements. Aucun secret ne doit être placé dans la mini-application.
- Les couleurs, pictogrammes et initiales sont une interprétation provisoire des maquettes. Aucun logo officiel n'a été ajouté au projet.

## Documentation du socle

Consulter `docs/02-project-architecture.md` pour l'architecture, `docs/04-app-lifecycle.md` pour le démarrage, `docs/05-eventbus-guide.md` pour l'état partagé et `docs/06-api-layer.md` pour la couche réseau existante.
