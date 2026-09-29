import { AppRedirect } from "@/features/apps/app-redirect";
import { billingUiUrl } from "@/lib/billing-ui-url";

export default function FinanzasPage() {
  return <AppRedirect targetOrigin={billingUiUrl()} label="Abriendo finanzas" />;
}
