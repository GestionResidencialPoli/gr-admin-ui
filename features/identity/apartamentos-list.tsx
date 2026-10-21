"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, EmptyState, Skeleton, TextField } from "@gestionresidencial/shared-ui";
import { listApartamentos } from "@/lib/identity-client";
import type { Apartamento, PageResult } from "@/lib/identity-types";

const PAGE_SIZE = 20;

export function ApartamentosList() {
  const [filtros, setFiltros] = useState<{ torre?: string; numero?: string }>({});
  return <ApartamentosWindow key={JSON.stringify(filtros)} filtros={filtros} onFiltrar={setFiltros} />;
}

function ApartamentosWindow({
  filtros,
  onFiltrar,
}: {
  filtros: { torre?: string; numero?: string };
  onFiltrar: (filtros: { torre?: string; numero?: string }) => void;
}) {
  const [resultado, setResultado] = useState<PageResult<Apartamento> | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let active = true;
    listApartamentos({ ...filtros, page: 0, size: PAGE_SIZE })
      .then((result) => {
        if (!active) return;
        setResultado(result);
        setPage(0);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  async function cargarMas() {
    setLoadingMore(true);
    try {
      const siguiente = await listApartamentos({ ...filtros, page: page + 1, size: PAGE_SIZE });
      setResultado((previous) =>
        previous ? { ...siguiente, content: [...previous.content, ...siguiente.content] } : siguiente,
      );
      setPage(siguiente.page);
    } finally {
      setLoadingMore(false);
    }
  }

  function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onFiltrar({
      torre: String(data.get("torre") || "").trim() || undefined,
      numero: String(data.get("numero") || "").trim() || undefined,
    });
  }

  return (
    <div>
      <div className="gr-form-actions">
        <Link href="/apartamentos/nuevo" className="gr-button gr-button--primary">
          Nuevo apartamento
        </Link>
      </div>

      <form className="gr-form gr-reserva-filtros" onSubmit={aplicarFiltros}>
        <TextField id="torre" name="torre" label="Torre" defaultValue={filtros.torre} />
        <TextField id="numero" name="numero" label="Apartamento" defaultValue={filtros.numero} />
        <div className="gr-form-actions">
          <Button type="submit" variant="secondary">
            Filtrar
          </Button>
        </div>
      </form>

      {status === "loading" && <Skeleton label="Cargando apartamentos" />}
      {status === "error" && (
        <EmptyState title="No pudimos cargar los apartamentos" description="Comprueba tu conexión e inténtalo de nuevo." />
      )}
      {status === "ready" && resultado && resultado.content.length === 0 && (
        <EmptyState title="No hay apartamentos con estos filtros" description="Ajusta los filtros o crea el primero." />
      )}
      {status === "ready" && resultado && resultado.content.length > 0 && (
        <>
          <ul className="gr-reserva-list">
            {resultado.content.map((apartamento) => (
              <li key={apartamento.id} className="gr-reserva-item">
                <div>
                  <strong>
                    {apartamento.torre} · {apartamento.numero}
                    {!apartamento.activo && " (inactivo)"}
                  </strong>
                  <span>
                    {apartamento.propietario.firstName} {apartamento.propietario.lastName} —{" "}
                    {apartamento.propietario.email}
                  </span>
                </div>
                <Link href={`/apartamentos/${apartamento.id}`} className="gr-button gr-button--secondary">
                  Ver
                </Link>
              </li>
            ))}
          </ul>
          {page + 1 < resultado.totalPages && (
            <div className="gr-form-actions">
              <Button variant="secondary" disabled={loadingMore} onClick={cargarMas}>
                {loadingMore ? "Cargando…" : "Cargar más"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
