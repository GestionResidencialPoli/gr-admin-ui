"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState, Skeleton } from "@gestionresidencial/shared-ui";
import { getApartamento, updateApartamento } from "@/lib/identity-client";
import type { Apartamento } from "@/lib/identity-types";
import { ApartamentoForm } from "./apartamento-form";

export function EditarApartamento({ id }: { id: number }) {
  const router = useRouter();
  const [apartamento, setApartamento] = useState<Apartamento | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    getApartamento(id)
      .then((result) => {
        if (active) {
          setApartamento(result);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(input: Parameters<typeof updateApartamento>[1]) {
    await updateApartamento(id, input);
    router.push(`/apartamentos/${id}`);
  }

  if (status === "loading") return <Skeleton label="Cargando apartamento" />;

  if (status === "error" || !apartamento) {
    return (
      <EmptyState title="No pudimos cargar este apartamento" description="Comprueba tu conexión e inténtalo de nuevo." />
    );
  }

  return (
    <ApartamentoForm
      initial={apartamento}
      onSubmit={handleSubmit}
      submitLabel="Guardar cambios"
      pendingLabel="Guardando…"
    />
  );
}
