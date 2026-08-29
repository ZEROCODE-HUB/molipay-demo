import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus, Search, Home, ChevronRight, X, FileText, Calendar,
  CheckCircle2, AlertCircle, Download,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Badge, Input, Label, Stat,
} from "@/components/portal-shell";

export const Route = createFileRoute("/admin/alquileres")({ component: Page });

type Prop = {
  u: string; loc: string; prop: string; m: string;
  venc: string; e: "Al dia" | "Atrasado" | "Pendiente cobro";
  ult: string;
};

const props: Prop[] = [
  { u: "Belgrano 1234 4°B", loc: "Juan Perez", prop: "Inv. del Plata", m: "$ 320.000", venc: "05/06/2026", e: "Al dia", ult: "Mayo: cobrado" },
  { u: "Palermo 567 2°A", loc: "Maria Lopez", prop: "Inv. del Plata", m: "$ 410.000", venc: "05/06/2026", e: "Pendiente cobro", ult: "Mayo: cobrado" },
  { u: "Caballito 880 6°C", loc: "Pedro Gomez", prop: "Estudio Rios", m: "$ 280.000", venc: "05/06/2026", e: "Atrasado", ult: "Abril: cobrado" },
  { u: "Recoleta 2100 3°D", loc: "Ana Torres", prop: "Inv. Norte", m: "$ 520.000", venc: "05/06/2026", e: "Al dia", ult: "Mayo: cobrado" },
  { u: "Villa Crespo 4500 PB", loc: "Laura Mendez", prop: "Estudio Rios", m: "$ 290.000", venc: "10/06/2026", e: "Pendiente cobro", ult: "Mayo: cobrado" },
  { u: "Nunez 3300 5°A", loc: "Tomas Vega", prop: "Inv. Norte", m: "$ 480.000", venc: "10/06/2026", e: "Atrasado", ult: "Abril: cobrado" },
];

const pagos = [
  { f: "05/05/2026", m: "$ 320.000", e: "Cobrado", ref: "TR-99201" },
  { f: "05/04/2026", m: "$ 308.000", e: "Cobrado", ref: "TR-98810" },
  { f: "05/03/2026", m: "$ 295.000", e: "Cobrado", ref: "TR-98420" },
  { f: "05/02/2026", m: "$ 295.000", e: "Cobrado", ref: "TR-98010" },
];

const tono = (e: string): "success" | "warn" | "danger" =>
  e === "Al dia" ? "success" : e === "Pendiente cobro" ? "warn" : "danger";

