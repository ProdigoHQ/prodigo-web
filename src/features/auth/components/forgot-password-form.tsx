"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/modules/auth/components/field";
import { forgotPasswordSchema, toFieldErrors } from "@/modules/auth/schemas/auth-schema";
import { useForgotPasswordMutation } from "@/modules/auth/hooks/use-auth";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  function update(value: string) {
    setEmail(value);
    if (error) setError(undefined);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(toFieldErrors(parsed.error).email);
      return;
    }
    setError(undefined);

    forgotPasswordMutation.mutate(parsed.data, {
      onSuccess: () => setSent(true),
    });
  }

  const submitting = forgotPasswordMutation.isPending;

  if (sent) {
    return (
      <div>
        <div className="success-icon">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="success-title text-4xl font-bold">
          Vérifiez votre boîte mail
        </h1>
        <p className="success-body">
          Si un compte est associé à{" "}
          <span className="success-strong">{email}</span>, vous recevrez un lien
          pour réinitialiser votre mot de passe.
        </p>
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => router.push("/login")}
        >
          Retour à la connexion
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="auth-link mb-8 flex items-center gap-1.5"
        onClick={() => router.push("/login")}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la connexion
      </button>

      <h1 className="auth-title text-4xl font-bold">Mot de passe oublié</h1>
      <p className="auth-subtitle">
        Indiquez votre adresse e-mail et nous vous enverrons un lien de
        réinitialisation.
      </p>

      {forgotPasswordMutation.isError && (
        <div className="auth-alert auth-alert--error" role="alert">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {forgotPasswordMutation.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <Field label="Adresse e-mail" htmlFor="email" error={error}>
          <div className="relative">
            <Mail className="input-icon h-4 w-4" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={150}
              value={email}
              onChange={(e) => update(e.target.value)}
              className="pl-10"
              placeholder="jean.fotso@entreprise.cm"
              disabled={submitting}
              aria-invalid={error ? true : undefined}
            />
          </div>
        </Field>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              Envoyer le lien
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
