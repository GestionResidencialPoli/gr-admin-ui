"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppShell, Button, EmptyState, Feedback, Skeleton } from "@gr/shared-ui";
import { commonUiUrl } from "@/lib/common-ui-url";
import { useAuth } from "./auth-provider";

const ADMIN_ROLE = "ADMINISTRACION";

function loginUrl(): string {
  return new URL("/login", commonUiUrl).toString();
}

export function AuthenticatedShell({ children }: { children: ReactNode }) {
  const { user, loading, sessionError, logout } = useAuth();
  const [pending, setPending] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const isAdministrator = user?.roles.includes(ADMIN_ROLE) ?? false;

  useEffect(() => {
    if (!loading && !sessionError && (!user || !isAdministrator)) {
      window.location.replace(loginUrl());
    }
  }, [isAdministrator, loading, sessionError, user]);

  async function signOut() {
    setPending(true);
    setLogoutError(false);

    try {
      await logout();
      window.location.replace(loginUrl());
    } catch {
      setLogoutError(true);
    } finally {
      setPending(false);
    }
  }

  if (loading || (!sessionError && (!user || !isAdministrator))) {
    return <div className="standalone-state"><Skeleton label="Cargando tu espacio" /></div>;
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
    <AppShell
      brand={{ name: "Habitar", description: "Tu comunidad, en un lugar", mark: "h.", href: "/" }}
      navigation={[{ id: "home", label: "Inicio", href: "/" }]}
      activeId="home"
      user={{ name: user.name, caption: "Mi cuenta" }}
      userMenuItems={[]}
      labels={{
        navigation: "Mi comunidad",
        menu: "Abrir navegación",
        skip: "Saltar al contenido",
        footer: "Un espacio para todos",
      }}
      eyebrow="Tu comunidad, en un lugar"
      actions={
        <Button variant="ghost" disabled={pending} onClick={signOut}>
          {pending ? "Cerrando sesión" : "Cerrar sesión"}
        </Button>
      }
    >
      {logoutError && <Feedback error>No se pudo cerrar sesión. Inténtalo de nuevo.</Feedback>}
      {children}
    </AppShell>
  );
}