function Page() {
  const [detalle, setDetalle] = useState<Prop | null>(null);
  const [nuevo, setNuevo] = useState(false);

  return (
    <>
      <PageHeader
        title="Modulo de alquileres"
        description="Propiedades administradas, locatarios y cobros programados."
        action={<BtnPrimary onClick={() => setNuevo(true)}><Plus size={16} /> Nueva propiedad</BtnPrimary>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Propiedades" value="246" sub="42 administradoras" />
        <Stat label="Cobro mensual" value="$ 62,1M" />
        <Stat label="Atrasos" value="11" sub="4,5 %" />
        <Stat label="Cobros programados (10d)" value="68" sub="$ 24,8M" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar direccion, locatario o propietario..." className="pl-9" />
          </div>
          <select className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>Estado: todos</option><option>Al dia</option>
            <option>Pendiente cobro</option><option>Atrasado</option>
          </select>
          <select className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>Administradora: todas</option>
            <option>Inv. del Plata</option><option>Estudio Rios</option>
            <option>Inv. Norte</option>
          </select>
        </div>
        <div className="hidden md:grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr_auto] gap-4 px-5 py-3 border-b text-[11px] uppercase tracking-wide text-muted-foreground">
          <div>Unidad</div><div>Locatario</div><div>Propietario</div>
          <div>Alquiler</div><div>Vencimiento</div><div>Estado</div><div></div>
        </div>
        {props.map((p) => (
          <div key={p.u} className="md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr_auto] gap-4 px-5 py-4 border-b last:border-0 items-center">
            <div className="font-semibold">{p.u}</div>
            <div className="text-sm">{p.loc}</div>
            <div className="text-sm text-muted-foreground">{p.prop}</div>
            <div className="text-sm font-semibold">{p.m}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={11} /> {p.venc}</div>
            <div><Badge tone={tono(p.e)}>{p.e}</Badge></div>
            <div className="flex justify-end mt-2 md:mt-0">
              <BtnOutline className="h-9 px-3 text-xs" onClick={() => setDetalle(p)}>
                Detalle <ChevronRight size={12} />
              </BtnOutline>
            </div>
          </div>
        ))}
      </Card>

      {detalle && <PropDrawer p={detalle} onClose={() => setDetalle(null)} />}
      {nuevo && <NuevaPropDrawer onClose={() => setNuevo(false)} />}
    </>
  );
}

function PropDrawer({ p, onClose }: { p: Prop; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <div className="text-xs text-muted-foreground">Propiedad</div>
            <div className="font-semibold text-lg">{p.u}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <Card>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Home size={14} /> Datos</h4>
            <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
              <dt className="text-muted-foreground text-xs">Direccion</dt><dd>{p.u}</dd>
              <dt className="text-muted-foreground text-xs">Locatario</dt><dd>{p.loc}</dd>
              <dt className="text-muted-foreground text-xs">Propietario</dt><dd>{p.prop}</dd>
              <dt className="text-muted-foreground text-xs">Alquiler mensual</dt><dd className="font-semibold">{p.m}</dd>
              <dt className="text-muted-foreground text-xs">Vencimiento</dt><dd>{p.venc}</dd>
              <dt className="text-muted-foreground text-xs">Contrato</dt><dd>24 meses · vence 03/2027</dd>
            </dl>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sm">Cobro del periodo actual</h4>
              <Badge tone={tono(p.e)}>{p.e}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-muted-foreground">Monto</div><div className="font-mono tabular-nums font-semibold">{p.m}</div></div>
              <div><div className="text-xs text-muted-foreground">Vence</div><div className="font-mono tabular-nums font-semibold">{p.venc}</div></div>
            </div>
            <div className="flex gap-2 mt-4">
              <BtnPrimary className="flex-1">Registrar cobro manual</BtnPrimary>
              <BtnOutline className="flex-1">Enviar recordatorio</BtnOutline>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sm">Historial de pagos</h4>
              <BtnOutline className="h-8 px-3 text-xs"><Download size={12} /> Exportar</BtnOutline>
            </div>
            <div className="divide-y">
              {pagos.map(pg => (
                <div key={pg.ref} className="flex justify-between items-center py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <div>
                      <div className="font-semibold">{pg.f}</div>
                      <div className="text-xs text-muted-foreground font-mono">{pg.ref}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums font-semibold">{pg.m}</span>
                    <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent"><FileText size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NuevaPropDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="font-semibold text-lg">Nueva propiedad</div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>
        <form className="p-6 space-y-5">
          <Card>
            <h4 className="font-semibold text-sm mb-3">Datos del inmueble</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Direccion *</Label><Input /></div>
              <div><Label>Unidad funcional</Label><Input placeholder="4°B" /></div>
              <div><Label>Ciudad</Label><Input defaultValue="CABA" /></div>
              <div><Label>Tipo</Label>
                <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
                  <option>Departamento</option><option>Casa</option><option>Cochera</option><option>Local</option>
                </select>
              </div>
              <div><Label>Administradora</Label><Input /></div>
            </div>
          </Card>
          <Card>
            <h4 className="font-semibold text-sm mb-3">Locatario</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Nombre *</Label><Input /></div>
              <div><Label>DNI *</Label><Input /></div>
              <div><Label>Email</Label><Input type="email" /></div>
              <div><Label>Telefono</Label><Input /></div>
            </div>
          </Card>
          <Card>
            <h4 className="font-semibold text-sm mb-3">Contrato</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Alquiler mensual *</Label><Input /></div>
              <div><Label>Dia de vencimiento</Label><Input defaultValue="05" /></div>
              <div><Label>Inicio</Label><Input type="date" /></div>
              <div><Label>Duracion (meses)</Label><Input defaultValue="24" /></div>
            </div>
          </Card>
          <div className="flex gap-2 sticky bottom-0 bg-background py-3 border-t">
            <BtnOutline className="flex-1" onClick={onClose}>Cancelar</BtnOutline>
            <BtnPrimary className="flex-1">Crear propiedad</BtnPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}

void AlertCircle;