import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { MollyLogo } from "@/components/molly-logo";
import { useDemoMode } from "@/contexts/demo-mode";
import { useOnboarding, type TipoCuenta } from "@/lib/onboarding-store";
import { AuthShell, Field, PasswordField, PrimaryButton, validatePassword } from "@/components/onboarding";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, string | undefined>) => ({
    register: search.register as "pf" | "pj" | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Ingresar — MoliPay" },
      { name: "description", content: "Accede al portal de MoliPay. Plataforma de pagos digitales bajo normativa BCRA." },
    ],
  }),
  component: LoginPage,
});

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSuccess();
      }}
    >
      <Field label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hola@empresa.com" />
      <PasswordField label="Contraseña" value={pw} onChange={setPw} />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => alert("Flujo de recuperación de contraseña (demo)")}
          className="text-xs text-black-400 hover:text-red-500 underline underline-offset-2 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      <div className="pt-1">
        <PrimaryButton type="submit">Iniciar sesión</PrimaryButton>
      </div>
      <div className="text-center text-xs text-black-400 space-y-2 pt-2">
        <p>
          ¿No tienes una cuenta?{" "}
          <Link to="/login" search={{ register: "pf" }} className="text-red-500 underline underline-offset-2 hover:opacity-80">
            Registrate
          </Link>
        </p>
        <p>
          <button
            type="button"
            onClick={() => alert("Correo reenviado (demo)")}
            className="text-black-400 hover:text-red-500 underline underline-offset-2 transition-colors"
          >
            ¿No te llegó el email de verificación?
          </button>
        </p>
      </div>
    </form>
  );
}

function RegisterForm({
  tipo,
  onSuccess,
  onSwitchToLogin,
}: {
  tipo: TipoCuenta;
  onSuccess: (data: { nombre: string; apellido: string; fechaNac: string; email: string }) => void;
  onSwitchToLogin?: () => void;
}) {
  const [f, setF] = useState({ nombre: "", apellido: "", fechaNac: "", email: "", pw: "", pw2: "" });
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const pwOk = validatePassword(f.pw);
  const pwMatch = f.pw && f.pw === f.pw2;
  const valid = f.nombre && f.apellido && f.fechaNac && emailOk && pwOk && pwMatch && terms;

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!valid) return;
        onSuccess({ nombre: f.nombre, apellido: f.apellido, fechaNac: f.fechaNac, email: f.email });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} error={touched && !f.nombre ? "Requerido" : undefined} />
        <Field label="Apellido" value={f.apellido} onChange={(e) => setF({ ...f, apellido: e.target.value })} error={touched && !f.apellido ? "Requerido" : undefined} />
      </div>
      <Field label="Fecha de nacimiento" type="date" value={f.fechaNac} onChange={(e) => setF({ ...f, fechaNac: e.target.value })} error={touched && !f.fechaNac ? "Requerido" : undefined} />
      <Field label="Correo electrónico" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="nombre@dominio.com" error={touched && !emailOk ? "Ingresá un email válido" : undefined} />
      <PasswordField label="Contraseña" value={f.pw} onChange={(v) => setF({ ...f, pw: v })} showRules error={touched && !pwOk ? "La contraseña no cumple los requisitos" : undefined} />
      <PasswordField label="Confirmar contraseña" value={f.pw2} onChange={(v) => setF({ ...f, pw2: v })} error={touched && !pwMatch ? "Las contraseñas no coinciden" : undefined} />

      <label className="flex items-start gap-2.5 text-xs text-black-500 pt-1">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 accent-red-500" />
        <span>
          He leído y acepto los{" "}
          <a href="/legales/terminos" className="underline underline-offset-2 hover:text-red-500">
            Términos y Condiciones
          </a>.
        </span>
      </label>

      <div className="pt-1">
        <PrimaryButton type="submit" disabled={!valid}>Registrarse</PrimaryButton>
      </div>

      <div className="text-center text-xs text-black-400 space-y-2 pt-2">
        <p>
          ¿Ya tenés una cuenta?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-red-500 underline underline-offset-2 hover:opacity-80">
            Iniciá sesión
          </button>
        </p>
        <p>
          {tipo === "juridica" ? (
            <Link to="/login" search={{ register: "pf" }} className="text-black-400 hover:text-red-500 underline underline-offset-2 transition-colors">
              ¿Sos persona física? Registrate como persona física
            </Link>
          ) : (
            <Link to="/login" search={{ register: "pj" }} className="text-black-400 hover:text-red-500 underline underline-offset-2 transition-colors">
              ¿Querés registrar tu empresa? Registrar empresa
            </Link>
          )}
        </p>
      </div>
    </form>
  );
}

