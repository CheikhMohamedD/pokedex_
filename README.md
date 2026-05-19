# Welcome to Pokedex_

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Project setup

- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for building modern websites and applications.
- [React Native](https://reactnative.dev/): A framework for building native mobile apps using React.

## Project structure

```
app/                    ← Dossier de routage (Expo Router)
  _layout.tsx           ← Composition Root (Providers : QueryClient, Theme, etc.)
  index.tsx             ← Point d'entrée de l'UI (utilise la feature pokedex)

features/               ← Logique métier et UI par "use-case"
  pokedex/
    index.ts            ← Point d'entrée unique de la feature
    PokedexList.tsx     ← Composant UI de la liste
    PokemonCard.tsx     ← Composant UI de la carte
    usePokedex.ts       ← Hook métier (Logique)
    pokedex.types.ts    ← Schémas Zod et Types pour cette feature

services/               ← I/O uniquement (Aucune UI, aucun hook)
  api/
    client.ts           ← Wrapper fetch maison (~50 lignes)
    pokeapi.ts          ← Service spécifique à PokeAPI (dépend du client)
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
