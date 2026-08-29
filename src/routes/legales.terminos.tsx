import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MollyLogo } from "@/components/molly-logo";

export const Route = createFileRoute("/legales/terminos")({
  head: () => ({
    meta: [
      { title: "Terminos y Condiciones — Molly Money Life" },
      { name: "description", content: "Terminos y condiciones de uso de la plataforma Molly Money Life." },
    ],
  }),
  component: Page,
});

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
      <article className="max-w-3xl mx-auto px-6 py-16 prose prose-sm">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Terminos y Condiciones</h1>
        <p className="text-sm text-muted-foreground mt-2">ultima actualizacion: 01/06/2026</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Objeto</h2>
            <p>Molly Money Life SA (en adelante "Molly") es un Proveedor de Servicios de Pago con Cuentas de Pago (PSPCP) inscripto ante el Banco Central de la Republica Argentina. Estos terminos regulan el uso de la plataforma por parte de personas juridicas.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Registro y verificacion</h2>
            <p>El titular debera completar el proceso de conocimiento del cliente (KYC/KYB) y aportar la documentacion societaria requerida.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Uso de la cuenta de pago</h2>
            <p>Los fondos depositados no constituyen depositos en una entidad financiera ni cuentan con la garantia de la Ley 24.485. Molly mantiene el 100% de los fondos de los clientes en cuentas de terceros en entidades financieras del sistema argentino.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Comisiones</h2>
            <p>Las comisiones aplicables se detallan en la <Link to="/legales/comisiones" className="text-primary underline">Tabla de Comisiones</Link>, la cual forma parte integrante de estos terminos.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Rescision</h2>
            <p>El usuario podra dar de baja la cuenta en cualquier momento a traves del <Link to="/legales/arrepentimiento" className="text-primary underline">Boton de Arrepentimiento</Link> o comunicandose con nuestro equipo.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Jurisdiccion</h2>
            <p>Para cualquier controversia se aplicara la legislacion de la Republica Argentina y seran competentes los tribunales ordinarios de la Ciudad Autonoma de Buenos Aires.</p>
          </div>
        </section>
      </article>
    </div>
  );
}