function LoginPage() {
  const search = Route.useSearch();
  const register = search.register;
  const [tab, setTab] = useState<"login" | "register">(register ? "register" : "login");
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>(register === "pj" ? "juridica" : "fisica");
  const { setRole } = useDemoMode();
  const store = useOnboarding();
  const navigate = useNavigate();

  const enterAs = () => {
    setRole("empresa");
    store.setTipo(store.tipoCuenta ?? "juridica");
    if (!store.emailValidado) {
      navigate({ to: "/registro/exito" });
    } else if (!store.aprobado) {
      const dp = store.datosPersonales;
      if (!dp.genero || !dp.cuitCuil || !dp.ocupacion) {
        navigate({ to: "/onboarding/datos-personales" });
      } else if (store.tipoCuenta === "juridica") {
        const de = store.datosEmpresa;
        if (!de.cuit || !de.nombreLegal) {
          navigate({ to: "/onboarding/datos-empresa" });
        } else if (!store.kyc.direccion) {
          navigate({ to: "/onboarding/kyc" });
        } else {
          navigate({ to: "/onboarding/en-proceso" });
        }
      } else if (!store.kyc.direccion) {
        navigate({ to: "/onboarding/kyc" });
      } else {
        navigate({ to: "/onboarding/en-proceso" });
      }
    } else {
      navigate({ to: "/app" });
    }
  };

  const handleRegisterSuccess = (data: { nombre: string; apellido: string; fechaNac: string; email: string }) => {
    store.reset();
    store.setTipo(tipoCuenta);
    store.setRegistro(data);
    navigate({ to: "/registro/exito" });
  };

  return (
    <AuthShell
      leftEyebrow="MoliPay · Acceso"
      leftTitle="Tu plataforma de pagos, sin intermediarios."
      leftBody="MoliPay opera bajo normativa BCRA. Tus datos viajan cifrados y se almacenan bajo los estándares del sistema financiero argentino."
    >
      <div className="grid grid-cols-2 border-b border-black-100 mb-8">
        <button
          onClick={() => setTab("login")}
          className={`pb-3 text-sm font-semibold transition-colors ${
            tab === "login" ? "border-b-2 border-red-500 text-black-800" : "text-black-400"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => setTab("register")}
          className={`pb-3 text-sm font-semibold transition-colors ${
            tab === "register" ? "border-b-2 border-red-500 text-black-800" : "text-black-400"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      {tab === "register" && (
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setTipoCuenta("fisica")}
            className={`flex-1 h-11 text-xs font-semibold tracking-wide transition-all rounded-sm ${
              tipoCuenta === "fisica"
                ? "bg-black text-white"
                : "bg-white text-black-400 border border-black-100"
            }`}
          >
            Persona Física
          </button>
          <button
            type="button"
            onClick={() => setTipoCuenta("juridica")}
            className={`flex-1 h-11 text-xs font-semibold tracking-wide transition-all rounded-sm ${
              tipoCuenta === "juridica"
                ? "bg-black text-white"
                : "bg-white text-black-400 border border-black-100"
            }`}
          >
            Persona Jurídica
          </button>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="transition-all duration-300 ease-in-out">
          {tab === "login" ? (
            <LoginForm onSuccess={enterAs} />
          ) : (
            <RegisterForm tipo={tipoCuenta} onSuccess={handleRegisterSuccess} onSwitchToLogin={() => setTab("login")} />
          )}
        </div>
      </div>

      {tab === "login" && (
        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black-100" /></div>
            <div className="relative flex justify-center">
              <span className="bg-plata-50 px-3 text-xs text-black-400 uppercase tracking-wide">Acceso demo</span>
            </div>
          </div>
          <button
            onClick={() => { setRole("empresa"); navigate({ to: "/app" }); }}
            className="w-full mt-5 h-11 rounded-sm text-sm font-semibold text-black-700 border border-black-200 bg-white hover:bg-black-50 transition-colors"
          >
            Demo empresa
          </button>
        </div>
      )}
    </AuthShell>
  );
}
