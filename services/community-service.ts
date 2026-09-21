import { apiFetch } from "@/lib/http-client";

export type Publication = { id: string; title: string; content: string; author: string; publishedAt: string; images: string[] };
export type Reservation = { id: string; resident: string; apartment: string; date: string; time: string; guests: number };
export type CommonArea = { id: string; name: string; description: string; available: boolean; blockReason?: string; reservations: Reservation[] };
export type PublicationInput = Pick<Publication, "title" | "content"> & { images?: File[] };

// Contrato listo para conectar con backend. La UI usa datos locales mientras las API no estén disponibles.
export const communityService = {
  async getPublications(): Promise<Publication[]> { /* TODO: return apiFetch<Publication[]>("/api/v1/community/publications"); */ return initialPublications; },
  async createPublication(input: PublicationInput): Promise<Publication> { /* TODO: enviar FormData a POST /api/v1/community/publications. */ void apiFetch; return { id: crypto.randomUUID(), title: input.title, content: input.content, author: "Administración", publishedAt: "Ahora", images: input.images?.map((image) => URL.createObjectURL(image)) ?? [] }; },
  async updatePublication(id: string, input: PublicationInput): Promise<Publication> { /* TODO: enviar FormData a PATCH /api/v1/community/publications/:id. */ const current = initialPublications.find((publication) => publication.id === id); return { id, title: input.title, content: input.content, author: current?.author ?? "Administración", publishedAt: current?.publishedAt ?? "Ahora", images: input.images?.map((image) => URL.createObjectURL(image)) ?? current?.images ?? [] }; },
  async deletePublication(id: string): Promise<void> { /* TODO: await apiFetch(`/api/v1/community/publications/${id}`, { method: "DELETE" }); */ void id; },
  async getCommonAreas(): Promise<CommonArea[]> { /* TODO: return apiFetch<CommonArea[]>("/api/v1/common-areas"); */ return initialCommonAreas; },
  async updateCommonAreaAvailability(id: string, available: boolean, blockReason?: string): Promise<CommonArea> { /* TODO: PATCH /api/v1/common-areas/:id/availability */ const area = initialCommonAreas.find((item) => item.id === id)!; return { ...area, available, blockReason }; },
};

const initialPublications: Publication[] = [
  { id: "pub-1", title: "Mantenimiento programado", content: "El próximo martes se realizará mantenimiento preventivo en los ascensores de las 9:00 a. m. a las 12:00 m. Agradecemos planear sus desplazamientos con anticipación.", author: "Administración", publishedAt: "Hoy, 8:30 a. m.", images: [] },
  { id: "pub-2", title: "Recordatorio de convivencia", content: "Te invitamos a cuidar las zonas comunes y a respetar los horarios establecidos para cada espacio. Entre todos construimos una comunidad más amable.", author: "Administración", publishedAt: "18 de septiembre", images: [] },
];
const initialCommonAreas: CommonArea[] = [
  { id: "salon", name: "Salón comunal", description: "Espacio para celebraciones y reuniones.", available: true, reservations: [{ id: "res-1", resident: "Laura Gómez", apartment: "Torre 2 · Apto 504", date: "22 de septiembre", time: "2:00 p. m. – 8:00 p. m.", guests: 25 }] },
  { id: "bbq", name: "Zona BBQ", description: "Espacio exterior equipado para compartir.", available: false, blockReason: "Mantenimiento de cubierta", reservations: [] },
  { id: "gimnasio", name: "Gimnasio", description: "Área de entrenamiento para residentes.", available: true, reservations: [{ id: "res-2", resident: "Daniel Rojas", apartment: "Torre 1 · Apto 302", date: "21 de septiembre", time: "6:00 a. m. – 7:00 a. m.", guests: 1 }, { id: "res-3", resident: "María Pérez", apartment: "Torre 3 · Apto 701", date: "21 de septiembre", time: "6:00 p. m. – 7:00 p. m.", guests: 1 }] },
];
