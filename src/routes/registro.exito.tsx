import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, PrimaryButton, SecondaryButton, SuccessCard } from "@/components/onboarding";
import { useOnboarding } from "@/lib/onboarding-store";

export const Route = createFileRoute("/registro/exito")({
  head: () => ({
    meta: [
      { title: "Registro exitoso — Molipay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegistroExito,
});

function RegistroExito() {
  const nav = useNavigate();
  const { registro } = useOnboarding();
  return (
    <AuthShell leftEyebrow="Paso 2 · Verificacion" leftTitle="Confirma tu correo para continuar." step="Correo enviado">
      <SuccessCard
        title="Registro exitoso"
        body={
          <>
            <p>
              Enviamos un correo a{" "}
              <span className="font-semibold text-black-800">{registro.email ?? "tu email"}</span>. Revisá tu bandeja para validar la cuenta.
            </p>
            <p className="mt-3 text-xs text-black-400">
              Si no lo recibís, revisá spam o{" "}
              <button
                type="button"
                onClick={() => alert("Correo reenviado (demo)")}
                className="underline underline-offset-2 hover:text-red-500"
              >
                reenviá el correo
              </button>
              . ¿Tenés un problema?{" "}
              <Link to="/" className="underline underline-offset-2 hover:text-red-500">
                Contactanos
              </Link>
              .
            </p>
          </>
        }
      >
        <PrimaryButton onClick={() => nav({ to: "/login", search: { register: undefined } })}>Ir a inicio de sesion</PrimaryButton>
        <div className="flex justify-center">
          <SecondaryButton onClick={() => nav({ to: "/registro/validar-email" })}>
            Ver email de validacion (demo)
          </SecondaryButton>
        </div>
      </SuccessCard>
    </AuthShell>
  );
}
