# Dashboard HTB : Suivi des suppressions de fonctions

> Outil de pilotage interactif développé dans le cadre du projet **Départ HTB** pour suivre en temps réel l'avancement des suppressions de fonctions logicielles embarquées.

** Accès au dashboard : (https://dashboardhtb.netlify.app/)**

---

##  Objectif

Remplacer un suivi Excel statique par une interface web interactive, partageable et mise à jour en temps réel entre les membres de l'équipe projet.

Chaque personne qui ouvre le lien voit exactement le même état du projet, les mêmes coches, le même historique.

---

##  Fonctionnalités

-  **Suivi par étape** : 8 étapes par fonction (Matlab → Mesure CPU sur prot), cochables individuellement
-  **Temps réel** : toute modification est visible instantanément par tous les utilisateurs connectés
-  **Statuts par fonction** : Supprimée / En cours / Candidate à la suppression / Présente / Intouchable
-  **Cartographie des poids** : graphique d'impact automatique calculé depuis les mesures techniques
-  **Historique horodaté** : chaque modification enregistre la date, l'heure, l'action et un commentaire
-  **Export historique** : exportable en `.txt`
-  **KPIs automatiques** : progression basée uniquement sur les fonctions actives (En cours + Candidates)
-  **Packs de mesures ajoutables** : le graphique se met à jour automatiquement

---

##  Architecture
###

| Composant | Technologie | Rôle |
|---|---|---|
| Interface | HTML / CSS / JavaScript | Frontend, zéro framework |
| Graphiques | Chart.js 4.4.1 | Cartographie des poids |
| Base de données | Firebase Realtime Database | Stockage partagé en temps réel |
| Hébergement | Netlify | Mise en ligne du dashboard |

---

##  Lancer le projet en local

### Prérequis
- [VS Code](https://code.visualstudio.com/)
- Extension **Live Server** (dans VS Code → Extensions)

### Étapes
```bash
# 1. Cloner le repo
git clone https://github.com/celia-mlx/dashboard-htb.git
# 2. Ouvrir le dossier dans VS Code
cd dashboard-htb
# 3. Clic droit sur index.html → Open with Live Server
```
>  Chart.js doit être présent localement (`chart.js` dans le dossier racine).
>  Si le fichier est absent, télécharger depuis :
> `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js`
> et renommer `chart.js`.

---

## Configuration Firebase

Le dashboard utilise **Firebase Realtime Database** pour synchroniser les données entre utilisateurs.

La configuration Firebase est dans `script.js` :

```js
const firebaseConfig = {
apiKey: "...",
authDomain: "...",
databaseURL: "...",
projectId: "...",
storageBucket: "...",
messagingSenderId: "...",
appId: "..."
};
```

>  Ne jamais committer une clé API publique dans un repo public.
> Pour un repo public, utiliser des variables d'environnement ou restreindre les règles Firebase.

### Règles Firebase (mode test)

```json
{
"rules": {
".read": true,
".write": true
}
}
```

---

##  Sécurité & Confidentialité

| Point | Statut actuel | Recommandation |
|---|---|---|
| Données hébergées | Firebase (Google Cloud) | Serveur interne SCLE à terme |
| Authentification | Aucune (accès par lien) | Firebase Auth à moyen terme |
| Règles d'accès | Ouvertes (test) | Restreindre par email |
| Réseau | Internet public | Intranet SCLE à terme |

---

##  Évolutions prévues

- [ ] Authentification utilisateur (attribution des modifications)
- [ ] Filtres par famille de fonction
- [ ] Export PDF du rapport de réunion
- [ ] Migration vers serveur interne SCLE
- [ ] Déploiement multi-projets

---

##  Responsable

**MARLEIX Célia**
Projet Départ HTB : Stage ingénierie

---

##  Licence

Usage interne : Projet SCLE. Non destiné à une diffusion publique.
