"use client";

import { useEffect } from "react";
import { Skeleton } from "@gestionresidencial/shared-ui";
import { initiateSsoHandoff } from "@gestionresidencial/auth-client";
import { wallUiUrl } from "@/lib/wall-ui-url";

export function WallRedirect() {
  useEffect(() => {
    initiateSsoHandoff("admin", wallUiUrl()).then();
  }, []);

  return (
    <div className="standalone-state">
      <Skeleton label="Abriendo el muro" />
    </div>
  );
}
