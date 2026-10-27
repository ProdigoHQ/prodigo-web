"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Field from "@/modules/auth/adapters/in/ui/field";
import {
  loginSchema,
  toFieldErrors,
} from "@/modules/auth/schemas/auth-schema";
import { useLoginMutation } from "@/modules/auth/hooks/use-auth";
import { useAuthStore } from "@/modules/auth/stores/auth-store";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [values, setValues] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [success, setSuccess] = useState(false);

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ ...values, remember });
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});

    loginMutation.mutate(parsed.data, {
      onSuccess: (data) => {
        setAuth(data);
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 600);
      },
    });
  }

  const submitting = loginMutation.isPending;

  return (
    <>
      <h1 className="auth-title text-4xl font-bold">Content de vous revoir</h1>
      <p className="auth-subtitle">
        Connectez-vous pour accéder à votre espace.
      </p>

      {loginMutation.isError && (
        <div className="auth-alert auth-alert--error" role="alert">
          <AlertCircle className="h-4 w-4 my-2 flex-shrink-0" />
          {loginMutation.error.message}
        </div>
      )}

      {success && (
        <div className="auth-alert auth-alert--success" role="status">
          <CheckCircle2 className="h-4 w-4 my-2 flex-shrink-0" />
          Connexion réussie. Redirection vers votre tableau de bord...
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <Field
          label="Nom d'utilisateur"
          htmlFor="username"
          error={errors.username}
        >
          <div className="relative">
            <User className="input-icon h-4 w-4" />
            <Input
              id="username"
              autoComplete="username"
              value={values.username}
              onChange={(e) => update("username", e.target.value)}
              className="pl-10"
              placeholder="jfotso"
              disabled={submitting || success}
              aria-invalid={errors.username ? true : undefined}
            />
          </div>
        </Field>

        <Field label="Mot de passe" htmlFor="password" error={errors.password}>
          <div className="relative">
            <Lock className="input-icon h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => update("password", e.target.value)}
              className="pl-10 pr-10"
              placeholder="••••••••"
              disabled={submitting || success}
              aria-invalid={errors.password ? true : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="input-toggle"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between pt-1">
          <label
            className="auth-remember"
            onClick={() => setRemember((r) => !r)}
          >
            <Checkbox
              checked={remember}
              onCheckedChange={setRemember}
              onClick={(event) => event.stopPropagation()}
              aria-label="Se souvenir de moi"
            />
            Se souvenir de moi
          </label>
          <button
            type="button"
            className="auth-link"
            onClick={() => router.push("/forgot-password")}
          >
            Mot de passe oublié ?
          </button>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || success}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connexion...
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ?{" "}
        <button
          type="button"
          className="auth-link"
          onClick={() => router.push("/register")}
        >
          Créer un compte
        </button>
      </p>
    </>
  );
}
