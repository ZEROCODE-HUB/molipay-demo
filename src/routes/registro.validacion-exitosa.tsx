import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell, PrimaryButton, SuccessCard } from "@/components/onboarding";

export const Route = createFileRoute("/registro/validacion-exitosa")({
  head: () => ({
    meta: [
      { title: "Correo validado — Molipay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => {
    const nav = useNavigate();
    return (
      <AuthShell leftEyebrow="Paso 2 · Verificacion" leftTitle="Tu correo quedo verificado." step="Cuenta habilitada">
        <SuccessCard title="Validacion exitosa" body={<p>Tu correo electronico ha sido validado con exito.</p>}>
          <PrimaryButton onClick={() => nav({ to: "/login", search: { register: undefined } })}>Ir a inicio de sesion</PrimaryButton>
        </SuccessCard>
      </AuthShell>
    );
  },
});
