import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowUpRight, Calendar, Clock, ShieldCheck, Star, Trash2, Edit3, Play, FileText, Save, Users, X, Plus, KeyRound } from "lucide-react";
import { PageHeader, Input, Label, BtnPrimary, BtnOutline, Badge } from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";

export const Route = createFileRoute("/app/transferencias")({ component: Page });

type Tab = "unica" | "programar" | "borradores" | "programadas" | "destinatarios";

type Draft = { id: string; destinatario: string; alias: string; monto: string; concepto: string; ref: string; fecha: string };
type Scheduled = { id: string; destinatario: string; alias: string; monto: string; fecha: string; hora: string; estado: string; concepto: string };
type CoelsaResult = { nombre: string; cuit: string; cbu: string; alias: string };
type Destinatario = CoelsaResult & { banco: string };

const draftsMock: Draft[] = [
  { id: "d1", destinatario: "Proveedor SA", alias: "proveedor.sa", monto: "$ 220.000", concepto: "Pago a proveedor", ref: "Factura 0034", fecha: "08/07/2026" },
  { id: "d2", destinatario: "Estudio Rios", alias: "rios.contable", monto: "$ 145.000", concepto: "Honorarios", ref: "Abril 2026", fecha: "07/07/2026" },
];

const scheduledMock: Scheduled[] = [
  { id: "s1", destinatario: "Sueldos Mayo", alias: "sueldos.empresa", monto: "$ 4.820.000", fecha: "10/07/2026", hora: "09:00", estado: "Programada", concepto: "Sueldos" },
  { id: "s2", destinatario: "Proveedor SA", alias: "proveedor.sa", monto: "$ 220.000", fecha: "15/07/2026", hora: "14:30", estado: "Programada", concepto: "Pago a proveedor" },
  { id: "s3", destinatario: "Estudio Rios", alias: "rios.contable", monto: "$ 145.000", fecha: "12/07/2026", hora: "10:00", estado: "Recurrente", concepto: "Honorarios" },
];

const destinatariosMock: Destinatario[] = [
  { nombre: "Proveedor SA", cuit: "30-12345678-9", cbu: "0000003100099887766112", alias: "proveedor.sa", banco: "Banco Galicia" },
  { nombre: "Estudio Rios", cuit: "30-87654321-0", cbu: "0000003200099887766223", alias: "rios.contable", banco: "Banco Nacion" },
  { nombre: "Servicios Generales", cuit: "30-11122333-4", cbu: "0000003300099887766334", alias: "serv.generales", banco: "Banco Macro" },
  { nombre: "Juan Perez", cuit: "20-22333444-5", cbu: "0000003400099887766445", alias: "juanperez.mp", banco: "Mercado Pago" },
  { nombre: "Maria Lopez", cuit: "27-33444555-6", cbu: "0000003500099887766556", alias: "mlopez.cv", banco: "Banco Santander" },
];

const qelsaMock: CoelsaResult[] = [
  { nombre: "Proveedor SA", cuit: "30-12345678-9", cbu: "0000003100099887766112", alias: "proveedor.sa" },
  { nombre: "Estudio Rios", cuit: "30-87654321-0", cbu: "0000003200099887766223", alias: "rios.contable" },
  { nombre: "Servicios Generales", cuit: "30-11122333-4", cbu: "0000003300099887766334", alias: "serv.generales" },
  { nombre: "Juan Perez", cuit: "20-22333444-5", cbu: "0000003400099887766445", alias: "juanperez.mp" },
  { nombre: "Maria Lopez", cuit: "27-33444555-6", cbu: "0000003500099887766556", alias: "mlopez.cv" },
  { nombre: "Electro SA", cuit: "30-44555666-7", cbu: "0000003600099887766667", alias: "electro.sa" },
  { nombre: "Transportes Rapidos", cuit: "30-55666777-8", cbu: "0000003700099887766778", alias: "trans.rapidos" },
];

