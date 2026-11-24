import { VigilantesList } from "@/features/identity/vigilantes-list";

export default function VigilantesPage() {
  return (
    <>
      <div className="page-heading">
        <span className="gr-eyebrow">Identidad</span>
        <h1>Vigilantes</h1>
        <p>Crea y administra las cuentas del personal de vigilancia.</p>
      </div>
      <VigilantesList />
    </>
  );
}
