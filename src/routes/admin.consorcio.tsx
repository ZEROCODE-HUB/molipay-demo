import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus, Search, Building2, ChevronRight, X, AlertCircle,
  CheckCircle2, Clock, Play, Pause, Download, FileText,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Badge, Input, Stat,
} from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";
import { Label } from "@/components/portal-shell";

export const Route = createFileRoute("/admin/consorcio")({ component: Page });

type Consorcio = {
  n: string; dir: string; admin: string; uds: number;
  mes: string; e: "Activo" | "Pausado";
};

const cons: Consorcio[] = [
  { n: "Larrea 1200", dir: "Larrea 1200, CABA", admin: "Adm. Plaza", uds: 128, mes: "$ 5.840.200", e: "Activo" },
  { n: "Av. Cabildo 3450", dir: "Av. Cabildo 3450, CABA", admin: "Adm. Norte", uds: 86, mes: "$ 3.220.000", e: "Activo" },
  { n: "Av. Rivadavia 5000", dir: "Av. Rivadavia 5000, CABA", admin: "Adm. Centro", uds: 210, mes: "$ 9.880.000", e: "Activo" },
  { n: "Belgrano 880", dir: "Belgrano 880, La Plata", admin: "Adm. Plata", uds: 64, mes: "$ 2.120.000", e: "Pausado" },
];

const lotes = [
  { n: "Larrea 1200 · Marzo 2026", uds: 128, m: "$ 5.840.200", e: "Completado", ok: 124, err: 4, prog: 100 },
  { n: "Av. Cabildo 3450 · Marzo 2026", uds: 86, m: "$ 3.220.000", e: "Parcial", ok: 70, err: 16, prog: 100 },
  { n: "Av. Rivadavia 5000 · Marzo 2026", uds: 210, m: "$ 9.880.000", e: "En proceso", ok: 168, err: 2, prog: 80 },
  { n: "Belgrano 880 · Marzo 2026", uds: 64, m: "$ 2.120.000", e: "Pendiente", ok: 0, err: 0, prog: 0 },
];

const errores = [
  { ud: "UF 4°B", loc: "Juan Perez", m: "$ 48.200", motivo: "CBU informado invalido" },
  { ud: "UF 7°D", loc: "Ana Sosa", m: "$ 52.800", motivo: "Saldo insuficiente al debito" },
  { ud: "UF 9°A", loc: "Pedro Gomez", m: "$ 48.200", motivo: "Cuenta de destino bloqueada" },
  { ud: "UF 12°C", loc: "Laura Diaz", m: "$ 52.800", motivo: "CUIT inexistente" },
];

const tonoLote = (e: string): "success" | "warn" | "neutral" | "danger" =>
  e === "Completado" ? "success" : e === "En proceso" ? "warn" : e === "Parcial" ? "warn" : "neutral";

