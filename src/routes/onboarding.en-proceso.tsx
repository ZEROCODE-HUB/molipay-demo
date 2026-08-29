import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell, PrimaryButton, SecondaryButton, SuccessCard } from "@/components/onboarding";
import { useOnboarding } from "@/lib/onboarding-store";

export const Route = createFileRoute("/onboarding/en-proceso")({
  head: () => ({
    meta: [
      { title: "Validacion en proceso — Molipay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EnProceso,
});

function EnProceso() {
  const nav = useNavigate();
  const { markAprobado } = useOnboarding();
  return (
    <AuthShell
      leftEyebrow="Paso 6 · Revision"
      leftTitle="Tu legajo esta en revision."
      leftBody="Nuestro equipo de compliance revisara tu informacion y te notificara al correo altas@molipay.com.ar cuando la cuenta quede habilitada."
      step="En proceso"
    >
      <SuccessCard
        variant="info"
        title="Validacion en proceso"
        body={
          <>
            <p>
              Tu informacion esta siendo validada por nuestro equipo. Este proceso puede demorar hasta{" "}
              <strong>24 horas habiles</strong>. Te avisaremos por correo cuando el proceso finalice.
            </p>
            <p className="mt-3 text-xs text-black-400">
              Si tenés algún problema,{" "}
              <a href="mailto:soporte@molipay.com.ar" className="underline underline-offset-2 hover:text-red-500">
                contactanos
              </a>
              .
            </p>
          </>
        }
      >
        <PrimaryButton onClick={() => nav({ to: "/" })}>Volver al inicio</PrimaryButton>
        <div className="flex justify-center">
          <SecondaryButton
            onClick={() => {
              markAprobado();
              nav({ to: "/app" });
            }}
          >
            Simular aprobacion (demo)
          </SecondaryButton>
        </div>
      </SuccessCard>
    </AuthShell>
  );
}
