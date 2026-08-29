import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Plus, Search, Filter, Building2, FileText, CheckCircle2, Clock,
  XCircle, AlertCircle, Upload, MessageSquare, ChevronRight, X,
  User, ShieldCheck,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Badge, Input, Label, Stat,
} from "@/components/portal-shell";

export const Route = createFileRoute("/admin/clientes")({ component: Page });

type Estado = "Aprobado" | "En revision" | "Documentacion" | "Incompleto" | "Rechazado" | "Bloqueado";

const clientes: Array<{
  n: string; c: string; e: Estado; f: string; rep: string; seg: string; vol: string;
}> = [
  { n: "Consorcio Larrea 1200", c: "30-71235678-2", e: "En revision", f: "12/05/2026", rep: "L. Fernandez", seg: "Consorcio", vol: "—" },
  { n: "Microcreditos del Sur SA", c: "30-71239988-0", e: "Aprobado", f: "03/04/2026", rep: "M. Acosta", seg: "Microcredito", vol: "$ 8,4M" },
  { n: "Administradora Plaza SRL", c: "30-71244455-1", e: "Documentacion", f: "01/05/2026", rep: "P. Suarez", seg: "Alquileres", vol: "—" },
  { n: "Municipalidad de Chivilcoy", c: "30-99876543-2", e: "Aprobado", f: "20/02/2026", rep: "J. Roldan", seg: "Sector publico", vol: "$ 21,2M" },
  { n: "Pagos Express SRL", c: "30-71300011-4", e: "Bloqueado", f: "15/03/2026", rep: "R. Vidal", seg: "Empresa", vol: "—" },
  { n: "Cooperativa Norte", c: "30-71411223-7", e: "Incompleto", f: "28/05/2026", rep: "E. Pinto", seg: "Cooperativa", vol: "—" },
  { n: "Comercializadora ABC", c: "30-70988877-5", e: "Rechazado", f: "10/04/2026", rep: "A. Vega", seg: "Empresa", vol: "—" },
];

const estados: Array<Estado | "Todos"> = ["Todos", "Aprobado", "En revision", "Documentacion", "Incompleto", "Rechazado", "Bloqueado"];

const tono = (e: Estado): "success" | "warn" | "danger" | "neutral" => ({
  "Aprobado": "success", "En revision": "warn", "Documentacion": "warn",
  "Incompleto": "neutral", "Rechazado": "danger", "Bloqueado": "danger",
}[e] as "success" | "warn" | "danger" | "neutral");

const detalleHistorial = [
  { f: "12/05/2026 14:22", u: "L. Diaz (Compliance)", t: "Marco como 'En revision'. Falta acta de designacion." },
  { f: "12/05/2026 10:08", u: "T. Vega (Operaciones)", t: "Valido CUIT contra AFIP. OK." },
  { f: "10/05/2026 09:14", u: "Sistema", t: "Legajo iniciado por M. Solis." },
];

const documentos = [
  { n: "Estatuto social", e: "Validado", f: "10/05/2026" },
  { n: "Acta de designacion de autoridades", e: "Pendiente", f: "—" },
  { n: "DNI representante legal", e: "Validado", f: "10/05/2026" },
  { n: "DNI segundo firmante", e: "Validado", f: "11/05/2026" },
  { n: "Constancia de inscripcion AFIP", e: "Validado", f: "10/05/2026" },
];

