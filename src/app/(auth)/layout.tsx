import type { ReactNode } from "react";
import Logo from "@/components/shared/logo";
import BrandPanel from "@/modules/auth/adapters/in/ui/brand-panel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-form-panel">
        <div className="auth-card">
          <Logo />
          {children}
        </div>
      </div>
      <BrandPanel />
    </div>
  );
}
