import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { ApartamentosList } from "@/features/identity/apartamentos-list";

export default function ApartamentosPage() {
  return (
    <AuthenticatedShell>
      <div className="page-heading">
        <span className="gr-eyebrow">Identidad</span>
        <h1>Apartamentos</h1>
        <p>Registra apartamentos, su propietario, y administra los arrendatarios vinculados.</p>
      </div>
      <ApartamentosList />
    </AuthenticatedShell>
  );
}
