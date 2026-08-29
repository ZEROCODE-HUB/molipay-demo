import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  UserCheck, CheckCircle2, Clock, XCircle, AlertCircle, Search,
  Building2, MessageSquare, X, FileText, Camera, ScanLine, Activity,
  ShieldCheck, Eye, Download,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Badge, Input, Label, Stat,
} from "@/components/portal-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/kyc")({ component: Page });

type EstadoKYC = "Pendiente" | "En validacion" | "Aprobado" | "Rechazado";

type Persona = {
  n: string; dni: string; e: EstadoKYC; prov: "Truora" | "RENAPER"; f: string;
  score: number; liveness: number; match: number; obs?: string;
};

const auto: Persona[] = [
  { n: "Carla Rivas",    dni: "30.123.456", e: "Aprobado",      prov: "RENAPER", f: "02/06 09:14", score: 98, liveness: 99, match: 97 },
  { n: "Diego Mendez",   dni: "29.888.777", e: "Aprobado",      prov: "Truora",  f: "01/06 17:32", score: 94, liveness: 96, match: 95 },
  { n: "Sofia Caro",     dni: "32.554.211", e: "En validacion", prov: "Truora",  f: "Hoy 10:02",   score: 72, liveness: 80, match: 70, obs: "Esperando segundo intento de selfie" },
  { n: "Esteban Pinto",  dni: "28.991.034", e: "Pendiente",     prov: "RENAPER", f: "—",           score: 0,  liveness: 0,  match: 0 },
  { n: "Marina Lopez",   dni: "35.221.998", e: "Rechazado",     prov: "Truora",  f: "31/05 14:48", score: 41, liveness: 30, match: 55, obs: "DNI ilegible, foto fuera de foco" },
];

type Manual = {
  n: string; dni: string; presentado: string; tipo: "DNI" | "Pasaporte" | "Cedula";
  estado: "Pendiente revision" | "Documentos faltantes" | "Aprobado" | "Rechazado";
  domicilio: string; ocupacion: string;
  docs: { tipo: string; archivo: string; bg: string; icon: typeof FileText }[];
};

const manuales: Manual[] = [
  {
    n: "Hernan Quiroga", dni: "27.554.882", presentado: "Hoy 11:20", tipo: "DNI",
    estado: "Pendiente revision",
    domicilio: "Av. Corrientes 1234, CABA", ocupacion: "Comerciante",
    docs: [
      { tipo: "DNI Frente",  archivo: "dni-frente.jpg",  bg: "linear-gradient(135deg,#1e3a8a,#3b82f6)", icon: FileText },
      { tipo: "DNI Dorso",   archivo: "dni-dorso.jpg",   bg: "linear-gradient(135deg,#1e3a8a,#60a5fa)", icon: FileText },
      { tipo: "Selfie",      archivo: "selfie.jpg",      bg: "linear-gradient(135deg,#475569,#94a3b8)", icon: Camera },
      { tipo: "Servicio",    archivo: "edesur-mar.pdf",  bg: "linear-gradient(135deg,#7c2d12,#ea580c)", icon: FileText },
    ],
  },
  {
    n: "Lucia Mansilla", dni: "33.221.110", presentado: "Hoy 09:48", tipo: "DNI",
    estado: "Documentos faltantes",
    domicilio: "Calle 47 N° 882, La Plata", ocupacion: "Independiente",
    docs: [
      { tipo: "DNI Frente", archivo: "dni-frente.jpg", bg: "linear-gradient(135deg,#1e3a8a,#3b82f6)", icon: FileText },
      { tipo: "Selfie",     archivo: "selfie.jpg",     bg: "linear-gradient(135deg,#475569,#94a3b8)", icon: Camera },
    ],
  },
  {
    n: "Federico Brun",  dni: "31.998.412", presentado: "Ayer 16:12", tipo: "Pasaporte",
    estado: "Pendiente revision",
    domicilio: "Bv. Orono 1100, Rosario", ocupacion: "Profesional",
    docs: [
      { tipo: "Pasaporte",    archivo: "pasaporte.jpg", bg: "linear-gradient(135deg,#14532d,#22c55e)", icon: FileText },
      { tipo: "Selfie",       archivo: "selfie.jpg",    bg: "linear-gradient(135deg,#475569,#94a3b8)", icon: Camera },
      { tipo: "Constancia AFIP", archivo: "afip.pdf",   bg: "linear-gradient(135deg,#0f172a,#1e293b)", icon: FileText },
    ],
  },
];

