import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { MollyLogo } from "@/components/molly-logo";
import { toast } from "sonner";

export const Route = createFileRoute("/legales/arrepentimiento")({
  head: () => ({
    meta: [
      { title: "Boton de Arrepentimiento — Molly Money Life" },
      { name: "description", content: "Ejerce tu derecho de arrepentimiento conforme al articulo 34 de la Ley 24.240." },
    ],
  }),
  component: Page,
});

function Page() {
  const [enviado, setEnviado] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <MollyLogo />
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
        </div>
      </header>
      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="w-12 h-12 rounded-lg bg-[color:var(--brand-soft)] text-primary grid place-items-center mb-4">
          <ShieldAlert size={22} />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Boton de Arrepentimiento</h1>
        <p className="text-sm text-muted-foreground mt-3">
          De acuerdo al articulo 34 de la Ley 24.240 de Defensa del Consumidor y a la Resolucion 424/2020, tenes derecho a revocar la contratacion dentro de los 10 dias corridos desde la aceptacion del servicio, sin necesidad de invocar causa y sin costo alguno.
        </p>

        {!enviado ? (
          <form
            className="mt-8 border rounded-lg p-6 space-y-4 bg-card"
            onSubmit={(e) => {
              e.preventDefault();
              setEnviado(true);
              toast.success("Solicitud de arrepentimiento enviada");
            }}
          >
            <div>
              <label className="block text-xs font-semibold mb-1">Razon social</label>
              <input required className="w-full h-10 px-3 rounded-md border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">CUIT</label>
              <input required className="w-full h-10 px-3 rounded-md border bg-background text-sm font-mono tabular-nums" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email de contacto</label>
              <input required type="email" className="w-full h-10 px-3 rounded-md border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Motivo (opcional)</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-md border bg-background text-sm" />
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm"
            >
              Enviar solicitud de arrepentimiento
            </button>
            <p className="text-[11px] text-muted-foreground">
              Molly procesara tu solicitud dentro de las 48 hs habiles y te enviara confirmacion por email.
            </p>
          </form>
        ) : (
          <div className="mt-8 border rounded-lg p-6 bg-emerald-50 text-emerald-900 text-sm">
            Recibimos tu solicitud. Un representante se contactara dentro de las proximas 48 hs habiles.
          </div>
        )}
      </article>
    </div>
  );
}