function Page() {
  const [detalle, setDetalle] = useState<typeof clientes[number] | null>(null);
  const [nuevo, setNuevo] = useState(false);
  const [filtro, setFiltro] = useState<Estado | "Todos">("Todos");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtrados = filtro === "Todos" ? clientes : clientes.filter(c => c.e === filtro);
  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const paginated = filtrados.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [filtro]);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Onboarding y gestion de personas juridicas operando en Molly."
        action={<BtnPrimary onClick={() => setNuevo(true)}><Plus size={16} /> Nuevo cliente</BtnPrimary>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Clientes activos" value="312" sub="+8 esta semana" />
        <Stat label="Legajos en revision" value="12" sub="3 con documentacion pendiente" />
        <Stat label="Aprobados ultimos 30d" value="24" />
        <Stat label="Rechazados ultimos 30d" value="3" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por razon social o CUIT..." className="pl-9" />
          </div>
          <select className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>Segmento: todos</option>
            <option>Consorcio</option>
            <option>Alquileres</option>
            <option>Microcredito</option>
            <option>Empresa</option>
            <option>Sector publico</option>
          </select>
          <BtnOutline className="h-10"><Filter size={14} /> Mas filtros</BtnOutline>
        </div>

        <div className="px-4 pt-3 flex flex-wrap gap-1.5">
          {estados.map(e => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                filtro === e
                  ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border-transparent"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto -mx-0 mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b">
                <th className="text-left px-5 py-2.5">Razon social</th>
                <th className="text-left px-5 py-2.5">CUIT</th>
                <th className="text-left px-5 py-2.5">Segmento</th>
                <th className="text-left px-5 py-2.5">Representante</th>
                <th className="text-left px-5 py-2.5">Estado del legajo</th>
                <th className="text-left px-5 py-2.5">Alta</th>
                <th className="text-right px-5 py-2.5">Vol. mes</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="flex flex-col items-center text-center py-14">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Building2 size={22} className="text-muted-foreground" />
                    </div>
                    <div className="font-semibold">No hay clientes con este estado</div>
                    <div className="text-sm text-muted-foreground mt-1">Proba con otro filtro o inicia un nuevo onboarding.</div>
                    <BtnPrimary onClick={() => setNuevo(true)} className="mt-4"><Plus size={16} /> Nuevo cliente</BtnPrimary>
                  </div>
                </td></tr>
              ) : paginated.map((c) => (
                <tr key={c.c} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3 font-semibold">{c.n}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{c.c}</td>
                  <td className="px-5 py-3 text-xs">{c.seg}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{c.rep}</td>
                  <td className="px-5 py-3"><Badge tone={tono(c.e)}>{c.e}</Badge></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{c.f}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right text-sm font-semibold">{c.vol}</td>
                  <td className="px-5 py-3 text-right">
                    <BtnOutline className="h-8 px-3 text-xs" onClick={() => setDetalle(c)}>
                      Ver legajo <ChevronRight size={12} />
                    </BtnOutline>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t text-xs text-muted-foreground flex justify-between items-center">
          <span>{filtrados.length === 0 ? "0 registros" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtrados.length)} de ${filtrados.length}`}</span>
          <div className="flex gap-1">
            <BtnOutline className="h-8 px-3 text-xs" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</BtnOutline>
            <BtnOutline className="h-8 px-3 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</BtnOutline>
          </div>
        </div>
      </Card>

      {detalle && <DetalleDrawer cliente={detalle} onClose={() => setDetalle(null)} />}
      {nuevo && <NuevoClienteDrawer onClose={() => setNuevo(false)} />}
    </>
  );
}

function DetalleDrawer({ cliente, onClose }: { cliente: typeof clientes[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <div className="text-xs text-muted-foreground">Legajo de cliente</div>
            <div className="font-semibold text-lg">{cliente.n}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Badge tone={tono(cliente.e)}>{cliente.e}</Badge>
            <span className="text-xs text-muted-foreground">CUIT {cliente.c} · Alta {cliente.f}</span>
          </div>

          <Card>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Building2 size={14} /> Datos societarios</h4>
            <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
              <dt className="text-muted-foreground text-xs">Razon social</dt><dd className="font-semibold">{cliente.n}</dd>
              <dt className="text-muted-foreground text-xs">CUIT</dt><dd className="font-mono text-xs">{cliente.c}</dd>
              <dt className="text-muted-foreground text-xs">Segmento</dt><dd>{cliente.seg}</dd>
              <dt className="text-muted-foreground text-xs">Actividad</dt><dd className="text-xs">Servicios financieros</dd>
              <dt className="text-muted-foreground text-xs">Domicilio fiscal</dt><dd className="text-xs">Av. Corrientes 1234, CABA</dd>
              <dt className="text-muted-foreground text-xs">Inicio actividades</dt><dd className="text-xs">15/03/2020</dd>
            </dl>
          </Card>

          <Card>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><User size={14} /> Representantes</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-semibold">{cliente.rep}</div>
                  <div className="text-xs text-muted-foreground font-mono">DNI 30.123.456 · Presidente</div>
                </div>
                <Badge tone="success">Validado</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-semibold">Diego Mendez</div>
                  <div className="text-xs text-muted-foreground font-mono">DNI 29.888.777 · Apoderado</div>
                </div>
                <Badge tone="success">Validado</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2"><FileText size={14} /> Documentacion</h4>
              <BtnOutline className="h-8 px-3 text-xs"><Upload size={12} /> Adjuntar</BtnOutline>
            </div>
            <div className="divide-y">
              {documentos.map(d => (
                <div key={d.n} className="flex justify-between items-center py-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    {d.e === "Validado"
                      ? <CheckCircle2 size={14} className="text-emerald-600" />
                      : <Clock size={14} className="text-amber-600" />}
                    <div>
                      <div className="font-semibold">{d.n}</div>
                      <div className="text-xs text-muted-foreground">{d.f}</div>
                    </div>
                  </div>
                  <Badge tone={d.e === "Validado" ? "success" : "warn"}>{d.e}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><MessageSquare size={14} /> Historial y comentarios internos</h4>
            <div className="space-y-3">
              {detalleHistorial.map((h, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-3">
                  <div className="text-sm">{h.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{h.u} · {h.f}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Agregar comentario interno..." />
              <BtnPrimary>Publicar</BtnPrimary>
            </div>
          </Card>

          <div className="flex gap-2 sticky bottom-0 bg-background py-3 border-t">
            <BtnOutline className="flex-1"><XCircle size={14} /> Rechazar</BtnOutline>
            <BtnOutline className="flex-1"><AlertCircle size={14} /> Pedir documentacion</BtnOutline>
            <BtnPrimary className="flex-1"><ShieldCheck size={14} /> Aprobar legajo</BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

function NuevoClienteDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="font-semibold text-lg">Nuevo cliente</div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>
        <form className="p-6 space-y-5">
          <Card>
            <h4 className="font-semibold text-sm mb-3">Datos de la persona juridica</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Razon social *</Label><Input placeholder="SA / SRL / SAS / Asociacion" /></div>
              <div><Label>CUIT *</Label><Input placeholder="30-XXXXXXXX-X" /></div>
              <div><Label>Segmento</Label>
                <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
                  <option>Consorcio</option><option>Alquileres</option>
                  <option>Microcredito</option><option>Empresa</option>
                  <option>Sector publico</option><option>Cooperativa</option>
                </select>
              </div>
              <div><Label>Actividad principal</Label><Input /></div>
              <div><Label>Inicio de actividades</Label><Input type="date" /></div>
              <div className="sm:col-span-2"><Label>Domicilio fiscal *</Label><Input /></div>
            </div>
          </Card>
          <Card>
            <h4 className="font-semibold text-sm mb-3">Representante legal</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Nombre completo *</Label><Input /></div>
              <div><Label>DNI *</Label><Input /></div>
              <div><Label>Cargo *</Label><Input placeholder="Presidente / Socio gerente" /></div>
              <div><Label>Email *</Label><Input type="email" /></div>
            </div>
          </Card>
          <Card>
            <h4 className="font-semibold text-sm mb-3">Segundo firmante (opcional)</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Nombre completo</Label><Input /></div>
              <div><Label>DNI</Label><Input /></div>
            </div>
          </Card>
          <Card className="border-dashed">
            <h4 className="font-semibold text-sm mb-2">Documentacion inicial</h4>
            <p className="text-xs text-muted-foreground mb-3">Estatuto, acta de designacion, DNI de representantes. Podes subirlos luego.</p>
            <BtnOutline><Upload size={14} /> Adjuntar archivos</BtnOutline>
          </Card>
          <div className="flex gap-2 sticky bottom-0 bg-background py-3 border-t">
            <BtnOutline className="flex-1" onClick={onClose}>Cancelar</BtnOutline>
            <BtnPrimary className="flex-1">Crear legajo</BtnPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}