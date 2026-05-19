---
name: react-native-architecture
description: >
  Architecture pragmatique React Native inspirée du guide Studio Soro (STD-SORO-2025).
  Utilise ce skill dès qu'un projet React Native est mentionné, ou pour toute question
  sur la structure de fichiers, les hooks de feature, les services API, les composants UI,
  Zod, Zustand, TanStack Query, Expo Router, ou la séparation des concerns en mobile.
  Déclenche aussi pour : "comment organiser mon projet RN", "où mettre mon code", 
  "architecture mobile", "clean code React Native", "feature folder", "colocation",
  "hook useFeature", "ApiClient maison", "composition root", "checklist PR mobile".
---

# Architecture React Native Pragmatique (Studio Soro)

## Vue d'ensemble

Ce skill couvre l'architecture pragmatique React Native : **simple, scalable, feature-driven, router-agnostic**. Elle fonctionne avec Expo Router, React Navigation, ou TanStack Router.

**Règle d'or :** Cherchez le minimum de structure qui rend le code navigable, testable et modifiable sans peur.

---

## 1. Les Cinq Principes

### 1.1 Pragmatique avant tout
Avant d'ajouter une couche, demandez-vous :
1. Est-ce que ça réduit la quantité de code à écrire aujourd'hui ?
2. Est-ce que ça facilite les modifications futures ?
3. Est-ce que ça aide à tester le code ?

→ Si **non aux trois**, c'est de la complexité gratuite. On l'enlève.

### 1.2 Colocation logique
Ce qui change ensemble vit ensemble. Si modifier une feature touche 7 fichiers dans 5 dossiers → arborescence incorrecte.

**Règle :** Un fichier utilisé par une seule feature reste dans cette feature. S'il est utilisé par ≥ 2 features, il remonte dans un dossier partagé. Pas de spéculation "ça pourrait servir un jour".

### 1.3 Separation of Concerns — 3 couches

| Couche | Où ? | Responsabilité | Ce qui n'y est PAS |
|--------|------|-----------------|-------------------|
| UI | `components/`, `app/` | Pixels + saisie utilisateur | Appels API, règles métier |
| Logique | `features/`, `hooks/` | Orchestration, validation, calcul | JSX, connaissance réseau |
| I/O | `services/` | API, stockage, OS | Logique métier, UI |

### 1.4 SOLID version légère

Seuls **SRP** et **DIP** s'appliquent systématiquement en React Native fonctionnel :

- **SRP** : un composant UI change seulement si le design change. Un service change seulement si l'API change. Un hook change seulement si la règle métier change.
- **DIP** : les hooks dépendent d'un service typé (contrat), jamais de `fetch` directement.

OCP, LSP, ISP → appliquer seulement quand un cas concret le justifie.

### 1.5 Type-first avec Zod

TypeScript ment sur les données externes. Zod valide à la frontière (réponse API, input utilisateur, stockage).

```typescript
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>; // une seule source de vérité
```

**Règle Zod :** Toute donnée externe passe par un schéma. Toute donnée interne est typée via `z.infer<typeof schema>`.

---

## 2. L'Arborescence

```
app/                    ← Expo Router (file-based routing)
  _layout.tsx           ← composition root global
  (public)/             ← routes sans authentification
  (protected)/          ← routes avec authentification

components/             ← UI réutilisable, sans connaissance métier
  Button.tsx
  Avatar.tsx
  forms/
  feedback/
  layout/

features/               ← 1 dossier = 1 use-case complet
  auth/
    LoginForm.tsx
    useLogin.ts
    auth.types.ts
    auth.test.ts
    index.ts            ← point d'entrée unique
  cart/
  profile/

services/               ← I/O uniquement
  api/
    client.ts           ← ApiClient maison (~50 lignes)
    user.ts
    auth.ts
  native/
  observability/

stores/                 ← Zustand (état global)
hooks/                  ← hooks transverses
lib/                    ← fonctions pures, zéro side-effects
styles/                 ← tokens de design
types/                  ← DTOs partagés
i18n/                   ← localisation
__tests__/
e2e/
```

**Sens des imports :** toujours vers l'intérieur. Une feature peut importer un service. Un service ne peut **jamais** importer une feature.

→ Pour les détails de chaque dossier : voir `references/arborescence.md`

---

## 3. Les Patterns Code

### 3.1 Composition root via layouts

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <NetworkProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <OfflineBanner />
              <Toaster />
            </NetworkProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}