function Page() {
  const [tab, setTab] = useState<Tab>("unica");
  const [confirm, setConfirm] = useState(false);
  const [destAlias, setDestAlias] = useState("");
  const [saveDestOpen, setSaveDestOpen] = useState(false);
  const [prefilledDestinatario, setPrefilledDestinatario] = useState<CoelsaResult | undefined>(undefined);
  const [plantillaOpen, setPlantillaOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(draftsMock);
  const [scheduled, setScheduled] = useState<Scheduled[]>(scheduledMock);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState<{
    tipo: "borrador" | "programada";
    id: string;
  } | null>(null);

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  };

  const openOtp = () => {
    resetOtp();
    setOtpOpen(true);
  };

  const confirmWithOtp = () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setOtpOpen(false);
    setConfirm(false);
    toast.success("Transferencia enviada");
    setDestAlias("proveedor.sa");
    setSaveDestOpen(true);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "unica", label: "Transferencia unica" },
    { key: "programar", label: "Programar" },
    { key: "borradores", label: "Borradores" },
    { key: "programadas", label: "Transferencias programadas" },
    { key: "destinatarios", label: "Destinatarios frecuentes" },
  ];

  return (
    <>
      <PageHeader
        title="Transferir"
        description="Envios inmediatos, programados y a CBU, CVU o alias."
        action={<BtnOutline onClick={() => setPlantillaOpen(true)}><FileText size={14} /> Plantillas</BtnOutline>}
      />

      {/* Stats compactas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Disponible hoy</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">$ 12.479.330</div>
          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">Operativa + subcuentas</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Enviado este mes</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">$ 28.4M</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">142 operaciones</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Programadas</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">3</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">$ 5.185.000 proximos</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Limite diario</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">$ 25M</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">73% utilizado</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border rounded-lg mb-6 overflow-hidden">
        <div className="flex gap-0 border-b overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "unica" && (
            <Unica
              confirm={confirm}
              setConfirm={setConfirm}
              onOtpRequired={openOtp}
              onSaveDraft={(d) => {
                setDrafts((prev) => [...prev, d]);
                toast.success("Borrador guardado");
              }}
              onSaveTemplate={() => {
                toast.success("Plantilla guardada");
              }}
              prefilledDestinatario={prefilledDestinatario}
              onClearPrefill={() => setPrefilledDestinatario(undefined)}
            />
          )}
          {tab === "programar" && (
            <Programar
              onSuccess={() => {
                const newSched: Scheduled = {
                  id: `s${Date.now()}`,
                  destinatario: "Nueva transferencia",
                  alias: "alias.ejemplo",
                  monto: "$ 0",
                  fecha: "12/07/2026",
                  hora: "10:00",
                  estado: "Programada",
                  concepto: "Pago",
                };
                setScheduled((prev) => [...prev, newSched]);
                toast.success("Transferencia programada");
                setTab("programadas");
              }}
            />
          )}
          {tab === "borradores" && (
            <Borradores
              drafts={drafts}
              onDelete={(id) => setConfirmarEliminacion({ tipo: "borrador", id })}
              onEdit={(id) => {
                setTab("unica");
                toast.success("Borrador cargado en el formulario");
              }}
              onExecute={(id) => {
                toast.success("Transferencia enviada desde borrador");
              }}
            />
          )}
          {tab === "programadas" && (
            <Programadas
              items={scheduled}
              onCancel={(id) => setConfirmarEliminacion({ tipo: "programada", id })}
              onEdit={(id) => toast.success("Editando transferencia programada")}
              onExecute={(id) => toast.success("Transferencia ejecutada")}
            />
          )}
          {tab === "destinatarios" && (
            <DestinatariosList onSelect={(d) => {
              setPrefilledDestinatario(d);
              setTab("unica");
              toast.success("Destinatario cargado");
            }} />
          )}
        </div>
      </div>

      {/* Plantilla dialog */}
      <FormDialog
        open={plantillaOpen}
        onClose={() => setPlantillaOpen(false)}
        title="Plantillas de transferencia"
        description="Selecciona una plantilla para precargar el formulario."
        submitLabel="Crear nueva plantilla"
        size="lg"
        onSubmit={() => {
          setPlantillaOpen(false);
          toast.success("Nueva plantilla creada");
        }}
      >
        <div className="divide-y border rounded-md max-h-64 overflow-y-auto">
          {[
            { n: "Sueldos mensuales", d: "18 empleados", m: "$ 4.820.000", t: "unica" as const },
            { n: "Pago proveedor SA", d: "Mensual · dia 10", m: "$ 220.000", t: "unica" as const },
            { n: "Honorarios estudio Rios", d: "Mensual · dia 12", m: "$ 145.000", t: "unica" as const },
            { n: "Alquiler oficina", d: "Mensual · dia 5", m: "$ 380.000", t: "programar" as const },
          ].map((p) => (
            <div key={p.n} className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
              onClick={() => {
                setPlantillaOpen(false);
                setTab(p.t);
                toast.success(`Plantilla "${p.n}" cargada`);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-[color:var(--brand-soft)] flex items-center justify-center shrink-0">
                  <Star size={14} className="text-[color:var(--brand-dark)]" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{p.n}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.d}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold">{p.m}</span>
                <button type="button" className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent text-muted-foreground"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <Label>Nombre de la nueva plantilla</Label>
          <Input placeholder="Ej. Pago proveedor mensual" />
        </div>
      </FormDialog>

      {/* OTP dialog */}
      <FormDialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        title="Verificacion de dos factores"
        description="Ingresa el codigo de 6 digitos enviado a tu correo o generado por tu app de autenticacion."
        submitLabel="Verificar y confirmar"
        onSubmit={confirmWithOtp}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 py-2">
            <KeyRound size={18} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Codigo de verificacion</span>
          </div>
          <div className="flex justify-center gap-2">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                  const next = [...otp];
                  next[i] = val;
                  setOtp(next);
                  if (val && i < 5) otpRefs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
                }}
                onFocus={(e) => e.target.select()}
                className="w-11 h-12 text-center text-lg font-bold rounded-md border bg-card outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring"
                autoComplete="one-time-code"
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>¿No recibiste el codigo?</span>
            <button type="button" className="text-primary font-semibold hover:underline" onClick={() => { resetOtp(); toast.success("Nuevo codigo enviado"); }}>
              Reenviar
            </button>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={saveDestOpen}
        onClose={() => setSaveDestOpen(false)}
        title="¿Deseas guardar este destinatario como frecuente?"
        description={`Podes agendar a @${destAlias} en tu lista de destinatarios frecuentes para reutilizarlo.`}
        submitLabel="Si, guardar destinatario"
        onSubmit={() => {
          setSaveDestOpen(false);
          toast.success(`@${destAlias} agregado a destinatarios frecuentes`);
        }}
      >
        <div className="text-xs text-muted-foreground">
          Los destinatarios ya no se guardan automaticamente. Solo se agendan si confirmas aqui.
          Si presionas "Cancelar" no se guardara.
        </div>
      </FormDialog>

      <ConfirmDialog
        open={confirmarEliminacion !== null}
        title={
          confirmarEliminacion?.tipo === "borrador"
            ? "¿Eliminar borrador?"
            : "¿Cancelar transferencia programada?"
        }
        description="Esta accion no se puede deshacer."
        confirmLabel={confirmarEliminacion?.tipo === "borrador" ? "Eliminar" : "Cancelar"}
        onClose={() => setConfirmarEliminacion(null)}
        onConfirm={() => {
          if (confirmarEliminacion?.tipo === "borrador") {
            setDrafts((prev) => prev.filter((d) => d.id !== confirmarEliminacion.id));
            toast.success("Borrador eliminado");
          } else if (confirmarEliminacion?.tipo === "programada") {
            setScheduled((prev) => prev.filter((s) => s.id !== confirmarEliminacion.id));
            toast.success("Transferencia cancelada");
          }
        }}
      />
    </>
  );
}

/* ===== Transferencia unica ===== */

function Unica({
  confirm,
  setConfirm,
  onOtpRequired,
  onSaveDraft,
  onSaveTemplate,
  prefilledDestinatario,
  onClearPrefill,
}: {
  confirm: boolean;
  setConfirm: (v: boolean) => void;
  onOtpRequired: () => void;
  onSaveDraft: (d: Draft) => void;
  onSaveTemplate: () => void;
  prefilledDestinatario?: CoelsaResult;
  onClearPrefill?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedDestinatario, setSelectedDestinatario] = useState<CoelsaResult | null>(
    () => prefilledDestinatario ?? null
  );
  const [frecuentesOpen, setFrecuentesOpen] = useState(false);
  const [monto, setMonto] = useState("220000");

  const saveAsDraft = () => {
    if (!selectedDestinatario) return;
    onSaveDraft({
      id: `d${Date.now()}`,
      destinatario: selectedDestinatario.nombre,
      alias: selectedDestinatario.alias,
      monto: `$ ${Number(monto).toLocaleString("es-AR")}`,
      concepto: "Pago a proveedor",
      ref: "",
      fecha: new Date().toLocaleDateString("es-AR"),
    });
  };

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    await new Promise((r) => setTimeout(r, 600));
    const found = qelsaMock.find(
      (r) =>
        r.alias.toLowerCase().includes(q.toLowerCase()) ||
        r.cuit.includes(q) ||
        r.cbu.includes(q) ||
        r.nombre.toLowerCase().includes(q.toLowerCase())
    );
    setSearching(false);
    if (found) {
      onClearPrefill?.();
      setSelectedDestinatario(found);
    } else {
      toast.error("Destinatario no encontrado en QELSA");
    }
  };

  if (confirm) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Revisa los datos antes de confirmar.</div>
        <div className="border rounded-md divide-y">
          {[
            ["Origen", "Cuenta operativa"],
            ["Destinatario", selectedDestinatario?.nombre ?? "-"],
            ["CUIT", selectedDestinatario?.cuit ?? "-"],
            ["CBU", selectedDestinatario?.cbu ?? "-"],
            ["Alias", selectedDestinatario ? `@${selectedDestinatario.alias}` : "-"],
            ["Monto", `$ ${Number(monto).toLocaleString("es-AR")}`],
            ["Comision estimada", "$ 80,00 (0,30%)"],
            ["Total debito", `$ ${(Number(monto) + 80).toLocaleString("es-AR")}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 px-3 text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-mono tabular-nums font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted rounded">
          <ShieldCheck size={14} /> Se solicitara 2FA al confirmar.
        </div>
        <div className="flex gap-2">
          <BtnOutline onClick={() => setConfirm(false)} className="flex-1">Volver</BtnOutline>
          <BtnPrimary onClick={onOtpRequired} className="flex-1">Confirmar transferencia</BtnPrimary>
        </div>
      </div>
    );
  }

  if (!selectedDestinatario) {
    return (
      <div className="space-y-4">
        <div>
          <Label>Destinatario</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar por CUIT, CBU o alias"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                disabled={searching}
              />
            </div>
            <BtnPrimary type="button" onClick={handleSearch} disabled={searching}>
              {searching ? "Buscando..." : "Buscar"}
            </BtnPrimary>
          </div>
          {searching && (
            <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="animate-pulse">Consultando QELSA...</span>
            </div>
          )}
        </div>

        <BtnOutline type="button" onClick={() => setFrecuentesOpen(true)} className="w-full">
          <Users size={14} /> Destinatarios frecuentes
        </BtnOutline>

        <FormDialog
          open={frecuentesOpen}
          onClose={() => setFrecuentesOpen(false)}
          title="Destinatarios frecuentes"
          description="Selecciona un destinatario de tu lista."
          submitLabel="Cerrar"
          onSubmit={() => setFrecuentesOpen(false)}
          size="md"
        >
          {destinatariosMock.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No tenes destinatarios frecuentes guardados.
            </div>
          ) : (
            <div className="divide-y max-h-72 overflow-y-auto">
              {destinatariosMock.map((d) => (
                <div
                  key={d.alias}
                  className="flex items-center justify-between py-2.5 px-1 hover:bg-muted/50 cursor-pointer rounded"
                  onClick={() => {
                    onClearPrefill?.();
                    setSelectedDestinatario(d);
                    setFrecuentesOpen(false);
                  }}
                >
                  <div>
                    <div className="text-sm font-semibold">{d.nombre}</div>
                    <div className="text-xs text-muted-foreground">@{d.alias} · {d.banco}</div>
                  </div>
                  <span className="text-xs text-primary font-semibold">Seleccionar</span>
                </div>
              ))}
            </div>
          )}
        </FormDialog>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setConfirm(true); }}>
      {/* Validated data card */}
      <div className="border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={16} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
            Datos validados de QELSA
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nombre</span>
            <span className="font-semibold">{selectedDestinatario.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CUIT</span>
            <span className="font-semibold">{selectedDestinatario.cuit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CBU</span>
            <span className="font-semibold">{selectedDestinatario.cbu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Alias</span>
            <span className="font-semibold">@{selectedDestinatario.alias}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onClearPrefill?.();
            setSelectedDestinatario(null);
          }}
          className="text-xs text-primary mt-2 hover:underline"
        >
          Cambiar destinatario
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Label>Origen de fondos</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Cuenta operativa — $ 6.389.830,55</option>
            <option>Sucursal Centro — $ 4.220.000,00</option>
            <option>Sucursal Norte — $ 1.870.500,00</option>
          </select>
        </div>
        <div>
          <Label>Monto</Label>
          <Input placeholder="$ 0,00" value={monto} onChange={(e) => setMonto(e.target.value)} />
        </div>
        <div>
          <Label>Moneda</Label>
          <div className="h-10 px-3 rounded-md border bg-muted flex items-center text-sm text-muted-foreground">
            ARS — Pesos Argentinos
          </div>
        </div>
        <div>
          <Label>Concepto</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Pago a proveedor</option>
            <option>Sueldos</option>
            <option>Honorarios</option>
            <option>Servicios</option>
            <option>Devolucion</option>
          </select>
        </div>
        <div>
          <Label>Referencia</Label>
          <Input placeholder="Factura 0034" />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <BtnOutline type="button" className="flex-1" onClick={saveAsDraft}>
          <Save size={14} /> Guardar borrador
        </BtnOutline>
        <BtnOutline type="button" className="flex-1" onClick={onSaveTemplate}>
          <FileText size={14} /> Guardar como plantilla
        </BtnOutline>
        <BtnPrimary type="submit" className="flex-1">Continuar</BtnPrimary>
      </div>
    </form>
  );
}

/* ===== Programar ===== */
function Programar({ onSuccess }: { onSuccess: () => void }) {
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Revisa los datos antes de programar.</div>
        <div className="border rounded-md divide-y">
          {[
            ["Origen", "Cuenta operativa"],
            ["Destinatario", "Proveedor SA"],
            ["CBU", "0000003 100099887766 11"],
            ["Monto", "$ 220.000,00"],
            ["Fecha", "15/07/2026"],
            ["Hora", "14:30"],
            ["Comision estimada", "$ 80,00 (0,30%)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 px-3 text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-mono tabular-nums font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <BtnOutline onClick={() => setConfirm(false)} className="flex-1">Volver</BtnOutline>
          <BtnPrimary onClick={onSuccess} className="flex-1">Programar transferencia</BtnPrimary>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setConfirm(true); }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Label>Origen de fondos</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Cuenta operativa — $ 6.389.830,55</option>
            <option>Sucursal Centro — $ 4.220.000,00</option>
            <option>Sucursal Norte — $ 1.870.500,00</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Destinatario</Label>
          <Input placeholder="Buscar por CBU, CVU o alias" defaultValue="proveedor.sa" />
          <div className="text-xs text-muted-foreground mt-1">
            <ShieldCheck size={11} className="inline mr-1" /> Validado: Proveedor SA — Banco Galicia
          </div>
        </div>
        <div>
          <Label>Monto</Label>
          <Input placeholder="$ 0,00" defaultValue="220000" />
        </div>
        <div>
          <Label>Moneda</Label>
          <div className="h-10 px-3 rounded-md border bg-card flex items-center text-sm text-muted-foreground">
            ARS — Pesos Argentinos
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <div>
            <Label>Fecha de envio</Label>
            <Input type="date" />
          </div>
          <div>
            <Label>Hora de envio</Label>
            <Input type="time" defaultValue="14:30" />
          </div>
        </div>
        <div>
          <Label>Concepto</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Pago a proveedor</option>
            <option>Sueldos</option>
            <option>Honorarios</option>
            <option>Servicios</option>
            <option>Devolucion</option>
          </select>
        </div>
        <div>
          <Label>Referencia</Label>
          <Input placeholder="Factura 0034" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <BtnOutline type="button" className="flex-1" onClick={() => toast.success("Borrador programado guardado")}>
          <Save size={14} /> Guardar borrador
        </BtnOutline>
        <BtnPrimary type="submit" className="flex-1">Programar</BtnPrimary>
      </div>
    </form>
  );
}

/* ===== Borradores ===== */
function Borradores({ drafts, onDelete, onEdit, onExecute }: {
  drafts: Draft[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onExecute: (id: string) => void;
}) {
  if (drafts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText size={32} className="mx-auto mb-3 opacity-50" />
        <p className="font-semibold">No tenes borradores</p>
        <p className="text-sm mt-1">Las transferencias que guardes como borrador apareceran aca.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {drafts.map((d) => (
        <div key={d.id} className="flex items-center justify-between py-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold">{d.destinatario}</div>
            <div className="text-xs text-muted-foreground">@{d.alias} · <span className="font-mono">{d.monto}</span> · {d.concepto}</div>
            <div className="text-[11px] text-muted-foreground/60">Guardado el {d.fecha}</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onEdit(d.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent text-muted-foreground" title="Editar">
              <Edit3 size={13} />
            </button>
            <button onClick={() => onExecute(d.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent text-muted-foreground" title="Ejecutar">
              <Play size={13} />
            </button>
            <button onClick={() => onDelete(d.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-red-50 text-muted-foreground hover:text-red-600" title="Eliminar">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Transferencias programadas ===== */
function Programadas({ items, onCancel, onEdit, onExecute }: {
  items: Scheduled[];
  onCancel: (id: string) => void;
  onEdit: (id: string) => void;
  onExecute: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar size={32} className="mx-auto mb-3 opacity-50" />
        <p className="font-semibold">No tenes transferencias programadas</p>
        <p className="text-sm mt-1">Usa la pestana "Programar" para agendar una transferencia.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {items.map((s) => (
        <div key={s.id} className="flex items-center justify-between py-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold">{s.destinatario}</div>
            <div className="text-xs text-muted-foreground">@{s.alias} · <span className="font-mono">{s.monto}</span> · {s.concepto}</div>
            <div className="text-xs text-muted-foreground/70 flex items-center gap-1 mt-0.5">
              <Calendar size={11} /> {s.fecha} <Clock size={11} className="ml-1" /> {s.hora}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge tone={s.estado === "Recurrente" ? "neutral" : "warn"}>{s.estado}</Badge>
            <button onClick={() => onEdit(s.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent text-muted-foreground" title="Editar">
              <Edit3 size={13} />
            </button>
            <button onClick={() => onExecute(s.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent text-muted-foreground" title="Ejecutar ahora">
              <Play size={13} />
            </button>
            <button onClick={() => onCancel(s.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-red-50 text-muted-foreground hover:text-red-600" title="Cancelar">
              <X size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Destinatarios frecuentes ===== */
function DestinatariosList({ onSelect }: { onSelect: (d: Destinatario) => void }) {
  const [search, setSearch] = useState("");
  const filtered = search
    ? destinatariosMock.filter((d) =>
        d.nombre.toLowerCase().includes(search.toLowerCase()) ||
        d.alias.toLowerCase().includes(search.toLowerCase()) ||
        d.banco.toLowerCase().includes(search.toLowerCase())
      )
    : destinatariosMock;

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, alias o banco..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users size={32} className="mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No se encontraron destinatarios</p>
          <p className="text-sm mt-1">Agrega destinatarios desde la pantalla de Destinatarios en el menu.</p>
        </div>
      ) : (
        <div className="divide-y">
          {filtered.map((d) => (
            <div key={d.alias} className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-sm font-semibold">{d.nombre}</div>
                <div className="text-xs text-muted-foreground">@{d.alias} · {d.banco}</div>
              </div>
              <button
                onClick={() => onSelect(d)}
                className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
              >
                Transferir <ArrowUpRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <BtnOutline className="w-full">
          <Plus size={14} /> Ver todos los destinatarios
        </BtnOutline>
      </div>
    </div>
  );
}