export type Reservation = { id: string; resident: string; apartment: string; date: string; time: string; guests: number };
export type CommonArea = { id: string; name: string; description: string; available: boolean; blockReason?: string; reservations: Reservation[] };

export const communityService = {
  async getCommonAreas(): Promise<CommonArea[]> { return initialCommonAreas; },
  async updateCommonAreaAvailability(id: string, available: boolean, blockReason?: string): Promise<CommonArea> { const area = initialCommonAreas.find((item) => item.id === id)!; return { ...area, available, blockReason }; },
};

const initialCommonAreas: CommonArea[] = [
  { id: "salon", name: "Salón comunal", description: "Espacio para celebraciones y reuniones.", available: true, reservations: [{ id: "res-1", resident: "Laura Gómez", apartment: "Torre 2 · Apto 504", date: "22 de septiembre", time: "2:00 p. m. – 8:00 p. m.", guests: 25 }] },
  { id: "bbq", name: "Zona BBQ", description: "Espacio exterior equipado para compartir.", available: false, blockReason: "Mantenimiento de cubierta", reservations: [] },
  { id: "gimnasio", name: "Gimnasio", description: "Área de entrenamiento para residentes.", available: true, reservations: [{ id: "res-2", resident: "Daniel Rojas", apartment: "Torre 1 · Apto 302", date: "21 de septiembre", time: "6:00 a. m. – 7:00 a. m.", guests: 1 }, { id: "res-3", resident: "María Pérez", apartment: "Torre 3 · Apto 701", date: "21 de septiembre", time: "6:00 p. m. – 7:00 p. m.", guests: 1 }] },
];
