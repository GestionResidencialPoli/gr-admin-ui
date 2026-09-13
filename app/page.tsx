import { EmptyState } from "@gr/shared-ui";

export default function Home() {
  return (
    <>
      <div className="page-heading">
        <span className="gr-eyebrow">Operación de la unidad</span>
        <h1>Hola admin</h1>
      </div>
      <EmptyState
        title="Este espacio está por llegar"
        description="Ya estás en el panel administrativo. Pronto encontrarás aquí las herramientas de tu rol."
      />
      <footer className="page-footer">
        <span>Habitar · Hecho para vivir en comunidad</span>
        <span>Tu unidad, más cerca.</span>
      </footer>
    </>
  );
}
