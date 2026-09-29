import type { NextConfig } from "next";

// En local todas las interfaces deben hablar con el gateway; los microservicios
// internos no son orígenes públicos del navegador.
const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  // @gestionresidencial/shared-ui se distribuye construido (ESM + tipos en
  // dist/), no necesita transpilarse. Ver ADR-002 y GR-134 en gr-common-ui.
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${backendApiUrl}/api/v1/:path*` }];
  },
  async headers() {
    return [
      {
        source: "/auth/sso/callback",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default nextConfig;
