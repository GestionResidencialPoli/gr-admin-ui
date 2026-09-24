"use client";

import { SsoCallbackScreen } from "@gestionresidencial/auth-client";

/**
 * Recibe el codigo SSO de un solo uso que emite gr-auth-ui para
 * ADMINISTRACION (GR-151). La logica de intercambio vive en
 * @gestionresidencial/auth-client (GR-157/GR-158): antes estaba duplicada
 * aqui y en gr-common-ui.
 */
export default function AdminSsoCallbackPage() {
  return <SsoCallbackScreen />;
}
