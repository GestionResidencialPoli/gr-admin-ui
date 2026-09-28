import type { Profile } from "@gestionresidencial/shared-ui";
import { ApiClientError, apiFetch } from "@gestionresidencial/auth-client";

export type Role = "RESIDENTE" | "VIGILANTE" | "ADMINISTRACION";
export type AppUser = Profile & { roles: Role[] };

type MeResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  roles: string[];
};

function toAppUser(me: MeResponse): AppUser {
  return {
    id: String(me.id),
    name: `${me.firstName} ${me.lastName}`.trim(),
    email: me.email,
    phone: me.phone || "",
    roles: me.roles as Role[],
  };
}

export const authService = {
  async getSession(): Promise<AppUser | null> {
    try {
      return toAppUser(await apiFetch<MeResponse>("/api/v1/auth/me"));
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) return null;
      throw error;
    }
  },
  async logout(): Promise<void> {
    await apiFetch("/api/v1/auth/logout", { method: "POST" });
  },
};
