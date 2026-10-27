"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Globe2,
  MapPin,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Check,
  Box,
  Users,
  Receipt,
  Archive,
  ShoppingCart,
  Calculator,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Field from "@/modules/auth/components/field";
import {
  companyInfoSchema,
  personalInfoSchema,
  registerSchema,
  toFieldErrors,
} from "@/modules/auth/schemas/auth-schema";
import {
  useModulesQuery,
  useRegisterMutation,
} from "@/modules/auth/hooks/use-auth";
import { useAuthStore } from "@/modules/auth/stores/auth-store";
import type {
  FetchedPublicModule,
  SelectedModule,
} from "@/modules/auth/types";

const COUNTRIES = [
  { name: "Cameroun", code: "CM" },
  { name: "Côte d'Ivoire", code: "CI" },
  { name: "Sénégal", code: "SN" },
  { name: "Gabon", code: "GA" },
  { name: "Togo", code: "TG" },
  { name: "Bénin", code: "BJ" },
  { name: "Mali", code: "ML" },
  { name: "Burkina Faso", code: "BF" },
  { name: "RD Congo", code: "CD" },
  { name: "Congo", code: "CG" },
  { name: "Tchad", code: "TD" },
  { name: "Niger", code: "NE" },
  { name: "Guinée", code: "GN" },
  { name: "Autre", code: "OTHER" },
];

const MODULE_ICONS: Record<string, LucideIcon> = {
  CRM: Users,
  INVOICE: Receipt,
  INVENTORY: Archive,
  SALES: ShoppingCart,
  ACCOUNTING: Calculator,
  HR: UserRound,
};

const STEPS = ["Compte", "Entreprise", "Modules"];

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companySlug: string;
  country: string;
  selectedModules: SelectedModule[];
}

const INITIAL_VALUES: RegisterFormValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  companySlug: "",
  country: "CM",
  selectedModules: [],
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 255);
}

type Strength = 1 | 2 | 3;

function passwordStrength(pw: string): Strength {
  if (!pw) return 1;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 1;
  if (score <= 3) return 2;
  return 3;
}