function Page() {
  const [detalle, setDetalle] = useState<Consorcio | null>(null);
  const [nuevoOpen, setNuevoOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Modulo de consorcios"
        description="Administradoras, consorcios y procesamiento masivo de expensas."
        action={<BtnPrimary onClick={() => setNuevoOpen(true)}><Plus size={16} /> Nuevo consorcio</BtnPrimary>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Consorcios activos" value="42" />
        <Stat label="Unidades gestionadas" value="3.840" />
        <Stat label="Recaudacion del mes" value="$ 84,5M" sub="+8 % vs mes anterior" />
        <Stat label="Lotes con errores" value="2" sub="22 items a reintentar" />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[260px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar consorcio o administradora..." className="pl-9" />
            </div>
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Estado: todos</option>
              <option>Activo</option><option>Pausado</option>
            </select>
          </div>
          <div className="hidden md:grid grid-cols-[1.4fr_1fr_0.6fr_1fr_0.7fr_auto] gap-4 px-5 py-3 border-b text-[11px] uppercase tracking-wide text-muted-foreground">
            <div>Consorcio</div><div>Administradora</div><div>Unidades</div>
            <div className="text-right">Mes actual</div><div>Estado</div><div></div>
          </div>
          {cons.map((c) => (
            <div key={c.n} className="md:grid md:grid-cols-[1.4fr_1fr_0.6fr_1fr_0.7fr_auto] gap-4 px-5 py-4 border-b last:border-0 items-center">
              <div>
                <div className="font-semibold">{c.n}</div>
                <div className="text-xs text-muted-foreground">{c.dir}</div>
              </div>
              <div className="text-sm text-muted-foreground">{c.admin}</div>
              <div className="text-sm">{c.uds}</div>
              <div className="font-mono tabular-nums text-right text-sm font-semibold">{c.mes}</div>
              <div><Badge tone={c.e === "Activo" ? "success" : "warn"}>{c.e}</Badge></div>
              <div className="flex justify-end mt-2 md:mt-0">
                <BtnOutline className="h-9 px-3 text-xs" onClick={() => setDetalle(c)}>
                  Detalle <ChevronRight size={12} />
                </BtnOutline>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Lotes recientes</h3>
          <div className="divide-y">
            {lotes.map(l => (
              <div key={l.n} className="py-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold truncate pr-2">{l.n}</span>
                  <Badge tone={tonoLote(l.e)}>{l.e}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {l.uds} unidades · {l.m}
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${l.prog}%` }} />
                </div>
                <div className="flex gap-3 mt-2 text-[11px]">
                  <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-600" /> {l.ok} ok</span>
                  <span className="flex items-center gap-1"><AlertCircle size={11} className="text-red-600" /> {l.err} errores</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {detalle && <ConsorcioDrawer c={detalle} onClose={() => setDetalle(null)} />}

      <FormDialog
        open={nuevoOpen}
        onClose={() => setNuevoOpen(false)}
        title="Nuevo consorcio"
        description="Datos basicos para empezar a operar expensas y unidades funcionales."
        submitLabel="Crear consorcio"
        onSubmit={() => {
          setNuevoOpen(false);
          toast.success("Consorcio creado correctamente");
        }}
      >
        <div>
          <Label>Nombre del consorcio</Label>
          <Input placeholder="Ej. Larrea 1200" />
        </div>
        <div>
          <Label>Direccion</Label>
          <Input placeholder="Calle y numero, ciudad" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Administradora</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Adm. Plaza</option>
              <option>Adm. Norte</option>
              <option>Adm. Centro</option>
              <option>Adm. Plata</option>
            </select>
          </div>
          <div>
            <Label>Unidades funcionales</Label>
            <Input type="number" placeholder="128" />
          </div>
        </div>
        <div>
          <Label>CUIT del consorcio</Label>
          <Input placeholder="30-XXXXXXXX-X" />
        </div>
      </FormDialog>
    </>
  );
}

function ConsorcioDrawer({ c, onClose }: { c: Consorcio; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <div className="text-xs text-muted-foreground">Consorcio</div>
            <div className="font-semibold text-lg">{c.n}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <Card>
            <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
              <dt className="text-muted-foreground text-xs">Direccion</dt><dd>{c.dir}</dd>
              <dt className="text-muted-foreground text-xs">Administradora</dt><dd>{c.admin}</dd>
              <dt className="text-muted-foreground text-xs">Unidades funcionales</dt><dd>{c.uds}</dd>
              <dt className="text-muted-foreground text-xs">Estado</dt><dd><Badge tone={c.e === "Activo" ? "success" : "warn"}>{c.e}</Badge></dd>
            </dl>
            <div className="flex gap-2 mt-4">
              {c.e === "Activo"
                ? <BtnOutline className="flex-1"><Pause size={14} /> Pausar consorcio</BtnOutline>
                : <BtnPrimary className="flex-1"><Play size={14} /> Reactivar</BtnPrimary>}
              <BtnOutline className="flex-1"><FileText size={14} /> Editar datos</BtnOutline>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2"><Building2 size={14} /> Unidades funcionales</h4>
              <span className="text-xs text-muted-foreground">Mostrando 5 de {c.uds}</span>
            </div>
            <div className="divide-y text-sm">
              {[
                ["UF 1°A", "Garcia, Juan", "$ 48.200", "Al dia"],
                ["UF 1°B", "Mendez, Laura", "$ 48.200", "Al dia"],
                ["UF 2°C", "Sosa, Pedro", "$ 52.800", "Atrasado"],
                ["UF 3°A", "Perez, Ana", "$ 48.200", "Al dia"],
                ["UF 3°B", "Vega, Tomas", "$ 52.800", "Al dia"],
              ].map(([u, l, m, e]) => (
                <div key={u} className="flex justify-between items-center py-2.5">
                  <div>
                    <div className="font-semibold">{u}</div>
                    <div className="text-xs text-muted-foreground">{l}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{m}</span>
                    <Badge tone={e === "Al dia" ? "success" : "danger"}>{e}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><AlertCircle size={14} className="text-red-600" /> Errores del ultimo lote</h4>
            <div className="divide-y">
              {errores.map((e, i) => (
                <div key={i} className="py-2.5 text-sm flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{e.ud} <span className="text-muted-foreground font-normal">· {e.loc}</span></div>
                    <div className="text-xs text-red-700">{e.motivo}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{e.m}</span>
                    <BtnOutline className="h-8 px-3 text-xs">Reintentar</BtnOutline>
                  </div>
                </div>
              ))}
            </div>
            <BtnOutline className="w-full mt-3 text-xs"><Download size={12} /> Descargar reporte de errores</BtnOutline>
          </Card>
        </div>
      </div>
    </div>
  );
}

void Clock;