import { apiFetch } from "@gestionresidencial/auth-client";
import type {
  Apartamento,
  ApartamentoInput,
  Arrendatario,
  ArrendatarioInput,
  PageResult,
  Vigilante,
  VigilanteInput,
} from "./identity-types";

const APARTAMENTOS_PATH = "/api/v1/apartamentos";
const VIGILANTES_PATH = "/api/v1/vigilantes";

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export async function listApartamentos(params: {
  torre?: string;
  numero?: string;
  page?: number;
  size?: number;
}): Promise<PageResult<Apartamento>> {
  return apiFetch<PageResult<Apartamento>>(`${APARTAMENTOS_PATH}${query({ ...params, size: params.size ?? 20 })}`);
}

export async function getApartamento(id: number): Promise<Apartamento> {
  return apiFetch<Apartamento>(`${APARTAMENTOS_PATH}/${id}`);
}

export async function createApartamento(input: ApartamentoInput): Promise<Apartamento> {
  return apiFetch<Apartamento>(APARTAMENTOS_PATH, { method: "POST", body: input });
}

export async function updateApartamento(id: number, input: ApartamentoInput): Promise<Apartamento> {
  return apiFetch<Apartamento>(`${APARTAMENTOS_PATH}/${id}`, { method: "PUT", body: input });
}

export async function deactivateApartamento(id: number): Promise<void> {
  await apiFetch(`${APARTAMENTOS_PATH}/${id}`, { method: "DELETE" });
}

export async function listArrendatarios(apartamentoId: number): Promise<Arrendatario[]> {
  return apiFetch<Arrendatario[]>(`${APARTAMENTOS_PATH}/${apartamentoId}/arrendatarios`);
}

export async function linkArrendatario(
  apartamentoId: number,
  input: ArrendatarioInput,
): Promise<Arrendatario> {
  return apiFetch<Arrendatario>(`${APARTAMENTOS_PATH}/${apartamentoId}/arrendatarios`, {
    method: "POST",
    body: input,
  });
}

export async function unlinkArrendatario(apartamentoId: number, arrendatarioId: number): Promise<void> {
  await apiFetch(`${APARTAMENTOS_PATH}/${apartamentoId}/arrendatarios/${arrendatarioId}`, {
    method: "DELETE",
  });
}

export async function listVigilantes(): Promise<Vigilante[]> {
  return apiFetch<Vigilante[]>(VIGILANTES_PATH);
}

export async function createVigilante(input: VigilanteInput): Promise<Vigilante> {
  return apiFetch<Vigilante>(VIGILANTES_PATH, { method: "POST", body: input });
}

export async function deactivateVigilante(userId: number): Promise<void> {
  await apiFetch(`${VIGILANTES_PATH}/${userId}`, { method: "DELETE" });
}
