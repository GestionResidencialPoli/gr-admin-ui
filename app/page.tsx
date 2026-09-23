import Link from "next/link";
import { Card } from "@gestionresidencial/shared-ui";

export default function Home() {
  return <div className="admin-home"><section className="admin-welcome"><span className="gr-eyebrow">Tu espacio de administración</span><h1>Hola, administración.</h1><p>Gestiona la comunicación y los espacios de tu comunidad desde un solo lugar.</p></section><section><div className="section-title"><div><h2>¿Qué quieres hacer hoy?</h2><p>Accede a las herramientas de tu comunidad.</p></div></div><div className="admin-module-grid"><Link href="/tablero"><Card><span className="module-icon">▤</span><h3>Tablero</h3><p>Crea, edita y administra las publicaciones para residentes.</p><strong>Gestionar publicaciones →</strong></Card></Link><Link href="/zonas-comunes"><Card><span className="module-icon">▣</span><h3>Zonas comunes</h3><p>Consulta reservas y controla la disponibilidad de cada zona.</p><strong>Gestionar zonas →</strong></Card></Link></div></section></div>;
}
