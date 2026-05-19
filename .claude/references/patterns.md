# Patterns Code — Exemples complets copiables

---

## Pattern 1 : ApiClient maison

```typescript
// services/api/client.ts
import { useAuthStore } from "@/stores/auth.store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = RequestInit & { auth?: boolean; timeout?: number };

export async function api<T>(path: string, init: Options = {}): Promise<T> {
  const { auth = true, timeout = 15_000, headers, ...rest } = init;
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
      throw new ApiError(
        body.message ?? res.statusText,
        res.status,
        body.code,
      );
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}
```

---

## Pattern 2 : Service par domaine avec Zod

```typescript
// types/user.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// services/api/user.ts
import { api } from "./client";
import { UserSchema, type User } from "@/types/user";

export const UserService = {
  getMe: async (): Promise<User> => {
    const data = await api<unknown>("/users/me");
    return UserSchema.parse(data);
  },

  updateProfile: async (payload: { name?: string; avatarUrl?: string }): Promise<User> => {
    const data = await api<unknown>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return UserSchema.parse(data);
  },

  deleteAccount: () =>
    api<void>("/users/me", { method: "DELETE" }),
};
```

---

## Pattern 3 : Hook de feature complet

```typescript
// lib/validations.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
});

// services/api/auth.ts
import { api } from "./client";
import { UserSchema, type User } from "@/types/user";
import { z } from "zod";

const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const AuthService = {
  login: async (body: { email: string; password: string }) => {
    const data = await api<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      auth: false,
    });
    return AuthResponseSchema.parse(data);
  },

  logout: () => api<void>("/auth/logout", { method: "POST" }),
};

// features/auth/useLogin.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AuthService } from "@/services/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { loginSchema } from "@/lib/validations";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const validation = loginSchema.safeParse({ email, password });
  const validationError =
    touched && !validation.success
      ? validation.error.issues[0].message
      : null;

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: ({ user, accessToken }) => {
      setUser(user);
      setToken(accessToken);
      router.replace("/home");
    },
  });

  const submit = () => {
    setTouched(true);
    if (validation.success) {
      mutation.mutate({ email, password });
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    onBlur: () => setTouched(true),
    validationError,
    submit,
    isPending: mutation.isPending,
    serverError: mutation.error?.message ?? null,
  };
}
```

---

## Pattern 4 : Écran qui consomme un hook de feature

```typescript
// app/(public)/login.tsx
import { useLogin } from "@/features/auth";
import { Screen } from "@/components/layout/Screen";
import { EmailField } from "@/components/forms/EmailField";
import { PasswordField } from "@/components/forms/PasswordField";
import { Button } from "@/components/Button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation("auth");
  const f = useLogin();

  return (
    <Screen title={t("login.title")}>
      <EmailField
        value={f.email}
        onChangeText={f.setEmail}
        onBlur={f.onBlur}
        error={f.validationError ?? undefined}
        placeholder={t("login.emailPlaceholder")}
      />

      <PasswordField
        value={f.password}
        onChangeText={f.setPassword}
      />

      {f.serverError && <ErrorState message={f.serverError} />}

      <Button
        title={t("login.submit")}
        disabled={!!f.validationError || f.isPending}
        loading={f.isPending}
        onPress={f.submit}
      />
    </Screen>
  );
}
```

---

## Pattern 5 : Hook de query (lecture de données)

```typescript
// features/profile/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/api/user";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => UserService.getById(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Utilisation dans un écran
export default function ProfileScreen() {
  const { data: user, isLoading, error } = useUserProfile(userId);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState message={error.message} />;
  if (!user) return null;

  return <ProfileView user={user} />;
}
```

---

## Pattern 6 : Formulaire avec Zod (sans react-hook-form)

```typescript
// Pour formulaires simples (≤ 3 champs)
const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court"),
});

export function useContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const result = contactSchema.safeParse(fields);

  const getError = (field: keyof typeof fields) => {
    if (!touched[field] || result.success) return null;
    const issue = result.error.issues.find(i => i.path[0] === field);
    return issue?.message ?? null;
  };

  const setField = (field: keyof typeof fields) => (value: string) =>
    setFields(prev => ({ ...prev, [field]: value }));

  const touch = (field: string) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  return {
    fields,
    setField,
    touch,
    getError,
    isValid: result.success,
  };
}
```

---

## Pattern 7 : Zustand store avec persistence

```typescript
// stores/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@/types/user";

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
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Ne jamais persister le token dans AsyncStorage en prod
      // Utiliser expo-secure-store pour les tokens sensibles
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

---

## Pattern 8 : MSW mock pour les tests

```typescript
// __tests__/mocks/handlers/auth.ts
import { http, HttpResponse } from "msw";

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    if (body.email === "test@example.com" && body.password === "password123") {
      return HttpResponse.json({
        user: { id: "1", name: "Test User", email: body.email, createdAt: new Date().toISOString() },
        accessToken: "mock-token",
        refreshToken: "mock-refresh",
      });
    }

    return HttpResponse.json({ message: "Identifiants incorrects" }, { status: 401 });
  }),
];

// Test du hook
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useLogin } from "@/features/auth";

test("login réussi redirige vers /home", async () => {
  const { result } = renderHook(() => useLogin());

  act(() => {
    result.current.setEmail("test@example.com");
    result.current.setPassword("password123");
  });

  act(() => {
    result.current.submit();
  });

  await waitFor(() => {
    expect(mockRouter.replace).toHaveBeenCalledWith("/home");
  });
});
```

---

## Pattern 9 : Composition root (app/_layout.tsx complet)

```typescript
// app/_layout.tsx
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { ThemeProvider } from "@/styles/theme";
import { NetworkProvider } from "@/stores/network.store";
import { OfflineBanner } from "@/components/feedback/OfflineBanner";
import { Toaster } from "@/components/feedback/Toast";
import i18n from "@/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      retry: 2,
      staleTime: 30_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

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

---

## Pattern 10 : index.ts barrel d'une feature

```typescript
// features/auth/index.ts
// Point d'entrée unique — tout le code externe importe depuis @/features/auth
export { useLogin } from "./useLogin";
export { useSignup } from "./useSignup";
export { useLogout } from "./useLogout";
export type { LoginFormValues } from "./auth.types";

// Usage dans l'app :
// import { useLogin, useLogout } from "@/features/auth";
// JAMAIS : import { useLogin } from "@/features/auth/useLogin";
```
