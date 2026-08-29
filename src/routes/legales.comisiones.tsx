import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MollyLogo } from "@/components/molly-logo";

export const Route = createFileRoute("/legales/comisiones")({
  head: () => ({
    meta: [
      { title: "Tabla de Comisiones — Molly Money Life" },
      { name: "description", content: "Detalle de comisiones y aranceles vigentes de la plataforma." },
    ],
  }),
  component: Page,
});

const filas = [
  { op: "Transferencias entre cuentas Molly", com: "Sin cargo" },
  { op: "Transferencias inmediatas a CBU/CVU (hasta $ 500.000)", com: "Sin cargo" },
  { op: "Transferencias inmediatas a CBU/CVU (mas de $ 500.000)", com: "0,30% + IVA" },
  { op: "Cobros con QR", com: "0,80% + IVA por operacion" },
  { op: "Link de pago (debito / credito)", com: "1,90% + IVA por operacion" },
  { op: "Cobros masivos por lote", com: "$ 45 + IVA por acreditacion" },
  { op: "Pago de servicios", com: "Sin cargo" },
  { op: "Alta de subcuenta con CBU propio", com: "Sin cargo" },
  { op: "Emision de constancia de CBU", com: "Sin cargo" },
];

function Page() {
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
      <article className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Tabla de Comisiones</h1>
        <p className="text-sm text-muted-foreground mt-2">Vigente desde 01/06/2026 · Aplicable al Plan Empresa.</p>

        <div className="mt-8 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Operacion</th>
                <th className="text-right px-4 py-3">Comision</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.op} className="border-t">
                  <td className="px-4 py-3">{f.op}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-right font-semibold whitespace-nowrap">{f.com}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Todas las comisiones estan expresadas en pesos argentinos. IVA no incluido salvo indicacion contraria. Los aranceles pueden modificarse con un preaviso minimo de 60 dias conforme normativa BCRA.
        </p>
      </article>
    </div>
  );
}
