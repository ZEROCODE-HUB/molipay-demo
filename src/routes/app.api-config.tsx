import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, BookOpen, X } from "lucide-react";
import { Card, BtnPrimary, BtnOutline } from "@/components/portal-shell";

export const Route = createFileRoute("/app/api-config")({
  head: () => ({
    meta: [
      { title: "Configuracion de APIs Externas — Molipay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
        <Link to="/app" className="hover:text-foreground transition">Inicio</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Configuracion de APIs Externas</span>
      </nav>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Configuracion de APIs Externas</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Gestione el acceso a las APIs externas de la plataforma. Para consultar la documentacion
          tecnica, visite nuestro sitio de documentacion.
        </p>
      </div>

      {/* Action card */}
      <Card className="max-w-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex-1">
            <h2 className="text-sm font-semibold">Modulo de APIs Externas</h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Este modulo le permite integrar sus sistemas con las APIs externas de Molipay.
              Actualmente no esta habilitado para su cuenta.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <a
              href="https://docs.molipay.com.ar/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 px-4 text-sm font-semibold rounded-md border bg-card hover:bg-muted transition whitespace-nowrap"
            >
              <BookOpen size={14} /> Ver documentacion
            </a>
            <BtnPrimary onClick={() => setModalOpen(true)}>
              <ExternalLink size={14} /> Solicitar habilitacion
            </BtnPrimary>
          </div>
        </div>
      </Card>

      {/* Modal de solicitud */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div
            className="relative bg-card rounded-lg max-w-md w-full p-6 shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
            <div className="mb-4 mt-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ExternalLink size={24} className="text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-base font-semibold mb-2">
              El modulo de APIs externas no esta habilitado para su cuenta.
            </h3>
            <p className="text-sm text-muted-foreground mb-6">¿Desea solicitar su habilitacion?</p>
            <div className="flex gap-3 justify-center">
              <BtnOutline onClick={() => setModalOpen(false)}>Cancelar</BtnOutline>
              <BtnPrimary
                onClick={() => {
                  window.open(
                    "https://www.molipay.com.ar/api-configuration",
                    "_blank",
                    "noopener,noreferrer",
                  );
                  setModalOpen(false);
                }}
              >
                Solicitar habilitacion
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
