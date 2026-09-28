export type Propietario = {
  userId: number;
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string | null;
};

export type PropietarioInput = {
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone?: string;
};

export type Apartamento = {
  id: number;
  torre: string;
  numero: string;
  piso: number | null;
  coeficienteCopropiedad: number | null;
  area: number | null;
  activo: boolean;
  propietario: Propietario;
  createdAt: string;
};

export type ApartamentoInput = {
  torre: string;
  numero: string;
  piso?: number | null;
  coeficienteCopropiedad?: number | null;
  area?: number | null;
  propietario: PropietarioInput;
};

export type Arrendatario = {
  arrendatarioId: number;
  apartamentoId: number;
  userId: number;
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string | null;
  tipoResidente: "ARRENDATARIO";
  vinculadoDesde: string;
};

export type ArrendatarioInput = {
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone?: string;
};

export type Vigilante = {
  userId: number;
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string | null;
  estado: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
};

export type VigilanteInput = {
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone?: string;
  initialPassword: string;
};

export type PageResult<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
