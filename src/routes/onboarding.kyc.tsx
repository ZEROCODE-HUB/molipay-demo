import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthShell,
  Field,
  FileUpload,
  FormTitle,
  SelectField,
  Stepper,
  WizardNav,
} from "@/components/onboarding";
import { PROVINCIAS, useOnboarding, type FileRef } from "@/lib/onboarding-store";

export const Route = createFileRoute("/onboarding/kyc")({
  head: () => ({
    meta: [
      { title: "Validacion KYC — Molipay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KycWizard,
});

const STEPS = ["DNI", "Servicio", "Selfie", "Residencia"];

function KycWizard() {
  const nav = useNavigate();
  const { kyc, setKyc } = useOnboarding();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ dniFrente: FileRef; dniDorso: FileRef; servicio: FileRef; selfie: FileRef }>({
    dniFrente: null,
    dniDorso: null,
    servicio: null,
    selfie: null,
  });
  const [addr, setAddr] = useState({
    direccion: kyc.direccion ?? "",
    direccion2: kyc.direccion2 ?? "",
    ciudad: kyc.ciudad ?? "",
    provincia: kyc.provincia ?? "",
    cp: kyc.cp ?? "",
  });
  const [err, setErr] = useState<Record<string, string>>({});

  const canNext =
    (step === 0 && files.dniFrente && files.dniDorso) ||
    (step === 1 && files.servicio) ||
    (step === 2 && files.selfie) ||
    step === 3;

  const finish = () => {
    const e: Record<string, string> = {};
    if (!addr.direccion.trim()) e.direccion = "Requerido";
    if (!addr.ciudad.trim()) e.ciudad = "Requerido";
    if (!addr.provincia) e.provincia = "Requerido";
    if (!addr.cp.trim()) e.cp = "Requerido";
    setErr(e);
    if (Object.keys(e).length) return;
    setKyc(addr);
    nav({ to: "/onboarding/en-proceso" });
  };

  return (
    <AuthShell
      leftEyebrow="Paso 5 · Verificacion de identidad"
      leftTitle="Validamos tu identidad de forma segura."
      leftBody="Tus documentos se procesan en un entorno cifrado y se conservan segun normativa BCRA y Ley 25.246."
      step={`Paso ${step + 1} de 4`}
    >
      <FormTitle eyebrow="KYC · Documentacion" title="Validacion KYC" />
      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black-800">Cargá el DNI frente y dorso</h2>
          <FileUpload
            label="DNI frente"
            value={files.dniFrente}
            onChange={(v) => setFiles({ ...files, dniFrente: v })}
          />
          <FileUpload
            label="DNI dorso"
            value={files.dniDorso}
            onChange={(v) => setFiles({ ...files, dniDorso: v })}
          />
          <WizardNav onNext={() => setStep(1)} nextDisabled={!canNext} nextLabel="Siguiente" />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black-800">Cargá un servicio a tu nombre</h2>
          <FileUpload
            label="Factura de servicio"
            hint="Debe contener tu direccion y no debe tener mas de 3 meses de antigüedad."
            value={files.servicio}
            onChange={(v) => setFiles({ ...files, servicio: v })}
          />
          <WizardNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canNext} nextLabel="Siguiente" />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black-800">Cargá una selfie</h2>
          <FileUpload
            label="Selfie"
            hint="De frente, en un lugar bien iluminado, sin anteojos ni sombreros."
            value={files.selfie}
            onChange={(v) => setFiles({ ...files, selfie: v })}
            accept="image/*"
          />
          <WizardNav onBack={() => setStep(1)} onNext={() => setStep(3)} nextDisabled={!canNext} nextLabel="Siguiente" />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black-800">Domicilio de residencia</h2>
          <Field
            label="Direccion"
            value={addr.direccion}
            onChange={(e) => setAddr({ ...addr, direccion: e.target.value })}
            error={err.direccion}
          />
          <Field
            label="Direccion (opcional)"
            value={addr.direccion2}
            onChange={(e) => setAddr({ ...addr, direccion2: e.target.value })}
            placeholder="Piso, departamento, referencia"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Ciudad"
              value={addr.ciudad}
              onChange={(e) => setAddr({ ...addr, ciudad: e.target.value })}
              error={err.ciudad}
            />
            <SelectField
              label="Provincia"
              value={addr.provincia}
              onChange={(v) => setAddr({ ...addr, provincia: v })}
              options={PROVINCIAS}
              error={err.provincia}
            />
          </div>
          <Field
            label="Codigo postal"
            value={addr.cp}
            onChange={(e) => setAddr({ ...addr, cp: e.target.value })}
            error={err.cp}
          />
          <WizardNav onBack={() => setStep(2)} onNext={finish} nextLabel="Finalizar" />
        </div>
      )}
    </AuthShell>
  );
}