const STRENGTH_CLASS: Record<Strength, { label: string; className: string }> = {
  1: { label: "Faible", className: "strength-weak" },
  2: { label: "Moyen", className: "strength-medium" },
  3: { label: "Fort", className: "strength-strong" },
};

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const modulesQuery = useModulesQuery();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  function update(
    field: Exclude<keyof RegisterFormValues, "selectedModules">,
    value: string,
  ) {
    setValues((v) => {
      const next = { ...v, [field]: value };
      if (field === "companyName" && !slugTouched) {
        next.companySlug = slugify(value);
      }
      return next;
    });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function toggleModule(module: FetchedPublicModule) {
    setValues((v) => {
      const alreadySelected = v.selectedModules.some((m) => {
        return m.moduleId === module.id;
      });

      return {
        ...v,
        selectedModules: alreadySelected
          ? v.selectedModules.filter((m) => m.moduleId !== module.id)
          : [
              ...v.selectedModules,
              {
                moduleId: module.id,
                moduleKey: module.moduleKey,
                moduleName: module.moduleKey,
              },
            ],
      };
    });
    if (errors.selectedModules) {
      setErrors((e) => ({ ...e, selectedModules: undefined }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step === 1) {
      const parsed = personalInfoSchema.safeParse({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      if (!parsed.success) {
        setErrors(toFieldErrors(parsed.error));
        return;
      }
      setErrors({});
      setStep(2);
      return;
    }

    if (step === 2) {
      const parsed = companyInfoSchema.safeParse({
        companyName: values.companyName,
        companySlug: values.companySlug,
        country: values.country,
      });
      if (!parsed.success) {
        setErrors(toFieldErrors(parsed.error));
        return;
      }
      setErrors({});
      setStep(3);
      return;
    }

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});

    registerMutation.mutate(parsed.data, {
      onSuccess: (data) => {
        setAuth(data);
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 600);
      },
    });
  }

  const submitting = registerMutation.isPending;
  const strength = passwordStrength(values.password);
  const modules = modulesQuery.data ?? [];

  if (success) {
    return (
      <div>
        <div className="success-icon">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="success-title text-4xl font-bold">
          Compte créé avec succès
        </h1>
        <p className="success-body">
          Bienvenue sur Prodigo, {values.firstName || "à vous"}. Votre espace{" "}
          <span className="success-strong">{values.companyName}</span> est prêt.
          Redirection vers votre tableau de bord...
        </p>
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => router.push("/dashboard")}
        >
          Aller au tableau de bord
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="auth-title text-4xl font-bold">Créer votre compte</h1>
      <p className="auth-subtitle">
        {step === 1
          ? "Commencez par vos informations personnelles."
          : step === 2
            ? "Parlez-nous de votre entreprise."
            : "Choisissez les modules de votre espace."}
      </p>

      <div className="step-bars">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`step-bar ${i + 1 <= step ? "step-bar--active" : ""}`}
          />
        ))}
      </div>
      <div className="step-labels">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={i + 1 <= step ? "step-labels__item--active" : undefined}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {registerMutation.isError && (
        <div className="auth-alert auth-alert--error my-2" role="alert">
          <AlertCircle className="h-4 w-4  flex-shrink-0" />
          {registerMutation.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Prénom"
                htmlFor="firstName"
                error={errors.firstName}
              >
                <Input
                  id="firstName"
                  maxLength={150}
                  value={values.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="Jean"
                  aria-invalid={errors.firstName ? true : undefined}
                />
              </Field>
              <Field label="Nom" htmlFor="lastName" error={errors.lastName}>
                <Input
                  id="lastName"
                  maxLength={150}
                  value={values.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Fotso"
                  aria-invalid={errors.lastName ? true : undefined}
                />
              </Field>
            </div>

            <Field
              label="Nom d'utilisateur"
              htmlFor="username"
              error={errors.username}
              right={
                <span className="text-xs text-muted-foreground">
                  {values.username.length}/20
                </span>
              }
            >
              <div className="relative">
                <User className="input-icon h-4 w-4" />
                <Input
                  id="username"
                  maxLength={20}
                  value={values.username}
                  onChange={(e) => update("username", e.target.value)}
                  className="pl-10"
                  placeholder="jfotso"
                  aria-invalid={errors.username ? true : undefined}
                />
              </div>
            </Field>

            <Field label="Adresse e-mail" htmlFor="email" error={errors.email}>
              <div className="relative">
                <Mail className="input-icon h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  maxLength={150}
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="pl-10"
                  placeholder="jean.fotso@entreprise.cm"
                  aria-invalid={errors.email ? true : undefined}
                />
              </div>
            </Field>

            <Field
              label="Mot de passe"
              htmlFor="password"
              error={errors.password}
              hint={!errors.password ? "8 caractères minimum." : undefined}
            >
              <div className="relative">
                <Lock className="input-icon h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  maxLength={100}
                  value={values.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
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
              {values.password && (
                <div className="strength-meter">
                  <div className="strength-bars">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`strength-bar ${
                          i <= strength
                            ? STRENGTH_CLASS[strength].className
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`strength-label ${STRENGTH_CLASS[strength].className}`}
                  >
                    {STRENGTH_CLASS[strength].label}
                  </span>
                </div>
              )}
            </Field>

            <Field
              label="Confirmer le mot de passe"
              htmlFor="confirmPassword"
              error={errors.confirmPassword}
            >
              <div className="relative">
                <Lock className="input-icon h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  maxLength={100}
                  value={values.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  aria-invalid={errors.confirmPassword ? true : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="input-toggle"
                  aria-label={
                    showConfirmPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            <Button type="submit" size="lg" className="w-full">
              Continuer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field
              label="Nom de l'entreprise"
              htmlFor="companyName"
              error={errors.companyName}
            >
              <div className="relative">
                <Building2 className="input-icon h-4 w-4" />
                <Input
                  id="companyName"
                  maxLength={255}
                  value={values.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  className="pl-10"
                  placeholder="Ets Fotso & Fils"
                  aria-invalid={errors.companyName ? true : undefined}
                />
              </div>
            </Field>

            <Field
              label="Identifiant de l'entreprise"
              htmlFor="companySlug"
              error={errors.companySlug}
              hint={
                !errors.companySlug
                  ? `Aperçu : prodigo.app/${values.companySlug || "votre-entreprise"}`
                  : undefined
              }
            >
              <div className="relative">
                <Globe2 className="input-icon h-4 w-4" />
                <Input
                  id="companySlug"
                  maxLength={255}
                  value={values.companySlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update("companySlug", slugify(e.target.value));
                  }}
                  className="pl-10"
                  placeholder="ets-fotso-fils"
                  aria-invalid={errors.companySlug ? true : undefined}
                />
              </div>
            </Field>

            <Field label="Pays" htmlFor="country" error={errors.country}>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Select
                  value={values.country}
                  onValueChange={(value) => {
                    if (value) update("country", value);
                  }}
                >
                  <SelectTrigger className="w-full pl-9">
                    <SelectValue placeholder="Choisir un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Field>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <Button type="submit" size="lg" className="flex-1">
                Continuer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {modulesQuery.isPending && (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des modules...
              </div>
            )}

            {modulesQuery.isError && (
              <div className="auth-alert auth-alert--error" role="alert">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                Impossible de charger les modules.{" "}
                <button
                  type="button"
                  className="auth-link underline"
                  onClick={() => modulesQuery.refetch()}
                >
                  Réessayer
                </button>
              </div>
            )}

            {modulesQuery.isSuccess && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {modules.map((module) => {
                    const selected = values.selectedModules.some(
                      (m) => m.moduleId === module.id,
                    );
                    const Icon = MODULE_ICONS[module.moduleKey] ?? Box;
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => toggleModule(module)}
                        aria-pressed={selected}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                          selected
                            ? "border-primary bg-[var(--color-primary-light)]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-900">
                          {module.name}
                        </span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3 text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {errors.selectedModules && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.selectedModules}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer mon compte"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </form>

      <p className="auth-switch">
        Vous avez déjà un compte ?{" "}
        <button
          type="button"
          className="auth-link"
          onClick={() => router.push("/login")}
        >
          Se connecter
        </button>
      </p>
    </>
  );
}
