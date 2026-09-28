"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DOCUMENT_PATTERN,
  EMAIL_PATTERN,
  EmptyState,
  Feedback,
  PasswordField,
  PERSON_NAME_PATTERN,
  PHONE_PATTERN,
  Skeleton,
  TextField,
} from "@gestionresidencial/shared-ui";
import { errorMessage } from "@/lib/error-message";
import { createVigilante, deactivateVigilante, listVigilantes } from "@/lib/identity-client";
import type { Vigilante } from "@/lib/identity-types";

const ESTADO_LABELS: Record<Vigilante["estado"], string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  BLOCKED: "Bloqueado",
};

export function VigilantesList() {
  const [vigilantes, setVigilantes] = useState<Vigilante[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [crearAbierto, setCrearAbierto] = useState(false);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string>();
  const [pendingId, setPendingId] = useState<number>();

  useEffect(() => {
    let active = true;
    listVigilantes()
      .then((result) => {
        if (active) {
          setVigilantes(result);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  async function crear(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreando(true);
    setError(undefined);
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").trim();

    try {
      const nuevo = await createVigilante({
        firstName: String(data.get("firstName") || "").trim(),
        lastName: String(data.get("lastName") || "").trim(),
        documentNumber: String(data.get("documentNumber") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: phone || undefined,
        initialPassword: String(data.get("initialPassword") || ""),
      });
      setVigilantes((previous) => [...previous, nuevo]);
      setCrearAbierto(false);
    } catch (caughtError) {
      setError(errorMessage(caughtError, "No se pudo crear la cuenta de vigilante."));
    } finally {
      setCreando(false);
    }
  }

  async function desactivar(vigilante: Vigilante) {
    setPendingId(vigilante.userId);
    try {
      await deactivateVigilante(vigilante.userId);
      setVigilantes((previous) =>
        previous.map((item) => (item.userId === vigilante.userId ? { ...item, estado: "INACTIVE" } : item)),
      );
    } finally {
      setPendingId(undefined);
    }
  }

  return (
    <div>
      <div className="gr-form-actions">
        <Button onClick={() => setCrearAbierto(true)}>Nueva cuenta de vigilante</Button>
      </div>

      {status === "loading" && <Skeleton label="Cargando vigilantes" />}
      {status === "error" && (
        <EmptyState title="No pudimos cargar los vigilantes" description="Comprueba tu conexión e inténtalo de nuevo." />
      )}
      {status === "ready" && vigilantes.length === 0 && (
        <EmptyState title="Todavía no hay cuentas de vigilante" description="Crea la primera para empezar." />
      )}
      {status === "ready" && vigilantes.length > 0 && (
        <ul className="gr-reserva-list">
          {vigilantes.map((vigilante) => (
            <li key={vigilante.userId} className="gr-reserva-item">
              <div>
                <strong>
                  {vigilante.firstName} {vigilante.lastName}
                </strong>
                <span>Documento: {vigilante.documentNumber}</span>
                <span>{vigilante.email}</span>
                <span>{ESTADO_LABELS[vigilante.estado]}</span>
              </div>
              {vigilante.estado === "ACTIVE" && (
                <Button variant="ghost" disabled={pendingId === vigilante.userId} onClick={() => desactivar(vigilante)}>
                  Desactivar
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={crearAbierto}
        title="Nueva cuenta de vigilante"
        closeLabel="Cancelar"
        onClose={() => setCrearAbierto(false)}
      >
        <form className="gr-form" onSubmit={crear}>
          <div className="gr-ingreso-fila">
            <TextField
              id="firstName"
              name="firstName"
              label="Nombres"
              required
              maxLength={100}
              pattern={PERSON_NAME_PATTERN}
              disabled={creando}
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Apellidos"
              required
              maxLength={100}
              pattern={PERSON_NAME_PATTERN}
              disabled={creando}
            />
          </div>
          <TextField
            id="documentNumber"
            name="documentNumber"
            label="Documento de identidad"
            required
            maxLength={30}
            pattern={DOCUMENT_PATTERN}
            disabled={creando}
          />
          <TextField
            id="email"
            name="email"
            label="Correo"
            type="email"
            required
            maxLength={254}
            pattern={EMAIL_PATTERN}
            disabled={creando}
          />
          <TextField
            id="phone"
            name="phone"
            label="Teléfono (opcional)"
            type="tel"
            maxLength={30}
            pattern={PHONE_PATTERN}
            disabled={creando}
          />
          <PasswordField
            name="initialPassword"
            autoComplete="new-password"
            label="Contraseña inicial"
            showLabel="Mostrar"
            hideLabel="Ocultar"
            disabled={creando}
            policy
            hint="Entre 8 y 72 caracteres, con al menos una minúscula, una mayúscula y un dígito."
          />
          {error && <Feedback error>{error}</Feedback>}
          <div className="gr-form-actions">
            <Button type="submit" disabled={creando}>
              {creando ? "Creando…" : "Crear cuenta"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
