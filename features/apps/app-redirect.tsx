"use client";

import { useEffect } from "react";
import { Skeleton } from "@gestionresidencial/shared-ui";
import { initiateSsoHandoff } from "@gestionresidencial/auth-client";

export function AppRedirect({ targetOrigin, label }: { targetOrigin: string; label: string }) {
  useEffect(() => {
    initiateSsoHandoff("admin", targetOrigin).then();
  }, [targetOrigin]);

  return (
    <div className="standalone-state">
      <Skeleton label={label} />
    </div>
  );
}
