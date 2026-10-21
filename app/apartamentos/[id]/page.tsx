import { notFound } from "next/navigation";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ApartamentoDetail } from "@/features/identity/apartamento-detail";

export default async function ApartamentoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  return (
    <AuthenticatedShell>
      <div className="page-heading">
        <span className="gr-eyebrow">Identidad</span>
        <h1>Detalle del apartamento</h1>
      </div>
      <ApartamentoDetail key={numericId} id={numericId} />
    </AuthenticatedShell>
  );
}
