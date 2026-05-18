# 🔴 Pokédex

Une application web moderne et interactive pour explorer les Pokémon de la première génération.

![Pokédex](https://img.shields.io/badge/Pok%C3%A9dex-Gen%201-FF0000?style=for-the-badge&logo=pokemon)

## ✨ Fonctionnalités

- 🔍 **Recherche avancée** : Trouvez facilement vos Pokémon par nom
- 🏷️ **Filtrage par type** : Filtrez les Pokémon selon leur type (Feu, Eau, Plante, etc.)
- 📱 **Interface responsive** : Optimisée pour tous les appareils (mobile, tablette, desktop)
- 🎨 **Design moderne** : Interface élégante avec des couleurs thématiques par type
- ⚡ **Performance optimisée** : Chargement rapide avec mise en cache intelligente
- 📊 **Informations détaillées** : Statistiques, capacités, taille, poids et descriptions
- 🖼️ **Images haute qualité** : Artworks officiels des Pokémon

## 🚀 Démo

L'application affiche les **151 Pokémon de la première génération** avec :
- Cartes interactives avec effet de survol
- Modal détaillé au clic sur une carte
- Compteur en temps réel des résultats filtrés
- Gestion des états de chargement et d'erreur

## 🛠️ Technologies utilisées

- **Framework** : [Next.js 15](https://nextjs.org/) avec Turbopack
- **Frontend** : [React 19](https://react.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestion d'état** : [TanStack Query (React Query)](https://tanstack.com/query)
- **API** : [PokéAPI](https://pokeapi.co/)
- **Persistance** : IndexedDB via idb-keyval
- **Optimisation d'images** : Next.js Image

## 📦 Installation

### Prérequis

- [Bun](https://bun.sh/) (recommandé) ou Node.js 18+

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone <votre-repo-url>
   cd pokedex
   ```

2. **Installer les dépendances**
   ```bash
   bun install
   # ou avec npm
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   bun dev
   # ou avec npm
   npm run dev
   ```

4. **Ouvrir l'application**
   
   Rendez-vous sur [http://localhost:3000](http://localhost:3000)

## 📝 Scripts disponibles

```bash
# Développement avec Turbopack
bun dev

# Build de production
bun run build

# Démarrer en production
bun start

# Linter
bun run lint
```

## 🏗️ Structure du projet

```
src/
├── app/                 # Pages Next.js (App Router)
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Page d'accueil
│   └── globals.css     # Styles globaux
├── components/         # Composants React réutilisables
│   ├── PokemonCard.tsx # Carte d'affichage d'un Pokémon
│   ├── PokemonModal.tsx# Modal de détails d'un Pokémon
│   ├── SearchBar.tsx   # Barre de recherche
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── hooks/              # Hooks personnalisés
│   └── usePokemon.ts   # Hooks pour la gestion des données
├── lib/                # Utilitaires et API
│   └── api.ts          # Client API PokéAPI
├── providers/          # Providers React
│   └── QueryProvider.tsx
├── theme/              # Configuration du thème
│   ├── colors.ts       # Couleurs par type de Pokémon
│   └── index.ts
└── types/              # Définitions TypeScript
    └── pokemon.ts      # Types pour les données Pokémon
```

## 🎯 Fonctionnalités détaillées

### Recherche et filtrage
- **Recherche par nom** : Insensible à la casse, recherche en temps réel
- **Filtrage par type** : Dropdown avec tous les types disponibles
- **Compteur dynamique** : Affichage du nombre de résultats

### Cartes Pokémon
- **Design adaptatif** : Couleur de fond selon le type principal
- **Animations fluides** : Effets de survol et transitions
- **Chargement progressif** : Spinner pendant le chargement des images
- **Informations essentielles** : Nom, numéro, types

### Modal de détails
- **Informations complètes** :
  - Description (en français si disponible, sinon en anglais)
  - Statistiques avec barres de progression animées
  - Capacités
  - Taille et poids (converties en mètres et kilogrammes)
- **Design immersif** : Couleurs thématiques selon le type

### Performance et UX
- **Mise en cache intelligente** : Données persistées dans IndexedDB
- **Chargement optimisé** : Requêtes en batch pour de meilleures performances
- **Gestion d'erreur** : Messages d'erreur utilisateur-friendly
- **États de chargement** : Spinners et feedback visuel

## 🎨 Thème et design

L'application utilise un système de couleurs basé sur les types de Pokémon :

- **Feu** : Rouge-orange
- **Eau** : Bleu
- **Plante** : Vert
- **Électrik** : Jaune
- **Psy** : Rose
- **Glace** : Bleu clair
- **Dragon** : Violet
- **Ténèbres** : Noir
- **Combat** : Rouge foncé
- *Et plus...*

## 📊 API et données

L'application utilise la [PokéAPI](https://pokeapi.co/) qui fournit :
- Liste complète des Pokémon
- Données détaillées (stats, types, capacités)
- Images officielles haute résolution
- Descriptions en plusieurs langues
- Informations d'espèces

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Déploiement automatique depuis GitHub
# Connecter votre repo à Vercel
```

### Build manuel
```bash
bun run build
bun start
```

## 🙏 Remerciements

- [PokéAPI](https://pokeapi.co/) pour les données complètes sur les Pokémon
- [Next.js](https://nextjs.org/) pour le framework React
- [Tailwind CSS](https://tailwindcss.com/) pour le système de design
- [TanStack Query](https://tanstack.com/query) pour la gestion des données

---

<div align="center">
  Fait avec ❤️ pour les fans de Pokémon
</div>
