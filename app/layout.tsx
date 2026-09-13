import type { Metadata } from "next";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";
import { AuthProvider } from "@/features/auth/auth-provider";
import "@gr/shared-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Administración | Habitar", template: "%s | Habitar" },
  description: "Panel de administración residencial.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <AuthenticatedShell>{children}</AuthenticatedShell>
        </AuthProvider>
      </body>
    </html>
  );
}
