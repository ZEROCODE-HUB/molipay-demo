// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vercel define VERCEL=1 en su entorno de build. En Lovable (sandbox o
// producción) esa variable no existe, así que seguimos usando el worker de
// Cloudflare por defecto. El sandbox de Lovable fuerza cloudflare-module
// internamente, por lo que este override solo afecta a Vercel.
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  // Desplegar en Vercel: Nitro genera funciones serverless (Build Output API)
  // en vez del worker de Cloudflare, que es el default y causa 404 al servir
  // los estáticos (la app es SSR y no tiene index.html).
  nitro: { preset: isVercel ? "vercel" : "cloudflare-module" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    router: {
      // Ignore all admin route files — they remain on disk for the future clone
      routeFileIgnorePattern: "^admin",
    },
  },
});
