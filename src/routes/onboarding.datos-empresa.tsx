import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthShell,
  Field,
  FormTitle,
  SelectField,
  Stepper,
  WizardNav,
} from "@/components/onboarding";
import { TIPOS_SOCIEDAD, useOnboarding } from "@/lib/onboarding-store";

export const Route = createFileRoute("/onboarding/datos-empresa")({
  head: () => ({
    meta: [
      { title: "Datos de la empresa — Molipay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DatosEmpresa,
});

const STEPS = ["Datos de la empresa", "Confirmacion"];

function DatosEmpresa() {
  const nav = useNavigate();
  const { datosEmpresa, setDatosEmpresa } = useOnboarding();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    cuit: datosEmpresa.cuit ?? "",
    fechaInscripcion: datosEmpresa.fechaInscripcion ?? "",
    tipoId: datosEmpresa.tipoId ?? "",
    nombreLegal: datosEmpresa.nombreLegal ?? "",
    nombreFantasia: datosEmpresa.nombreFantasia ?? "",
  });
  const [err, setErr] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.cuit.trim()) e.cuit = "Requerido";
    if (!f.fechaInscripcion) e.fechaInscripcion = "Requerido";
    if (!f.tipoId) e.tipoId = "Requerido";
    if (!f.nombreLegal.trim()) e.nombreLegal = "Requerido";
    if (!f.nombreFantasia.trim()) e.nombreFantasia = "Requerido";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const rows = [
    ["CUIT de la empresa", f.cuit],
    ["Fecha de inscripcion", f.fechaInscripcion],
    ["Tipo de identificacion", f.tipoId],
    ["Nombre legal", f.nombreLegal],
    ["Nombre de fantasia", f.nombreFantasia],
  ];

  return (
    <AuthShell
      leftEyebrow="Paso 4 · Empresa"
      leftTitle="Carga los datos societarios."
      leftBody="Reconstituimos tu legajo con la informacion que consta en el Registro Publico de Comercio."
      step={`Paso ${step + 1} de 2`}
    >
      <FormTitle eyebrow="KYB · Empresa" title="Validacion de datos de la empresa" />
      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <div className="space-y-4">
          <Field
            label="CUIT de la empresa"
            value={f.cuit}
            onChange={(e) => setF({ ...f, cuit: e.target.value })}
            placeholder="30-12345678-9"
            className="font-mono"
            error={err.cuit}
          />
          <Field
            label="Fecha de inscripcion"
            type="date"
            value={f.fechaInscripcion}
            onChange={(e) => setF({ ...f, fechaInscripcion: e.target.value })}
            error={err.fechaInscripcion}
          />
          <SelectField
            label="Tipo de identificacion"
            value={f.tipoId}
            onChange={(v) => setF({ ...f, tipoId: v })}
            options={TIPOS_SOCIEDAD}
            error={err.tipoId}
          />
          <Field
            label="Nombre legal"
            value={f.nombreLegal}
            onChange={(e) => setF({ ...f, nombreLegal: e.target.value })}
            error={err.nombreLegal}
          />
          <Field
            label="Nombre de fantasia"
            value={f.nombreFantasia}
            onChange={(e) => setF({ ...f, nombreFantasia: e.target.value })}
            error={err.nombreFantasia}
          />
          <WizardNav
            onNext={() => {
              if (validate()) setStep(1);
            }}
            nextLabel="Siguiente"
          />
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="mb-2 text-[0.7rem] tracking-[0.2em] uppercase text-red-500">
            Resumen
          </p>
          <h2 className="mb-6 text-[1.35rem] font-semibold text-black-800">
            Confirma los datos ingresados
          </h2>
          <dl className="divide-y border-t border-b border-black-100">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-[minmax(0,140px)_1fr] gap-1 sm:gap-4 py-3 text-sm">
                <dt className="text-black-400">{k}</dt>
                <dd className="text-black-800 font-semibold">{v || "—"}</dd>
              </div>
            ))}
          </dl>
          <WizardNav
            onBack={() => setStep(0)}
            onNext={() => {
              setDatosEmpresa(f);
              nav({ to: "/onboarding/kyc" });
            }}
            nextLabel="Registrar empresa"
          />
        </div>
      )}
    </AuthShell>
  );
}
