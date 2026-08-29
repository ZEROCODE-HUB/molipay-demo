import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Landmark, Plus, Upload, Download, ChevronRight, X,
  Link2, Wallet, FileBarChart2,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Badge, Input, Label, Stat,
} from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";

export const Route = createFileRoute("/admin/recaudacion")({ component: Page });

type Tipo = "Consorcio" | "Alquiler" | "Colegio" | "Universidad";

type Entidad = {
  n: string; tipo: Tipo; cvu: string; e: "Activo" | "Pausado";
  per: string; pagadores: number; cob: string;
};

const entidades: Entidad[] = [
  { n: "Consorcio Larrea 1200", tipo: "Consorcio", cvu: "0000003100099912345678", e: "Activo", per: "Marzo 2026", pagadores: 128, cob: "$ 5.840.200" },
  { n: "Edificio Cabildo 3450", tipo: "Consorcio", cvu: "0000003100099987654321", e: "Activo", per: "Marzo 2026", pagadores: 86, cob: "$ 3.220.000" },
  { n: "Administradora Plaza · Cartera", tipo: "Alquiler", cvu: "0000003100099944556677", e: "Activo", per: "Marzo 2026", pagadores: 42, cob: "$ 13.440.000" },
  { n: "Colegio San Martin", tipo: "Colegio", cvu: "0000003100099911223344", e: "Activo", per: "Marzo 2026", pagadores: 380, cob: "$ 22.800.000" },
  { n: "Universidad del Centro", tipo: "Universidad", cvu: "0000003100099955667788", e: "Pausado", per: "Marzo 2026", pagadores: 1240, cob: "$ 92.400.000" },
];

const lotes = [
  { n: "Expensas Marzo", e: "Completado", ok: 124, err: 4, prog: 100 },
  { n: "Cuotas Marzo", e: "En proceso", ok: 86, err: 1, prog: 72 },
  { n: "Cuotas Abril", e: "Pendiente", ok: 0, err: 0, prog: 0 },
  { n: "Adicionales", e: "Con errores", ok: 12, err: 8, prog: 100 },
];

const unidades = [
  { u: "UF 4°B", loc: "Juan Perez", cvu: "…78 0001", m: "$ 48.200", est: "Pagado" },
  { u: "UF 5°A", loc: "Maria Lopez", cvu: "…78 0002", m: "$ 48.200", est: "Pagado" },
  { u: "UF 6°C", loc: "Pedro Gomez", cvu: "…78 0003", m: "$ 52.800", est: "Pendiente" },
  { u: "UF 7°D", loc: "Ana Sosa", cvu: "…78 0004", m: "$ 48.200", est: "Error" },
  { u: "UF 8°A", loc: "Tomas Vega", cvu: "…78 0005", m: "$ 52.800", est: "Pagado" },
];

