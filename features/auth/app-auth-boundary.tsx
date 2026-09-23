"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AuthenticatedShell } from "./authenticated-shell";
import { AuthProvider } from "./auth-provider";

const SSO_CALLBACK_PATH = "/auth/sso/callback";

/** Keeps the SSO hand-off free of session requests until it has exchanged its code. */
export function AppAuthBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === SSO_CALLBACK_PATH) return <>{children}</>;

  return (
    <AuthProvider>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </AuthProvider>
  );
}
