"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Feedback } from "@gr/shared-ui";
import { communityService, type Publication } from "@/services/community-service";

const blank = { title: "", content: "" };

export function PublicationBoard() {
  const [posts, setPosts] = useState<Publication[]>([]);
  const [form, setForm] = useState(blank);
  const [files, setFiles] = useState<File[]>([]);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { communityService.getPublications().then(setPosts); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { ...form, images: files };
    const result = editing ? await communityService.updatePublication(editing.id, input) : await communityService.createPublication(input);
    setPosts((current) => editing ? current.map((post) => post.id === result.id ? result : post) : [result, ...current]);
    setNotice(editing ? "La publicación fue actualizada." : "La publicación fue creada y ya es visible para los residentes.");
    setEditing(null); setForm(blank); setFiles([]); if (fileRef.current) fileRef.current.value = "";
  }
  function edit(post: Publication) { setEditing(post); setForm({ title: post.title, content: post.content }); setFiles([]); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function remove(post: Publication) { if (!window.confirm(`¿Eliminar “${post.title}”?`)) return; await communityService.deletePublication(post.id); setPosts((current) => current.filter((item) => item.id !== post.id)); setNotice("La publicación fue eliminada."); }

  return <div className="community-page">
    <div className="page-heading community-heading"><div><span className="gr-eyebrow">Comunicación de la unidad</span><h1>Tablero</h1><p>Comparte novedades con todos los residentes.</p></div><span className="post-count">{posts.length} publicaciones</span></div>
    {notice && <Feedback>{notice}</Feedback>}
    <Card className="composer"><div><h2>{editing ? "Editar publicación" : "Crear publicación"}</h2><p>La información publicada estará disponible para todos los residentes.</p></div><form onSubmit={submit} className="publication-form"><label>Título<input required value={form.title} maxLength={100} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Mantenimiento programado" /></label><label>Mensaje<textarea required value={form.content} maxLength={1200} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Escribe la información que deseas compartir…" /></label><div className="composer-footer"><label className="file-picker">Adjuntar imágenes<input ref={fileRef} type="file" accept="image/*" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /><span>▧ {files.length ? `${files.length} imagen${files.length > 1 ? "es" : ""} seleccionada${files.length > 1 ? "s" : ""}` : "Agregar imágenes"}</span></label><div>{editing && <Button variant="ghost" onClick={() => { setEditing(null); setForm(blank); setFiles([]); }}>Cancelar</Button>}<Button type="submit">{editing ? "Guardar cambios" : "Publicar"}</Button></div></div></form></Card>
    <section className="post-list" aria-label="Publicaciones creadas"><div className="section-title"><h2>Publicaciones recientes</h2><span>Solo tú puedes administrarlas</span></div>{posts.map((post) => <Card className="publication" key={post.id}><div className="publication-meta"><span className="admin-avatar">A</span><div><strong>{post.author}</strong><small>{post.publishedAt}</small></div><div className="post-actions"><button onClick={() => edit(post)}>Editar</button><button className="danger" onClick={() => remove(post)}>Eliminar</button></div></div><h3>{post.title}</h3><p>{post.content}</p>{post.images.length > 0 && <div className="image-grid">{post.images.map((image, index) => <Image key={image} src={image} alt={`Imagen ${index + 1} de ${post.title}`} width={720} height={480} unoptimized />)}</div>}</Card>)}</section>
  </div>;
}
