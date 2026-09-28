import { AppRedirect } from "@/features/apps/app-redirect";
import { gateUiUrl } from "@/lib/gate-ui-url";

export default function PorteriaPage() {
  return <AppRedirect targetOrigin={gateUiUrl()} label="Abriendo portería" />;
}
