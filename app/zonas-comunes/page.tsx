import { AppRedirect } from "@/features/apps/app-redirect";
import { bookingUiUrl } from "@/lib/booking-ui-url";

export default function ZonasComunesPage() {
  return <AppRedirect targetOrigin={bookingUiUrl()} label="Abriendo zonas comunes" />;
}
