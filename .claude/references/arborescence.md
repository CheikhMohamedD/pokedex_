# Arborescence détaillée — React Native Pragmatique

## Chaque dossier et ses règles

---

## `app/` — Le routeur comme colonne vertébrale

L'arborescence de navigation. Les layouts servent de **composition root**.

```
app/
  _layout.tsx              ← root layout (providers globaux)
  (public)/
    _layout.tsx            ← garde : redirige si déjà connecté
    login.tsx              → /login
    signup.tsx             → /signup
    welcome.tsx            → /welcome
  (protected)/
    _layout.tsx            ← garde : redirige si non connecté
    home.tsx               → /home
    profile/
      [id].tsx             → /profile/123
    settings.tsx           → /settings
```

**Les groupes de routes** (dossiers entre parenthèses) permettent d'appliquer un layout commun sans apparaître dans l'URL.

**Guard d'authentification :**
```typescript
// app/(protected)/_layout.tsx
export default function ProtectedLayout() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

**Navigation typée :** Activer `experiments.typedRoutes` dans `app.json` pour l'autocomplétion sur `router.push()`.

**Règle :** Un layout ne contient pas de logique métier. Il monte des Providers, pose des Guards, affiche des éléments persistants (Toast, OfflineBanner).

---

## `components/` — UI dumb

Composants réutilisables **sans connaissance métier**. Règle absolue : aucun import depuis `features/` ou `services/`.

```
components/
  Button.tsx
  Avatar.tsx
  Card.tsx
  forms/
    TextField.tsx
    EmailField.tsx
    PasswordField.tsx
    SubmitBar.tsx
  feedback/
    Toast.tsx
    Spinner.tsx
    ErrorState.tsx
    ErrorBoundary.tsx
    OfflineBanner.tsx
  layout/
    Screen.tsx             ← SafeArea + Keyboard wrapper standard
    Header.tsx
    Divider.tsx
```

**Contrat d'un bon composant dumb :**
- Props in, JSX out
- Aucun appel API, aucune lecture directe d'un store global
- État local autorisé (focus, animations internes)
- Stylé via les design tokens, pas de couleurs hardcodées

**Exemple :**
```typescript
// components/forms/EmailField.tsx
type Props = {
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  placeholder?: string;
};

export function EmailField({ value, onChangeText, error, placeholder }: Props) {
  return (
    <View className="gap-1">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder={placeholder}
        className="bg-gray-100 rounded-lg px-3 py-3"
      />
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View>
  );
}
```

**Piège :** Ne pas créer `LoginEmailField.tsx` + `SignupEmailField.tsx` qui font la même chose. Un seul `EmailField` avec des props couvre tous les cas.

---

## `features/` — Un dossier = un use-case complet

```
features/
  auth/
    LoginForm.tsx          ← composant spécifique à cette feature
    useLogin.ts            ← hook de feature
    useSignup.ts
    auth.types.ts          ← types spécifiques à la feature
    auth.test.ts
    index.ts               ← point d'entrée unique (barrel)
  cart/
    CartItem.tsx
    CartSummary.tsx
    useCart.ts
    cart.types.ts
    cart.test.ts
    index.ts
  profile/
    ...
```

**Règle du `index.ts` :** Chaque feature expose un seul point d'entrée.
```typescript
// features/auth/index.ts
export { useLogin } from "./useLogin";
export { useSignup } from "./useSignup";
// Le reste du code importe depuis @/features/auth, jamais depuis un fichier interne
```

**Quand créer une feature ?** Dès qu'un use-case demande plus d'un fichier (hook + types, ou hook + composant dédié).

---

## `services/` — I/O uniquement

```
services/
  api/
    client.ts              ← ApiClient maison (~50 lignes)
    user.ts                ← UserService
    auth.ts                ← AuthService
    cart.ts                ← CartService
  native/
    camera.ts              ← accès caméra
    location.ts            ← géolocalisation
    notifications.ts       ← push notifications
  observability/
    logger.ts              ← logging (sans PII)
    sentry.ts              ← error tracking
```

**Règle du service :** Expose des fonctions pures typées à l'extérieur, encapsule tous les détails HTTP à l'intérieur. Le hook qui consomme le service ne sait pas qu'il existe du JSON.

**Un service par domaine, jamais un dieu-service.**

---

## `stores/` — État global avec Zustand

```
stores/
  auth.store.ts            ← user, token, isAuthenticated
  network.store.ts         ← isOnline, isInternetReachable
  ui.store.ts              ← theme, locale
```

**Exemple :**
```typescript
// stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    { name: "auth-storage" }
  )
);
```

**Quoi mettre en store global ?** Uniquement ce qui est partagé entre ≥ 2 features ET ne peut pas être géré par TanStack Query (état serveur → TanStack Query, état UI global → Zustand).

---

## `hooks/` — Hooks transverses

Hooks utilisés par plusieurs features, sans appartenir à aucune.

```
hooks/
  useDebounce.ts
  useLocalStorage.ts
  useKeyboard.ts
  useSafeInsets.ts
  useNetworkStatus.ts
```

**Règle :** Si un hook n'est utilisé que dans une feature, il reste dans `features/<nom>/`. Il monte dans `hooks/` seulement quand ≥ 2 features l'utilisent.

---

## `lib/` — Fonctions pures

Fonctions utilitaires pures, **zéro side-effects**, zéro dépendances vers `features/` ou `services/`.

```
lib/
  validations.ts           ← schémas Zod partagés (loginSchema, emailSchema...)
  formatters.ts            ← formatDate, formatCurrency, formatPhone
  constants.ts             ← constantes applicatives
  utils.ts                 ← helpers génériques
```

**Règle :** Si une fonction fait des side-effects (I/O, natif) → elle va dans `services/`. Si elle est pure et réutilisable → `lib/`. Si elle n'est utilisée que dans une feature → dans le dossier de cette feature.

---

## `styles/` — Design tokens

```
styles/
  theme.ts                 ← couleurs, typographie, espacement
  tokens.ts                ← variables de design system
  ThemeProvider.tsx        ← context + hook useTheme
```

**Règle :** Jamais de couleur hardcodée dans un composant. Toujours via les tokens.

---

## `types/` — DTOs partagés

Types qui transitent entre frontend et backend, utilisés par plusieurs features.

```
types/
  api.ts                   ← types de réponses API génériques
  user.ts                  ← User, UserSchema (Zod)
  common.ts                ← PaginatedResponse<T>, ApiError...
```

**Règle :** Les types spécifiques à une feature restent dans `features/<nom>/<nom>.types.ts`. Seuls les types partagés montent dans `types/`.

---

## `i18n/` — Localisation

```
i18n/
  index.ts                 ← configuration i18next
  locales/
    fr/
      common.json
      auth.json
      errors.json
    en/
      ...
```

**Règle :** Toute string visible par l'utilisateur passe par `t("namespace:clé")`. Aucune string en dur dans le JSX.

---

## `__tests__/` et `e2e/`

```
__tests__/
  setup.ts                 ← configuration Vitest + MSW handlers
  mocks/
    server.ts              ← MSW mock server
    handlers/
      auth.ts
      user.ts

e2e/
  auth.test.ts             ← tests Maestro
  checkout.test.ts
```

**Quoi tester :**
- ✅ Logique (hooks, lib, services)
- ✅ Composants critiques (inputs, keypads, ce qui gate un flow)
- ❌ Composants triviaux (`<Text>Salut</Text>` n'a pas besoin de test)
