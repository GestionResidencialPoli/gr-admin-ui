"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  DOCUMENT_PATTERN,
  EMAIL_PATTERN,
  Feedback,
  PERSON_NAME_PATTERN,
  PHONE_PATTERN,
  TextField,
  UNIT_CODE_PATTERN,
} from "@gestionresidencial/shared-ui";
import { errorMessage } from "@/lib/error-message";
import type { Apartamento, ApartamentoInput } from "@/lib/identity-types";

export function ApartamentoForm({
  initial,
  onSubmit,
  submitLabel,
  pendingLabel,
}: {
  initial?: Apartamento;
  onSubmit: (input: ApartamentoInput) => Promise<void>;
  submitLabel: string;
  pendingLabel: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);

    const data = new FormData(event.currentTarget);
    const piso = String(data.get("piso") || "").trim();
    const coeficiente = String(data.get("coeficienteCopropiedad") || "").trim();
    const area = String(data.get("area") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    const input: ApartamentoInput = {
      torre: String(data.get("torre") || "").trim(),
      numero: String(data.get("numero") || "").trim(),
      piso: piso ? Number(piso) : null,
      coeficienteCopropiedad: coeficiente ? Number(coeficiente) : null,
      area: area ? Number(area) : null,
      propietario: {
        firstName: String(data.get("firstName") || "").trim(),
        lastName: String(data.get("lastName") || "").trim(),
        documentNumber: String(data.get("documentNumber") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: phone || undefined,
      },
    };

    try {
      await onSubmit(input);
    } catch (caughtError) {
      setError(errorMessage(caughtError, "No se pudo guardar el apartamento."));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="gr-form" onSubmit={handleSubmit}>
      <div className="gr-ingreso-fila">
        <TextField
          id="torre"
          name="torre"
          label="Torre"
          defaultValue={initial?.torre}
          required
          maxLength={20}
          pattern={UNIT_CODE_PATTERN}
          title="Letras, dígitos o guiones."
          disabled={pending}
        />
        <TextField
          id="numero"
          name="numero"
          label="Número"
          defaultValue={initial?.numero}
          required
          maxLength={20}
          pattern={UNIT_CODE_PATTERN}
          title="Letras, dígitos o guiones."
          disabled={pending}
        />
      </div>
      <div className="gr-ingreso-fila">
        <TextField
          id="piso"
          name="piso"
          label="Piso (opcional)"
          type="number"
          min={0}
          max={200}
          defaultValue={initial?.piso ?? ""}
          disabled={pending}
        />
        <TextField
          id="coeficienteCopropiedad"
          name="coeficienteCopropiedad"
          label="Coeficiente de copropiedad (opcional)"
          type="number"
          min={0.0001}
          max={1}
          step={0.0001}
          defaultValue={initial?.coeficienteCopropiedad ?? ""}
          disabled={pending}
        />
      </div>
      <TextField
        id="area"
        name="area"
        label="Área en m² (opcional)"
        type="number"
        min={0.01}
        step={0.01}
        defaultValue={initial?.area ?? ""}
        disabled={pending}
      />

      <h2>Propietario</h2>
      <div className="gr-ingreso-fila">
        <TextField
          id="firstName"
          name="firstName"
          label="Nombres"
          defaultValue={initial?.propietario.firstName}
          required
          maxLength={100}
          pattern={PERSON_NAME_PATTERN}
          title="Solo letras, espacios, apóstrofos, puntos y guiones."
          disabled={pending}
        />
        <TextField
          id="lastName"
          name="lastName"
          label="Apellidos"
          defaultValue={initial?.propietario.lastName}
          required
          maxLength={100}
          pattern={PERSON_NAME_PATTERN}
          title="Solo letras, espacios, apóstrofos, puntos y guiones."
          disabled={pending}
        />
      </div>
      <TextField
        id="documentNumber"
        name="documentNumber"
        label="Documento de identidad"
        defaultValue={initial?.propietario.documentNumber}
        required
        maxLength={30}
        pattern={DOCUMENT_PATTERN}
        title="Entre 4 y 30 letras, dígitos o guiones."
        disabled={pending}
      />
      <TextField
        id="email"
        name="email"
        label="Correo"
        type="email"
        defaultValue={initial?.propietario.email}
        required
        maxLength={254}
        pattern={EMAIL_PATTERN}
        disabled={pending}
      />
      <TextField
        id="phone"
        name="phone"
        label="Teléfono (opcional)"
        type="tel"
        defaultValue={initial?.propietario.phone ?? ""}
        maxLength={30}
        pattern={PHONE_PATTERN}
        title="Celular (3xxxxxxxxx) o fijo nacional (60xxxxxxxx)."
        disabled={pending}
      />

      {error && <Feedback error>{error}</Feedback>}
      <div className="gr-form-actions">
        <Button type="submit" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
