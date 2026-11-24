import { CrearApartamento } from "@/features/identity/crear-apartamento";

export default function NuevoApartamentoPage() {
  return (
    <>
      <div className="page-heading">
        <span className="gr-eyebrow">Identidad</span>
        <h1>Nuevo apartamento</h1>
      </div>
      <CrearApartamento />
    </>
  );
}