function Page() {
  const [tipo, setTipo] = useState<Tipo | "Todos">("Todos");
  const [detalle, setDetalle] = useState<Entidad | null>(null);
  const [cargaOpen, setCargaOpen] = useState(false);

  const filtradas = tipo === "Todos" ? entidades : entidades.filter(e => e.tipo === tipo);
  const tipos: Array<Tipo | "Todos"> = ["Todos", "Consorcio", "Alquiler", "Colegio", "Universidad"];

  return (
    <>
      <PageHeader
        title="Recaudacion sectorial"
        description="CVU Collect, links automaticos y distribucion por entidad."
        action={<BtnPrimary><Plus size={14} /> Nueva entidad</BtnPrimary>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Entidades activas" value="48" sub="5 segmentos" />
        <Stat label="Pagadores asignados" value="6.842" sub="con CVU individual" />
        <Stat label="Cobrado este mes" value="$ 137,7M" />
        <Stat label="Lotes con errores" value="2" sub="Requieren revision" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b flex flex-wrap gap-2 items-center">
          <h3 className="font-semibold flex items-center gap-2"><Landmark size={16} /> Entidades registradas</h3>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {tipos.map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  tipo === t ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border-transparent" : "bg-card hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y">
          {filtradas.map((e) => (
            <div key={e.cvu} className="flex items-center justify-between py-3 px-5">
              <div className="min-w-0">
                <div className="font-semibold text-sm">{e.n} <span className="text-muted-foreground font-normal">· {e.tipo}</span></div>
                <div className="text-xs text-muted-foreground font-mono">CVU {e.cvu}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Periodo activo {e.per} · {e.pagadores} pagadores · {e.cob}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge tone={e.e === "Activo" ? "success" : "warn"}>{e.e}</Badge>
                <BtnOutline className="h-9 px-3 text-xs" onClick={() => setDetalle(e)}>
                  Ver detalle <ChevronRight size={12} />
                </BtnOutline>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {detalle && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetalle(null)} />
          <div className="relative w-full max-w-3xl bg-background h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <div className="text-xs text-muted-foreground">{detalle.tipo}</div>
                <div className="font-semibold text-lg">{detalle.n}</div>
              </div>
              <button onClick={() => setDetalle(null)} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid md:grid-cols-3 gap-4">
                <Stat label="Periodo" value={detalle.per} />
                <Stat label="Cobrado" value={detalle.cob} sub={`${detalle.pagadores} pagadores`} />
                <Stat label="Pendiente" value="$ 320.400" sub="6 pagadores" />
              </div>

              <Card>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sm">Carga de deuda</h4>
                  <BtnOutline className="h-9 px-3 text-xs" onClick={() => setCargaOpen(true)}>
                    <Upload size={12} /> Cargar archivo
                  </BtnOutline>
                </div>
                <p className="text-xs text-muted-foreground">CSV o Excel con CUIT, monto y vencimiento. Genera links de pago automaticos por pagador.</p>
              </Card>

              <Card>
                <h4 className="font-semibold text-sm mb-3">Lotes del periodo</h4>
                <div className="space-y-3">
                  {lotes.map((l) => (
                    <div key={l.n}>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{l.n}</span>
                        <Badge tone={
                          l.e === "Completado" ? "success" :
                          l.e === "En proceso" ? "warn" :
                          l.e === "Con errores" ? "danger" : "neutral"
                        }>{l.e}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{l.ok} ok · {l.err} con error</div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${l.prog}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Wallet size={14} /> CVU Collect por pagador</h4>
                <div className="divide-y">
                  {unidades.map((u) => (
                    <div key={u.u} className="flex justify-between items-center py-2.5 text-sm">
                      <div>
                        <div className="font-semibold">{u.u} <span className="text-muted-foreground font-normal">· {u.loc}</span></div>
                        <div className="text-xs text-muted-foreground font-mono">CVU {u.cvu}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{u.m}</span>
                        <Badge tone={u.est === "Pagado" ? "success" : u.est === "Pendiente" ? "warn" : "danger"}>{u.est}</Badge>
                        <button title="Link" className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent" onClick={() => toast.success("Link de pago copiado")}>
                          <Link2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h4 className="font-semibold text-sm mb-3">Distribucion automatica</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>% Propietario</Label><Input defaultValue="80" /></div>
                  <div><Label>% Consorcio / Entidad</Label><Input defaultValue="20" /></div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">La distribucion se ejecuta al acreditar cada pago.</p>
              </Card>

              <Card className="bg-muted/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2"><FileBarChart2 size={14} /> Reporte de la entidad</h4>
                    <p className="text-xs text-muted-foreground">PDF firmado con numero de serie y logo Molly.</p>
                  </div>
                  <BtnPrimary onClick={() => toast.success("Reporte RP-…184 generado")}><Download size={14} /> Descargar</BtnPrimary>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      <FormDialog
        open={cargaOpen}
        onClose={() => setCargaOpen(false)}
        title="Cargar archivo de deuda"
        description="CSV o Excel · una fila por pagador con CUIT, monto y vencimiento."
        submitLabel="Procesar"
        onSubmit={() => { setCargaOpen(false); toast.success("Archivo en validacion · links generandose"); }}
      >
        <div><Label>Archivo</Label><Input type="file" accept=".csv,.xlsx,.xls" /></div>
        <div><Label>Vencimiento general</Label><Input type="date" /></div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" defaultChecked /> Emitir links de pago automaticamente
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" defaultChecked /> Notificar a pagadores por email
        </label>
      </FormDialog>
    </>
  );
}