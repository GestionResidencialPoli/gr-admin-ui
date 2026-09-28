"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell, Button, EmptyState, Feedback, Skeleton } from "@gestionresidencial/shared-ui";
import { authUiLoginUrl } from "@gestionresidencial/auth-client";
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

  const navigation = [
    { id: "home", label: "Inicio", href: "/", icon: <span aria-hidden="true">⌂</span> },
    { id: "dashboard", label: "Tablero", href: "/tablero", icon: <span aria-hidden="true">▤</span> },
    { id: "common-areas", label: "Zonas comunes", href: "/zonas-comunes", icon: <span aria-hidden="true">▣</span> },
    { id: "porteria", label: "Portería", href: "/porteria", icon: <span aria-hidden="true">◈</span> },
    { id: "apartamentos", label: "Apartamentos", href: "/apartamentos", icon: <span aria-hidden="true">▭</span> },
    { id: "vigilantes", label: "Vigilantes", href: "/vigilantes", icon: <span aria-hidden="true">◎</span> },
  ];
  const activeId = navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.id;

  return (
    <AppShell
      brand={{ name: "Habitar", description: "Tu comunidad, en un lugar", mark: "h.", href: "/" }}
      navigation={navigation}
      activeId={activeId}
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