const checklist = [
  "Identidad validada", "Domicilio verificado", "Origen de fondos declarado",
  "Estado PEP verificado", "Estado SDN verificado",
];

const juridicas = [
  { n: "Consorcio Larrea 1200",     cuit: "30-71235678-2", e: "En revision" as const },
  { n: "Microcreditos del Sur SA",  cuit: "30-71239988-0", e: "Aprobado" as const },
  { n: "Administradora Plaza SRL",  cuit: "30-71244455-1", e: "Documentacion" as const },
];

const tonoKYC = (e: EstadoKYC): "warn" | "success" | "danger" | "neutral" =>
  e === "Aprobado" ? "success" : e === "Rechazado" ? "danger" : e === "Pendiente" ? "neutral" : "warn";

function Page() {
  const [tab, setTab] = useState<"manual" | "auto" | "juridicas">("manual");
  const [manualSel, setManualSel] = useState<Manual | null>(null);
  const [docPreview, setDocPreview] = useState<Manual["docs"][number] | null>(null);
  const [juridica, setJuridica] = useState<typeof juridicas[number] | null>(null);
  const [estados, setEstados] = useState<Record<string, "ok" | "no" | null>>({});
  const [autoSel, setAutoSel] = useState<Persona | null>(null);

  return (
    <>
      <PageHeader
        title="Validacion de identidad (KYC)"
        description="Aprobacion manual de legajos presentados y seguimiento de validaciones automaticas (RENAPER + Truora)."
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="KYC manuales pendientes" value={String(manuales.filter(m => m.estado === "Pendiente revision").length)} sub="Esperando aprobacion" />
        <Stat label="KYC automaticos hoy" value="86" sub="94% aprobacion" />
        <Stat label="Rechazados ultimos 7d" value="4" />
        <Stat label="Legajos juridicos pendientes" value="9" sub="Checklist manual" />
      </div>

      <div className="flex gap-1 border-b mb-5">
        {[
          { k: "manual",     l: "Aprobacion manual (fisicas)", i: UserCheck },
          { k: "auto",       l: "Validacion automatica",       i: ScanLine },
          { k: "juridicas",  l: "Personas juridicas",          i: Building2 },
        ].map((t) => {
          const Icon = t.i;
          return (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 -mb-px ${
                tab === t.k ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} /> {t.l}
            </button>
          );
        })}
      </div>

      {tab === "manual" && (
        <div className="space-y-3">
          <Card className="p-3 flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="DNI, nombre o tipo de documento..." className="pl-9" />
            </div>
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Todos los estados</option><option>Pendiente revision</option>
              <option>Documentos faltantes</option><option>Aprobado</option><option>Rechazado</option>
            </select>
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Todos los documentos</option><option>DNI</option><option>Pasaporte</option><option>Cedula</option>
            </select>
          </Card>

          {manuales.map((m) => (
            <Card key={m.dni} className="p-0 overflow-hidden">
              <div className="grid lg:grid-cols-[1fr_auto] gap-4 p-5 items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-9 h-9 rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] flex items-center justify-center font-semibold text-xs">
                      {m.n.split(" ").map(p => p[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{m.n}</div>
                      <div className="text-xs text-muted-foreground">{m.tipo} {m.dni} · Presentado {m.presentado}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-11">
                    <span>📍 {m.domicilio}</span>
                    <span>💼 {m.ocupacion}</span>
                  </div>

                  <div className="mt-4 ml-11">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">
                      Documentos adjuntos ({m.docs.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.docs.map((d) => {
                        const Icon = d.icon;
                        return (
                          <button
                            key={d.tipo}
                            onClick={() => setDocPreview(d)}
                            className="group w-32 rounded-md overflow-hidden border bg-card hover:border-primary transition"
                          >
                            <div className="h-20 flex items-center justify-center relative" style={{ background: d.bg }}>
                              <Icon size={28} className="text-white/90" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <Eye size={16} className="text-white" />
                              </div>
                            </div>
                            <div className="px-2 py-1.5 text-[11px]">
                              <div className="font-semibold truncate">{d.tipo}</div>
                              <div className="text-muted-foreground truncate">{d.archivo}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge tone={m.estado === "Aprobado" ? "success" : m.estado === "Rechazado" ? "danger" : m.estado === "Documentos faltantes" ? "warn" : "neutral"}>
                    {m.estado}
                  </Badge>
                  <div className="flex gap-1.5">
                    <BtnOutline className="h-9 px-3 text-xs" onClick={() => setManualSel(m)}><Eye size={12} /> Revisar legajo</BtnOutline>
                    <BtnPrimary className="h-9 px-3 text-xs" onClick={() => toast.success(`${m.n} aprobado`)}>
                      <CheckCircle2 size={12} /> Aprobar
                    </BtnPrimary>
                    <BtnOutline className="h-9 px-3 text-xs text-red-600 border-red-200" onClick={() => toast.error(`${m.n} rechazado`)}>
                      <XCircle size={12} /> Rechazar
                    </BtnOutline>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "auto" && (
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2"><Activity size={16} /> Pipeline automatico · RENAPER + Truora</h3>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="DNI o nombre..." className="h-9 pl-8 max-w-[220px]" />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2.5">Cliente</th>
                <th className="text-left px-5 py-2.5">Proveedor</th>
                <th className="text-left px-5 py-2.5">Score</th>
                <th className="text-left px-5 py-2.5">Liveness</th>
                <th className="text-left px-5 py-2.5">Match facial</th>
                <th className="text-left px-5 py-2.5">Estado</th>
                <th className="text-left px-5 py-2.5">ultima corrida</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {auto.map((p) => (
                <tr key={p.dni} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="font-semibold">{p.n}</div>
                    <div className="text-xs text-muted-foreground font-mono">DNI {p.dni}</div>
                  </td>
                  <td className="px-5 py-3"><Badge tone="neutral">{p.prov}</Badge></td>
                  <td className="px-5 py-3 font-semibold">{p.score || "—"}</td>
                  <td className="px-5 py-3 text-xs font-mono tabular-nums">{p.liveness ? `${p.liveness}%` : "—"}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-xs">{p.match ? `${p.match}%` : "—"}</td>
                  <td className="px-5 py-3"><Badge tone={tonoKYC(p.e)}>{p.e}</Badge></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{p.f}</td>
                  <td className="px-5 py-3 text-right">
                    <BtnOutline className="h-8 px-2 text-xs" onClick={() => setAutoSel(p)}><Eye size={11} /> Detalle</BtnOutline>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "juridicas" && (
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Building2 size={16} /> Legajos juridicos</h3>
          <p className="text-xs text-muted-foreground mb-3">Checklist manual con aprobacion item por item.</p>
          <div className="divide-y">
            {juridicas.map((j) => (
              <button key={j.cuit} onClick={() => setJuridica(j)} className="w-full flex justify-between items-center py-3 text-left hover:bg-muted/30 -mx-2 px-2 rounded">
                <div>
                  <div className="font-semibold text-sm">{j.n}</div>
                  <div className="text-xs text-muted-foreground font-mono">{j.cuit}</div>
                </div>
                <Badge tone={j.e === "Aprobado" ? "success" : "warn"}>{j.e}</Badge>
              </button>
            ))}
          </div>
        </Card>
      )}

      {manualSel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setManualSel(null)} />
          <div className="relative w-full max-w-2xl bg-background h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <div className="text-xs text-muted-foreground">Revision manual de legajo</div>
                <div className="font-semibold text-lg">{manualSel.n}</div>
              </div>
              <button onClick={() => setManualSel(null)} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <Card className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Documento</div><div className="font-semibold">{manualSel.tipo} {manualSel.dni}</div></div>
                <div><div className="text-xs text-muted-foreground">Ocupacion</div><div className="font-semibold">{manualSel.ocupacion}</div></div>
                <div className="col-span-2"><div className="text-xs text-muted-foreground">Domicilio</div><div className="font-semibold">{manualSel.domicilio}</div></div>
              </Card>

              <Card>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sm">Documentos del usuario</h4>
                  <span className="text-[11px] text-muted-foreground">{manualSel.docs.length} archivos</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {manualSel.docs.map((d) => {
                    const Icon = d.icon;
                    return (
                      <button key={d.tipo} onClick={() => setDocPreview(d)} className="group rounded-md overflow-hidden border bg-card hover:border-primary text-left">
                        <div className="h-32 flex items-center justify-center relative" style={{ background: d.bg }}>
                          <Icon size={42} className="text-white/90" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Eye size={20} className="text-white" />
                          </div>
                        </div>
                        <div className="px-3 py-2 text-xs">
                          <div className="font-semibold">{d.tipo}</div>
                          <div className="text-muted-foreground truncate">{d.archivo}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><ShieldCheck size={14} /> Checklist de validacion</h4>
                <div className="space-y-2">
                  {checklist.map((c) => (
                    <div key={c} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="text-sm flex items-center gap-2">
                        {estados[c] === "ok" && <CheckCircle2 size={14} className="text-emerald-600" />}
                        {estados[c] === "no" && <XCircle size={14} className="text-red-600" />}
                        {!estados[c] && <Clock size={14} className="text-muted-foreground" />}
                        {c}
                      </div>
                      <div className="flex gap-1">
                        <BtnOutline className="h-8 px-2 text-xs" onClick={() => setEstados(s => ({ ...s, [c]: "ok" }))}>Aprobar</BtnOutline>
                        <BtnOutline className="h-8 px-2 text-xs text-red-600 border-red-200" onClick={() => setEstados(s => ({ ...s, [c]: "no" }))}>Rechazar</BtnOutline>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><MessageSquare size={14} /> Comentario interno</h4>
                <textarea className="w-full min-h-[80px] p-3 rounded-md border bg-card text-sm" placeholder="Observacion visible solo para compliance..." />
              </Card>

              <div className="flex gap-2 sticky bottom-0 bg-background py-3 border-t">
                <BtnOutline className="flex-1 text-red-600 border-red-200" onClick={() => { setManualSel(null); toast.error(`${manualSel.n} rechazado`); }}>
                  <XCircle size={14} /> Rechazar legajo
                </BtnOutline>
                <BtnPrimary className="flex-1" onClick={() => { setManualSel(null); toast.success(`Legajo de ${manualSel.n} aprobado`); }}>
                  <CheckCircle2 size={14} /> Aprobar legajo
                </BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      )}

      {docPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setDocPreview(null)} />
          {(() => {
            const Icon = docPreview.icon;
            return (
          <div className="relative max-w-2xl w-full">
            <div className="bg-card rounded-lg overflow-hidden shadow-2xl">
              <div className="border-b px-5 py-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{docPreview.tipo}</div>
                  <div className="text-xs text-muted-foreground">{docPreview.archivo}</div>
                </div>
                <div className="flex gap-1">
                  <BtnOutline className="h-9 px-3 text-xs" onClick={() => toast.success("Descargando documento")}><Download size={12} /> Descargar</BtnOutline>
                  <BtnOutline className="h-9 w-9 px-0" onClick={() => setDocPreview(null)}><X size={14} /></BtnOutline>
                </div>
              </div>
              <div className="h-[60vh] flex items-center justify-center relative" style={{ background: docPreview.bg }}>
                <Icon size={96} className="text-white/80" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/40 text-white text-[11px]">
                  Vista previa simulada · documento del usuario
                </div>
              </div>
            </div>
          </div>
            );
          })()}
        </div>
      )}

      {autoSel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAutoSel(null)} />
          <div className="relative bg-card rounded-lg max-w-md w-full p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{autoSel.n}</h3>
                <p className="text-xs text-muted-foreground">DNI {autoSel.dni} · {autoSel.prov}</p>
              </div>
              <Badge tone={tonoKYC(autoSel.e)}>{autoSel.e}</Badge>
            </div>
            <Card className="grid grid-cols-3 gap-2 text-center">
              <div><div className="text-xs text-muted-foreground">Score</div><div className="font-display tabular-nums font-semibold text-lg">{autoSel.score || "—"}</div></div>
              <div><div className="text-xs text-muted-foreground">Liveness</div><div className="font-display tabular-nums font-semibold text-lg">{autoSel.liveness}%</div></div>
              <div><div className="text-xs text-muted-foreground">Match</div><div className="font-display tabular-nums font-semibold text-lg">{autoSel.match}%</div></div>
            </Card>
            {autoSel.obs && (
              <div className="text-xs p-3 rounded-md bg-amber-50 text-amber-800 flex gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" /> {autoSel.obs}
              </div>
            )}
            <div className="text-xs text-muted-foreground border-t pt-3">ultima corrida: {autoSel.f}</div>
            <div className="flex gap-2">
              <BtnOutline className="flex-1" onClick={() => { setAutoSel(null); toast.success("Reintento encolado"); }}>Reintentar</BtnOutline>
              <BtnPrimary className="flex-1" onClick={() => setAutoSel(null)}>Cerrar</BtnPrimary>
            </div>
          </div>
        </div>
      )}

      {juridica && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setJuridica(null)} />
          <div className="relative w-full max-w-xl bg-background h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <div className="text-xs text-muted-foreground">Validacion manual</div>
                <div className="font-semibold text-lg">{juridica.n}</div>
              </div>
              <button onClick={() => setJuridica(null)} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <Card>
                <h4 className="font-semibold text-sm mb-3">Checklist de validacion</h4>
                <div className="space-y-2">
                  {["Representante legal validado", "Segundo firmante validado", "Documentacion societaria completa", "Estado PEP verificado", "Estado SDN verificado"].map((c) => (
                    <div key={c} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="text-sm flex items-center gap-2">
                        {estados[c] === "ok" && <CheckCircle2 size={14} className="text-emerald-600" />}
                        {estados[c] === "no" && <XCircle size={14} className="text-red-600" />}
                        {!estados[c] && <Clock size={14} className="text-muted-foreground" />}
                        {c}
                      </div>
                      <div className="flex gap-1">
                        <BtnOutline className="h-8 px-2 text-xs" onClick={() => setEstados(s => ({ ...s, [c]: "ok" }))}>Aprobar</BtnOutline>
                        <BtnOutline className="h-8 px-2 text-xs text-red-600 border-red-200" onClick={() => setEstados(s => ({ ...s, [c]: "no" }))}>Rechazar</BtnOutline>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><MessageSquare size={14} /> Comentario interno</h4>
                <textarea className="w-full min-h-[80px] p-3 rounded-md border bg-card text-sm" placeholder="Observacion visible solo para el equipo de compliance..." />
              </Card>
              <div className="flex gap-2 sticky bottom-0 bg-background py-3 border-t">
                <BtnOutline className="flex-1" onClick={() => { setJuridica(null); toast.success("Validacion guardada en borrador"); }}>Guardar borrador</BtnOutline>
                <BtnPrimary className="flex-1" onClick={() => { setJuridica(null); toast.success(`Legajo ${juridica.n} aprobado`); }}>
                  <CheckCircle2 size={14} /> Aprobar legajo
                </BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
