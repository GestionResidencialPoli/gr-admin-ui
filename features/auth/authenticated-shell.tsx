"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  EmptyState,
  Feedback,
  PlatformShell,
  Skeleton,
} from "@gestionresidencial/shared-ui";
import { authUiLoginUrl, openPlatformUrl } from "@gestionresidencial/auth-client";
import { useAuth } from "./auth-provider";

const ADMIN_ROLE = "ADMINISTRACION";

export function AuthenticatedShell({ children }: { children: ReactNode }) {
  const { user, loading, sessionError, logout } = useAuth();
  const [pending, setPending] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const isAdministrator = user?.roles.includes(ADMIN_ROLE) ?? false;
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !sessionError && (!user || !isAdministrator)) {
      window.location.replace(authUiLoginUrl());
    }
  }, [isAdministrator, loading, sessionError, user]);

  async function signOut() {
    setPending(true);
    setLogoutError(false);

    try {
      await logout();
      window.location.replace(authUiLoginUrl());
    } catch {
      setLogoutError(true);
    } finally {
      setPending(false);
    }
  }

  if (loading || (!sessionError && (!user || !isAdministrator))) {
    return (
      <div className="standalone-state">
        <Skeleton label="Cargando tu espacio" />
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="standalone-state">
        <EmptyState
          title="No pudimos verificar tu sesión"
          description="Comprueba que el servicio de usuarios esté disponible e inténtalo de nuevo."
        />
      </div>
    );
  }

  if (!user || !isAdministrator) return null;

  return (
    <PlatformShell
      app="admin"
      pathname={pathname}
      user={user}
      onOpenApp={(url) => void openPlatformUrl(user.roles, url)}
      onLogout={signOut}
      loggingOut={pending}
    >
      {logoutError && (
        <Feedback error>No se pudo cerrar sesión. Inténtalo de nuevo.</Feedback>
      )}
      {children}
    </PlatformShell>
  );
}
