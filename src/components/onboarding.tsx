import { useEffect, useRef, useState, type ReactNode, type InputHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Eye, EyeOff, UploadCloud, Camera, FileText, X, ShieldCheck } from "lucide-react";
import { MollyLogo } from "@/components/molly-logo";
import loginBg from "@/assets/login-hero.jpg";

/* ============ AuthShell (split-screen) ============ */

export function AuthShell({
  children,
  leftEyebrow = "MoliPay · Onboarding",
  leftTitle = "Tus datos están protegidos bajo normativa BCRA",
  leftBody,
  step,
}: {
  children: ReactNode;
  leftEyebrow?: string;
  leftTitle?: string;
  leftBody?: string;
  step?: string;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-x-hidden bg-plata-50">
      <aside className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 overflow-hidden select-none text-white">
        <div className="absolute inset-0">
          <img src={loginBg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex">
            <img src="/molly-logo.png" alt="Moli" style={{ height: 34, width: "auto", display: "block", filter: "brightness(0) invert(1)" }} />
          </Link>
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-px bg-red-400/60" />
              <span className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-red-400/80">
                {leftEyebrow}
              </span>
            </div>
            <h2 className="text-[clamp(1.5rem,2vw,2rem)] font-light leading-[1.12] tracking-tight max-w-[22ch] text-white">
              {leftTitle}
            </h2>
            {leftBody && (
              <p className="mt-5 max-w-[34ch] text-white/65 leading-relaxed text-sm">
                {leftBody}
              </p>
            )}
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2.5 px-3 py-2 border border-red-400/30 rounded-sm bg-red-500/5 backdrop-blur">
            <ShieldCheck size={13} strokeWidth={1.5} className="text-red-400" />
            <span className="font-sans text-[0.65rem] tracking-[0.1em] uppercase text-red-400">
              Registrado ante BCRA
            </span>
          </div>
          {step && (
            <p className="text-white/45 font-sans text-[0.65rem] tracking-[0.15em] uppercase">
              {step}
            </p>
          )}
          <p className="text-white/35 text-[11px]">© {new Date().getFullYear()} MoliPay</p>
        </div>
      </aside>

      <main className="flex flex-col">
        <div className="lg:hidden px-6 py-4 flex items-center justify-between bg-black text-white">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/molly-logo.png" alt="Moli" style={{ height: 26, width: "auto", display: "block", filter: "brightness(0) invert(1)" }} />
          </Link>
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center px-5 sm:px-8 py-8 lg:py-16 overflow-x-hidden">
          <div className="w-full max-w-[480px]">{children}</div>
        </div>

        <footer className="px-6 py-4 text-center text-xs text-black-400">
          ¿Necesitás ayuda?{" "}
          <a href="mailto:soporte@molipay.com.ar" className="underline underline-offset-2 hover:text-red-500 transition-colors">
            soporte@molipay.com.ar
          </a>
        </footer>
      </main>
    </div>
  );
}

/* ============ Stepper ============ */

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 text-xs font-semibold rounded-full ${
                done
                  ? "bg-success text-white"
                  : active
                  ? "bg-red-500 text-white"
                  : "bg-transparent text-black-600 border border-black-200"
              }`}
            >
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span className={`text-xs ${active ? "font-semibold text-black-800" : "text-black-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="w-6 h-px bg-black-100" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ============ Headings ============ */

export function FormTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-7">
      {eyebrow && (
        <p className="mb-2 font-sans text-[0.7rem] tracking-[0.2em] uppercase text-red-500">
          {eyebrow}
        </p>
      )}
      <h1 className="text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold leading-[1.15] text-black-800">
        {title}
      </h1>
      {subtitle && <p className="mt-3 text-sm text-black-400 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ============ Inputs ============ */

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Field({ label, error, hint, className = "", ...rest }: FieldProps) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-xs font-semibold text-black-700">{label}</span>
      <input
        {...rest}
        className={`w-full h-11 px-3 bg-white text-sm text-black-700 outline-none transition-colors rounded-sm ${
          error ? "border-red-500" : "border-black-100"
        } border focus:border-navy-500 focus:ring-2 focus:ring-navy-100 placeholder:text-black-300 ${className}`}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-black-400">{hint}</span>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Seleccioná…",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-xs font-semibold text-black-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-11 px-3 bg-white text-sm outline-none rounded-sm ${
          error ? "border-red-500" : "border-black-100"
        } border focus:border-navy-500 focus:ring-2 focus:ring-navy-100 ${
          value ? "text-black-700" : "text-black-300"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

/* ============ Password ============ */

const rules: Array<{ id: string; label: string; test: (s: string) => boolean }> = [
  { id: "len", label: "Mínimo 8 caracteres", test: (s) => s.length >= 8 },
  { id: "upper", label: "Una letra mayúscula", test: (s) => /[A-Z]/.test(s) },
  { id: "num", label: "Un número", test: (s) => /\d/.test(s) },
  { id: "special", label: "Un carácter especial (!/+-.)", test: (s) => /[!/+\-.]/.test(s) },
];

export function PasswordField({
  label,
  value,
  onChange,
  showRules = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  showRules?: boolean;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block">
        <span className="block mb-1.5 text-xs font-semibold text-black-700">{label}</span>
        <div className={`flex items-center bg-white rounded-sm border ${
          error ? "border-red-500" : "border-black-100"
        } focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-100`}>
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-11 px-3 bg-transparent text-sm outline-none text-black-700 placeholder:text-black-300"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="px-3 text-black-400 hover:text-black-700"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
      </label>
      {showRules && (
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-3">
          {rules.map((r) => {
            const ok = r.test(value);
            return (
              <li key={r.id} className={`flex items-center gap-1.5 text-[11px] ${ok ? "text-success" : "text-black-400"}`}>
                <Check size={12} />
                {r.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function validatePassword(pw: string) {
  return rules.every((r) => r.test(pw));
}

/* ============ Buttons ============ */

export function PrimaryButton({
  children,
  disabled,
  type = "button",
  onClick,
  className = "",
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-11 rounded-sm text-white text-sm font-semibold tracking-wide transition-all duration-150 ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-red-400 active:bg-red-700"
      } bg-red-500 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-11 px-5 rounded-sm text-sm font-semibold transition-colors border border-black-200 text-black-700 hover:bg-black-50"
    >
      {children}
    </button>
  );
}

export function WizardNav({
  onBack,
  nextLabel = "Siguiente",
  onNext,
  nextDisabled,
  nextType = "button",
}: {
  onBack?: () => void;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextType?: "button" | "submit";
}) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3">
      {onBack && <SecondaryButton onClick={onBack}>Atrás</SecondaryButton>}
      <div className="flex-1">
        <PrimaryButton type={nextType} onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ============ FileUpload ============ */

export function FileUpload({
  label,
  hint,
  value,
  onChange,
  accept = "image/*,application/pdf",
}: {
  label: string;
  hint?: string;
  value: { name: string; url?: string } | null | undefined;
  onChange: (f: { name: string; url: string } | null) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handle = (file: File | null) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("El archivo supera el máximo de 8 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    onChange({ name: file.name, url });
  };

  useEffect(() => {
    return () => {
      if (value?.url) URL.revokeObjectURL(value.url);
    };
  }, []);

  if (value) {
    return (
      <div>
        <span className="block mb-1.5 text-xs font-semibold text-black-700">{label}</span>
        <div className="flex items-center gap-3 bg-white px-3 py-3 rounded-sm border border-black-100">
          <FileText size={18} className="text-black-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate text-black-700">{value.name}</p>
            <p className="text-[11px] text-black-400">Archivo cargado</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs font-semibold text-black-700 hover:text-red-500 transition-colors"
          >
            Reemplazar
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-black-400 hover:text-red-500"
            aria-label="Quitar"
          >
            <X size={16} />
          </button>
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handle(e.target.files?.[0] ?? null)} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="block mb-1.5 text-xs font-semibold text-black-700">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0] ?? null); }}
        className={`w-full flex flex-col items-center justify-center gap-2 py-8 px-4 text-center transition-colors rounded-sm ${
          drag ? "border-red-500 bg-red-50/20" : "border-black-200 bg-white"
        } border-dashed border`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-black text-red-400 rounded-full">
          <Camera size={18} />
        </div>
        <span className="text-sm font-semibold text-black-700">
          <UploadCloud size={14} className="inline mr-1" />
          Arrastrá o hacé clic para subir
        </span>
        {hint && <span className="text-xs text-black-400">{hint}</span>}
        <span className="text-[10px] text-black-300 uppercase tracking-wider">JPG · PNG · PDF · máx 8MB</span>
      </button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handle(e.target.files?.[0] ?? null)} />
    </div>
  );
}

/* ============ SuccessCard ============ */

export function SuccessCard({
  title,
  body,
  children,
  variant = "success",
}: {
  title: string;
  body?: ReactNode;
  children?: ReactNode;
  variant?: "success" | "info";
}) {
  const color = variant === "success" ? "#1E8E3E" : "#324595";
  return (
    <div className="bg-white p-8 sm:p-10 text-center rounded-md border border-black-100">
      <div className="mx-auto mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ background: `${color}14`, color }}>
        <Check size={30} strokeWidth={2.5} />
      </div>
      <h1 className="text-[1.75rem] font-semibold text-black-800 leading-tight">{title}</h1>
      {body && <div className="mt-4 text-sm text-black-400 leading-relaxed">{body}</div>}
      {children && <div className="mt-8 space-y-3">{children}</div>}
    </div>
  );
}
