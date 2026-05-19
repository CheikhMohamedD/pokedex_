# Checklist PR — React Native Pragmatique

À passer avant chaque "Open pull request". Si une case ne peut pas être cochée, mentionnez-le dans la description avec la raison.

---

## ✅ Qualité de code

- [ ] Aucune string en dur dans le JSX → utiliser `t("namespace:clé")`
- [ ] Aucun `console.log` oublié
- [ ] Aucun `any` dans le code TypeScript
- [ ] Aucun `// @ts-ignore` sans commentaire explicatif
- [ ] Tous les imports utilisent l'alias `@/` (pas de chemins relatifs longs `../../..`)
- [ ] Le linter passe en local (`npx eslint .`)
- [ ] Le typecheck TypeScript passe en local (`npx tsc --noEmit`)

## ✅ Architecture

- [ ] Aucun `fetch` direct depuis une feature → passer par `services/`
- [ ] Les hooks de feature ne dépassent pas ~80 lignes
- [ ] Les composants ne contiennent pas de logique métier (validation, règles, calculs)
- [ ] Les services ne contiennent pas de JSX
- [ ] Les imports respectent le sens des couches (jamais un service → une feature)
- [ ] Chaque nouvelle feature a son `index.ts` barrel

## ✅ Sécurité

- [ ] Aucun secret, token ou PII en clair dans les logs
- [ ] Validation Zod sur tous les inputs utilisateur **ET** sorties API
- [ ] Aucun stockage de donnée sensible en stockage non chiffré (AsyncStorage)
- [ ] Tokens stockés via `expo-secure-store` (Keychain/Keystore)
- [ ] Pas de désactivation du cert pinning, même "juste pour tester"

## ✅ UX & Performance

- [ ] Loading state visible sur tout appel async (bouton désactivé, spinner...)
- [ ] Tous les messages d'erreur sont traduits (locale par défaut au minimum)
- [ ] Le composant fonctionne sans réseau **OU** bloque proprement avec `OfflineBanner`
- [ ] Hit targets ≥ 44pt sur tous les éléments tappables
- [ ] Testé sur un device Android low-end (ou émulateur 1 Go RAM)
- [ ] Aucun défilement bloqué sous le clavier
- [ ] `FlatList` avec `keyExtractor` défini
- [ ] Images optimisées (pas de PNG 4K dans les assets)

## ✅ Tests

- [ ] Toute logique métier nouvelle a au moins 1 test unitaire
- [ ] Tout nouveau composant critique (input, keypad, flow gate) a un test
- [ ] Les tests passent en local
- [ ] Les mocks MSW sont mis à jour si l'API change

## ✅ Process

- [ ] La PR fait moins de **400 lignes** de diff (sinon on découpe)
- [ ] Le titre suit Conventional Commits : `feat:`, `fix:`, `chore:`, `refactor:`, `test:`
- [ ] L'ID du ticket lié est dans la description
- [ ] Au moins une capture d'écran si la PR change l'UI
- [ ] `git diff --staged` relu avant le commit

---

## Taille de PR recommandée

| Type | Lignes max | Stratégie |
|------|-----------|-----------|
| Hotfix | ~50 | Une seule PR |
| Bug fix | ~150 | Une seule PR |
| Feature simple | ~300 | Une seule PR |
| Feature complexe | ~400 | Découper : PR hook / PR composant / PR tests |
| Refactoring | ~400 | Découper par domaine |

---

## Conventional Commits — Référence rapide

```
feat: ajouter la page de paiement
fix: corriger le crash sur Android < 12
chore: mettre à jour les dépendances
refactor: extraire useCart depuis CartScreen
test: ajouter tests pour useLogin
docs: mettre à jour le README
perf: optimiser FlatList du fil d'actualité
```

---

## Pre-commit hook recommandé

Configurer avec **Lefthook** ou **Husky** :

```yaml
# lefthook.yml
pre-commit:
  commands:
    lint:
      run: npx eslint {staged_files}
    typecheck:
      run: npx tsc --noEmit
```

Installation :
```bash
npx lefthook install
```

Vous ne pousserez plus jamais un code qui ne compile pas.