```

**Ordre des providers (extérieur → intérieur) :**
1. ErrorBoundary → attrape les erreurs de tout
2. I18nProvider → les erreurs en dessous doivent être traduisibles
3. ThemeProvider → avant tout ce qui dessine
4. QueryClientProvider → avant tout ce qui fetch
5. NetworkProvider → règles applicatives globales

### 3.2 ApiClient maison (~50 lignes)

```typescript
// services/api/client.ts
export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

export async function api<T>(path: string, init: Options = {}): Promise<T> {
  const { auth = true, timeout = 15000, headers, ...rest } = init;
  const token = auth ? useAuthStore.getState().accessToken : null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(body.message ?? res.statusText, res.status, body.code);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}
```

**Un service par domaine :**
```typescript
// services/api/user.ts
export const UserService = {
  getMe: async (): Promise<User> => {
    const data = await api<unknown>("/users/me");
    return UserSchema.parse(data); // validation Zod à la frontière
  },
  updateName: (name: string) =>
    api<User>("/users/me", { method: "PATCH", body: JSON.stringify({ name }) }),
};
```

### 3.3 Hook de feature

```typescript
// features/auth/useLogin.ts
export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const router = useRouter();

  const validation = loginSchema.safeParse({ email, password });
  const error = touched && !validation.success
    ? validation.error.issues[0].message : null;

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: () => router.push("/home"),
  });

  return {
    email, setEmail,
    password, setPassword,
    onBlur: () => setTouched(true),
    error,
    submit: () => validation.success && mutation.mutate({ email, password }),
    isPending: mutation.isPending,
    serverError: mutation.error?.message,
  };
}
```

**Règle :** Renvoyez toujours un **objet**, jamais un tuple. Plus lisible à l'ajout de champs.

→ Exemples complets copiables : voir `references/patterns.md`

---

## 4. Checklist PR

→ Liste complète : voir `references/checklist.md`

Points critiques à ne jamais oublier :
- ✅ Aucun `fetch` direct dans une feature (passe par `services/`)
- ✅ Validation Zod sur tous les inputs ET sorties API
- ✅ Loading state visible sur tout appel async
- ✅ Aucun `any` TypeScript sans justification
- ✅ Aucune string en dur dans le JSX (utiliser i18n)
- ✅ Testé sur device Android low-end
- ✅ PR ≤ 400 lignes de diff

---

## 5. FAQ rapide

| Question | Réponse |
|----------|---------|
| Redux vs Zustand ? | Zustand (~1 ko, pas de Provider). Redux pour apps avec état async très complexe. |
| react-hook-form ? | Seulement pour formulaires complexes (field arrays, validations cross-fields). Sinon `useState` + Zod. |
| axios ? | Non. `fetch` natif + wrapper maison 50 lignes. Économise ~30 ko de bundle. |
| Quand extraire dans `components/` ? | Quand utilisé dans ≥ 2 features distinctes. Pas avant. |
| Nommage fichiers ? | Composants : `PascalCase.tsx`. Hooks/utils : `camelCase.ts`. Dossiers : `kebab-case/`. |
| Quoi tester ? | La logique (hooks, lib, services) + composants critiques (inputs, keypads). Pas les `<Text>`. |

---

## 6. Pièges fréquents à éviter

1. **Logique métier dans le composant** → extraire un `useFeatureName()` si > 80 lignes ou `useState` + `useEffect` qui fetch
2. **`fetch` direct dans un hook** → signal rouge, passer par `services/`
3. **Oublier loading/error states** → `isPending` désactive le bouton, `error` s'affiche
4. **Données sensibles en AsyncStorage** → utiliser `expo-secure-store` (Keychain/Keystore)
5. **Strings hardcodées dans JSX** → toujours `t("clé.i18n")`
6. **PR trop grosses** → découper : PR hook / PR composant / PR tests
7. **Ne pas tester sur device low-end** → FlatList sans `keyExtractor`, images non optimisées → crash

---

## Références détaillées

- `references/arborescence.md` — Détail de chaque dossier et ses règles
- `references/patterns.md` — Exemples de code complets et copiables
- `references/checklist.md` — Checklist PR complète

## Stack recommandée

- **Routing** : Expo Router (ou React Navigation, TanStack Router)
- **Fetching async** : TanStack Query
- **Validation** : Zod
- **État global** : Zustand
- **Styles** : NativeWind v4
- **Tests unitaires** : Vitest + Testing Library
- **Mocks API** : MSW
- **Tests E2E** : Maestro
- **Sécurité stockage** : expo-secure-store
