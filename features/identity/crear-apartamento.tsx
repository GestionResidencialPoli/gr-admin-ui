"use client";

import { useRouter } from "next/navigation";
import { createApartamento } from "@/lib/identity-client";
import { ApartamentoForm } from "./apartamento-form";

export function CrearApartamento() {
  const router = useRouter();

  async function handleSubmit(input: Parameters<typeof createApartamento>[0]) {
    const creado = await createApartamento(input);
    router.push(`/apartamentos/${creado.id}`);
  }

  return <ApartamentoForm onSubmit={handleSubmit} submitLabel="Crear apartamento" pendingLabel="Creando…" />;
}
