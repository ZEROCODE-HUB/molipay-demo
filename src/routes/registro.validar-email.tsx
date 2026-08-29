import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell, PrimaryButton } from "@/components/onboarding";
import { useOnboarding } from "@/lib/onboarding-store";
import { MollyLogo } from "@/components/molly-logo";

export const Route = createFileRoute("/registro/validar-email")({
  head: () => ({
    meta: [
      { title: "Validar correo — MoliPay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ValidarEmail,
});

function ValidarEmail() {
  const nav = useNavigate();
  const { registro, markEmailValidado } = useOnboarding();
  const nombre = registro.nombre ?? "";

  const validar = () => {
    markEmailValidado();
    nav({ to: "/registro/validacion-exitosa" });
  };

  return (
    <AuthShell leftEyebrow="Simulación · Correo" leftTitle="Este es el email que recibirías en tu bandeja." step="Email de validación">
      <div className="bg-white overflow-hidden rounded-sm border border-black-100">
        <div className="px-6 py-4 flex items-center justify-between bg-black">
          <MollyLogo />
          <span className="text-white/60 font-sans text-[0.65rem] tracking-[0.15em] uppercase">
            altas@molipay.com.ar
          </span>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-xs text-black-400">Asunto</p>
          <p className="mt-1 mb-6 text-sm font-semibold text-black-800">Validá tu cuenta MoliPay</p>

          <div className="text-sm text-black-600 space-y-4 leading-relaxed">
            <p>Hola {nombre || "usuario"},</p>
            <p>Muchas gracias por registrarte en MoliPay. Para poder ingresar a la plataforma primero debés validar el email. Para realizarlo hacé clic acá.</p>
          </div>

          <div className="mt-8">
            <PrimaryButton onClick={validar}>Validar desde acá</PrimaryButton>
          </div>

          <p className="mt-6 text-xs text-black-400 leading-relaxed">
            Si tenés una duda o inconveniente podés contactarnos en{" "}
            <a href="mailto:soporte@molipay.com.ar" className="underline underline-offset-2 hover:text-red-500">
              soporte@molipay.com.ar
            </a>.
          </p>

          <p className="mt-4 text-sm font-semibold text-black-800">¡Muchas gracias!</p>

          <div className="mt-8 pt-4 border-t border-black-100 text-[10px] text-black-300 leading-relaxed space-y-1">
            <p>Enviado por MoliPay — Argentina</p>
            <div className="flex gap-3">
              <a href="/" className="underline underline-offset-2 hover:text-red-500">MoliPay</a>
              <a href="/legales/terminos" className="underline underline-offset-2 hover:text-red-500">Términos y condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
