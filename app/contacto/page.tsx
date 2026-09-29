"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiClientError, apiFetch } from "@gestionresidencial/auth-client";

type ContactStatus = "NUEVA" | "EN_REVISION" | "RESPONDIDA" | "CERRADA";
type ContactRequest = {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  status: ContactStatus;
  created_at: string;
};

const statuses: ContactStatus[] = ["NUEVA", "EN_REVISION", "RESPONDIDA", "CERRADA"];

export default function ContactInboxPage() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);

  const reload = useCallback(async () => {
    setError("");
    try {
      setItems(await apiFetch<ContactRequest[]>("/api/v1/contacto/solicitudes"));
    } catch {
      setError("No pudimos cargar las solicitudes. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(reload);
  }, [reload]);

  async function changeStatus(id: number, status: ContactStatus) {
    setPendingId(id);
    setError("");
    try {
      await apiFetch(`/api/v1/contacto/solicitudes/${id}/estado`, { method: "PATCH", body: { status } });
      await reload();
    } catch (reason) {
      setError(reason instanceof ApiClientError && reason.status === 403
        ? "La sesión no tiene permiso para cambiar esta solicitud."
        : "No pudimos guardar el estado. Inténtalo de nuevo.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="contact-inbox">
      <div className="page-heading"><p className="gr-eyebrow">Administración</p><h1>Solicitudes de contacto</h1><p>Mensajes enviados desde el sitio público.</p></div>
      <button type="button" onClick={() => { setLoading(true); void reload(); }}>Actualizar</button>
      {error && <p className="contact-error" role="alert">{error}</p>}
      {loading && <p role="status">Cargando solicitudes…</p>}
      {!loading && items.length === 0 && !error && <p>No hay solicitudes de contacto.</p>}
      {!loading && items.length > 0 && (
        <ul className="contact-list">
          {items.map((item) => (
            <li key={item.id} className="contact-item">
              <div>
                <strong>{item.nombre}</strong> · <a href={`mailto:${item.email}`}>{item.email}</a>
                {item.telefono && <span> · {item.telefono}</span>}
                <p>{item.mensaje}</p>
                <small>{new Date(item.created_at).toLocaleString("es-CO")}</small>
              </div>
              <label>Estado
                <select value={item.status} disabled={pendingId === item.id} onChange={(event) => void changeStatus(item.id, event.target.value as ContactStatus)}>
                  {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                </select>
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
