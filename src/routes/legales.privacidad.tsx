import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MollyLogo } from "@/components/molly-logo";

export const Route = createFileRoute("/legales/privacidad")({
  head: () => ({
    meta: [
      { title: "Politica de Privacidad — Molly Money Life" },
      { name: "description", content: "Politica de privacidad y tratamiento de datos personales." },
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
      <article className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Politica de Privacidad</h1>
        <p className="text-sm text-muted-foreground mt-2">ultima actualizacion: 01/06/2026</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Responsable del tratamiento</h2>
            <p>Molly Money Life SA, CUIT 30-71000000-0, con domicilio en Av. Corrientes 1234, CABA, Argentina, es la responsable del tratamiento de los datos personales.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Datos recolectados</h2>
            <p>Recolectamos datos identificatorios de la persona juridica y de sus representantes, datos operativos de la cuenta y datos de navegacion con fines de seguridad y prevencion de fraude.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Finalidad</h2>
            <p>Los datos se utilizan para prestar el servicio, cumplir obligaciones regulatorias (Ley 25.246 de Prevencion de Lavado de Activos) y comunicaciones vinculadas al servicio.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Derechos del titular</h2>
            <p>De acuerdo con la Ley 25.326, el titular podra ejercer los derechos de acceso, rectificacion, actualizacion y supresion de sus datos escribiendo a privacidad@molly.com.ar.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Autoridad de contralor</h2>
            <p>La Agencia de Acceso a la Informacion Publica, en su caracter de organo de Control de la Ley 25.326, tiene la atribucion de atender las denuncias y reclamos.</p>
          </div>
        </section>
      </article>
    </div>
  );
}
