import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";
import { ModuleProvider } from "@/providers/module-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Prodigo ERP — Toute votre entreprise, dans un seul tableau de bord",
    template: "%s — Prodigo ERP",
  },
  description:
    "Clients, stock, commandes, factures et paiements mobile — toute votre entreprise dans un seul tableau de bord. L'ERP cloud pour les entreprises africaines.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ModuleProvider>{children}</ModuleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
