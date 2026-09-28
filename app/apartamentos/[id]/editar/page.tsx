import { notFound } from "next/navigation";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { EditarApartamento } from "@/features/identity/editar-apartamento";

export default async function EditarApartamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  return (
    <AuthenticatedShell>
      <div className="page-heading">
        <span className="gr-eyebrow">Identidad</span>
        <h1>Editar apartamento</h1>
      </div>
      <EditarApartamento id={numericId} />
    </AuthenticatedShell>
  );
}
