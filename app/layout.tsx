import type { Metadata } from "next";
import { AppAuthBoundary } from "@/features/auth/app-auth-boundary";
import "@gestionresidencial/shared-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Administración | Habitar", template: "%s | Habitar" },
  description: "Panel de administración residencial.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <AppAuthBoundary>{children}</AppAuthBoundary>
      </body>
    </html>
  );
}
