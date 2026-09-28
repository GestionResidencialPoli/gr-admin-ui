"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Button,
  Dialog,
  DOCUMENT_PATTERN,
  EMAIL_PATTERN,
  EmptyState,
  Feedback,
  PERSON_NAME_PATTERN,
  PHONE_PATTERN,
  Skeleton,
  TextField,
} from "@gestionresidencial/shared-ui";
import { errorMessage } from "@/lib/error-message";
import {
  deactivateApartamento,
  getApartamento,
  linkArrendatario,
  listArrendatarios,
  unlinkArrendatario,
} from "@/lib/identity-client";
import type { Apartamento, Arrendatario } from "@/lib/identity-types";

export function ApartamentoDetail({ id }: { id: number }) {
  const [apartamento, setApartamento] = useState<Apartamento | null>(null);
  const [arrendatarios, setArrendatarios] = useState<Arrendatario[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [vinculando, setVinculando] = useState(false);
  const [vincularAbierto, setVincularAbierto] = useState(false);
  const [error, setError] = useState<string>();
  const [pendingUnlinkId, setPendingUnlinkId] = useState<number>();
  const [confirmandoBaja, setConfirmandoBaja] = useState(false);
  const [dandoBaja, setDandoBaja] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getApartamento(id), listArrendatarios(id)])
      .then(([apartamentoResult, arrendatariosResult]) => {
        if (!active) return;
        setApartamento(apartamentoResult);
        setArrendatarios(arrendatariosResult);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function vincular(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVinculando(true);
    setError(undefined);
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").trim();

    try {
      const nuevo = await linkArrendatario(id, {
        firstName: String(data.get("firstName") || "").trim(),
        lastName: String(data.get("lastName") || "").trim(),
        documentNumber: String(data.get("documentNumber") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: phone || undefined,
      });
      setArrendatarios((previous) => [...previous, nuevo]);
      setVincularAbierto(false);
    } catch (caughtError) {
      setError(errorMessage(caughtError, "No se pudo vincular el arrendatario."));
    } finally {
      setVinculando(false);
    }
  }

  async function desvincular(arrendatario: Arrendatario) {
    setPendingUnlinkId(arrendatario.arrendatarioId);
    try {
      await unlinkArrendatario(id, arrendatario.arrendatarioId);
      setArrendatarios((previous) =>
        previous.filter((item) => item.arrendatarioId !== arrendatario.arrendatarioId),
      );
    } finally {
      setPendingUnlinkId(undefined);
    }
  }

  async function darDeBaja() {
    setDandoBaja(true);
    try {
      await deactivateApartamento(id);
      setApartamento((previous) => (previous ? { ...previous, activo: false } : previous));
      setConfirmandoBaja(false);
    } finally {
      setDandoBaja(false);
    }
  }

  if (status === "loading") return <Skeleton label="Cargando apartamento" />;

  if (status === "error" || !apartamento) {
    return (
      <EmptyState title="No pudimos cargar este apartamento" description="Comprueba tu conexión e inténtalo de nuevo." />
    );
  }

  return (
    <div className="gr-cupos">
      <section>
        <div className="gr-form-actions">
          <Link href={`/apartamentos/${id}/editar`} className="gr-button gr-button--secondary">
            Editar
          </Link>
          {apartamento.activo && (
            <Button variant="ghost" onClick={() => setConfirmandoBaja(true)}>
              Dar de baja
            </Button>
          )}
        </div>
        <ul className="gr-reserva-list">
          <li className="gr-reserva-item">
            <div>
              <strong>Piso</strong>
              <span>{apartamento.piso ?? "Sin registrar"}</span>
            </div>
          </li>
          <li className="gr-reserva-item">
            <div>
              <strong>Coeficiente de copropiedad</strong>
              <span>{apartamento.coeficienteCopropiedad ?? "Sin registrar"}</span>
            </div>
          </li>
          <li className="gr-reserva-item">
            <div>
              <strong>Área</strong>
              <span>{apartamento.area ? `${apartamento.area} m²` : "Sin registrar"}</span>
            </div>
          </li>
          <li className="gr-reserva-item">
            <div>
              <strong>Estado</strong>
              <span>{apartamento.activo ? "Activo" : "Inactivo"}</span>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2>Propietario</h2>
        <ul className="gr-reserva-list">
          <li className="gr-reserva-item">
            <div>
              <strong>
                {apartamento.propietario.firstName} {apartamento.propietario.lastName}
              </strong>
              <span>Documento: {apartamento.propietario.documentNumber}</span>
              <span>{apartamento.propietario.email}</span>
              {apartamento.propietario.phone && <span>{apartamento.propietario.phone}</span>}
            </div>
          </li>
        </ul>
      </section>

      <section>
        <div className="gr-form-actions">
          <h2>Arrendatarios</h2>
        </div>
        <div className="gr-form-actions">
          <Button variant="secondary" onClick={() => setVincularAbierto(true)}>
            Vincular arrendatario
          </Button>
        </div>
        {arrendatarios.length === 0 ? (
          <p>Este apartamento no tiene arrendatarios vinculados.</p>
        ) : (
          <ul className="gr-reserva-list">
            {arrendatarios.map((arrendatario) => (
              <li key={arrendatario.arrendatarioId} className="gr-reserva-item">
                <div>
                  <strong>
                    {arrendatario.firstName} {arrendatario.lastName}
                  </strong>
                  <span>Documento: {arrendatario.documentNumber}</span>
                  <span>{arrendatario.email}</span>
                  <span>Vinculado desde {arrendatario.vinculadoDesde}</span>
                </div>
                <Button
                  variant="ghost"
                  disabled={pendingUnlinkId === arrendatario.arrendatarioId}
                  onClick={() => desvincular(arrendatario)}
                >
                  Desvincular
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog
        open={vincularAbierto}
        title="Vincular arrendatario"
        closeLabel="Cancelar"
        onClose={() => setVincularAbierto(false)}
      >
        <form className="gr-form" onSubmit={vincular}>
          <div className="gr-ingreso-fila">
            <TextField
              id="firstName"
              name="firstName"
              label="Nombres"
              required
              maxLength={100}
              pattern={PERSON_NAME_PATTERN}
              disabled={vinculando}
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Apellidos"
              required
              maxLength={100}
              pattern={PERSON_NAME_PATTERN}
              disabled={vinculando}
            />
          </div>
          <TextField
            id="documentNumber"
            name="documentNumber"
            label="Documento de identidad"
            required
            maxLength={30}
            pattern={DOCUMENT_PATTERN}
            disabled={vinculando}
          />
          <TextField
            id="email"
            name="email"
            label="Correo"
            type="email"
            required
            maxLength={254}
            pattern={EMAIL_PATTERN}
            disabled={vinculando}
          />
          <TextField
            id="phone"
            name="phone"
            label="Teléfono (opcional)"
            type="tel"
            maxLength={30}
            pattern={PHONE_PATTERN}
            disabled={vinculando}
          />
          {error && <Feedback error>{error}</Feedback>}
          <div className="gr-form-actions">
            <Button type="submit" disabled={vinculando}>
              {vinculando ? "Vinculando…" : "Vincular"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={confirmandoBaja}
        title="Dar de baja el apartamento"
        closeLabel="Cancelar"
        onClose={() => setConfirmandoBaja(false)}
      >
        <p>El apartamento quedará inactivo y no admitirá nuevas reservas ni vinculaciones. Su histórico se conserva.</p>
        <div className="gr-form-actions">
          <Button disabled={dandoBaja} onClick={darDeBaja}>
            {dandoBaja ? "Dando de baja…" : "Dar de baja"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
