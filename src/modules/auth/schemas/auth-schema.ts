import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Indiquez votre nom d'utilisateur."),
  password: z.string().min(1, "Le mot de passe est requis."),
  remember: z.boolean().default(true),
});

const personalFields = {
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom est requis."),
  username: z
    .string()
    .min(1, "Le nom d'utilisateur est requis.")
    .max(20, "20 caractères maximum."),
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise.")
    .pipe(z.email("Adresse e-mail invalide.")),
  password: z.string().min(8, "8 caractères minimum."),
} as const;

export const personalInfoSchema = z
  .object({
    ...personalFields,
    confirmPassword: z.string().min(1, "Confirmez votre mot de passe."),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Les mots de passe ne correspondent pas.",
      });
    }
  });

export const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis."),
  companySlug: z
    .string()
    .min(1, "L'identifiant est requis.")
    .regex(/^[a-z0-9-]+$/, "Minuscules, chiffres et tirets uniquement."),
  country: z
    .string()
    .min(1, "Le pays est requis.")
    .regex(/^[A-Z]{2,}$/, "Code pays invalide."),
});

export const selectedModuleSchema = z.object({
  moduleId: z.string(),
  moduleName: z.string().min(1),
  moduleKey: z.string().min(1),
});

export const registerSchema = z
  .object({
    ...personalFields,
    companyName: companyInfoSchema.shape.companyName,
    companySlug: companyInfoSchema.shape.companySlug,
    country: companyInfoSchema.shape.country,
    selectedModules: z
      .array(selectedModuleSchema)
      .min(1, "Sélectionnez au moins un module."),
  })
  .strip();

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Indiquez votre adresse e-mail.")
    .pipe(z.email("Adresse e-mail invalide.")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !(key in result)) result[key] = issue.message;
  }
  return result;
}
