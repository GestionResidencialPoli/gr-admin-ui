import { AppRedirect } from "@/features/apps/app-redirect";
import { wallUiUrl } from "@/lib/wall-ui-url";

export default function DashboardPage() {
  return <AppRedirect targetOrigin={wallUiUrl()} label="Abriendo el muro" />;
}
