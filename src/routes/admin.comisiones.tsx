import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, History, Save, Plus, Percent, ChevronDown, ChevronRight } from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Input, Stat, Badge,
} from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";
import { Label } from "@/components/portal-shell";

export const Route = createFileRoute("/admin/comisiones")({ component: Page });

type Conceptos = {
  trf_in: { p: string; f: string };
  trf_out: { p: string; f: string };
  cobro_qr: { p: string; f: string };
  link_pago: { p: string; f: string };
  cobro_masivo: { p: string; f: string };
  pago_servicio: { p: string; f: string };
};

const clientes: Array<{ n: string; cuit: string; plan: string; c: Conceptos }> = [
  {
    n: "Microcreditos del Sur", cuit: "30-71239988-0", plan: "Empresa",
    c: {
      trf_in: { p: "0,30", f: "50" }, trf_out: { p: "0,45", f: "80" },
      cobro_qr: { p: "0,50", f: "0" }, link_pago: { p: "0,80", f: "30" },
      cobro_masivo: { p: "0,15", f: "12" }, pago_servicio: { p: "0,00", f: "120" },
    },
  },
  {
    n: "Consorcio Larrea 1200", cuit: "30-71235678-2", plan: "Consorcios",
    c: {
      trf_in: { p: "0,00", f: "0" }, trf_out: { p: "0,40", f: "60" },
      cobro_qr: { p: "0,50", f: "0" }, link_pago: { p: "0,80", f: "30" },
      cobro_masivo: { p: "0,12", f: "8" }, pago_servicio: { p: "0,00", f: "90" },
    },
  },
  {
    n: "Administradora Plaza", cuit: "30-71244455-1", plan: "Alquileres",
    c: {
      trf_in: { p: "0,20", f: "40" }, trf_out: { p: "0,50", f: "100" },
      cobro_qr: { p: "0,80", f: "10" }, link_pago: { p: "1,00", f: "50" },
      cobro_masivo: { p: "0,20", f: "15" }, pago_servicio: { p: "0,00", f: "150" },
    },
  },
  {
    n: "Municipalidad de Chivilcoy", cuit: "30-99876543-2", plan: "Sector publico",
    c: {
      trf_in: { p: "0,10", f: "0" }, trf_out: { p: "0,20", f: "20" },
      cobro_qr: { p: "0,30", f: "0" }, link_pago: { p: "0,50", f: "20" },
      cobro_masivo: { p: "0,08", f: "5" }, pago_servicio: { p: "0,00", f: "60" },
    },
  },
];

const historial = [
  { f: "02/06/2026 11:14", cli: "Microcreditos del Sur", u: "T. Vega", t: "Cobro masivo: % 0,18 → 0,15" },
  { f: "31/05/2026 09:42", cli: "Administradora Plaza", u: "M. Solis", t: "Link de pago: fijo $ 30 → $ 50" },
  { f: "28/05/2026 16:08", cli: "Consorcio Larrea 1200", u: "T. Vega", t: "Transferencia in: bonificada al 0%" },
  { f: "20/05/2026 13:21", cli: "Municipalidad de Chivilcoy", u: "M. Solis", t: "Plan asignado: Sector publico" },
];

const conceptosMeta: Array<{ k: keyof Conceptos; label: string }> = [
  { k: "trf_in", label: "Transferencia recibida" },
  { k: "trf_out", label: "Transferencia enviada" },
  { k: "cobro_qr", label: "Cobro QR" },
  { k: "link_pago", label: "Link de pago" },
  { k: "cobro_masivo", label: "Cobro masivo (por item)" },
  { k: "pago_servicio", label: "Pago de servicios" },
];

function Page() {
  const [expandido, setExpandido] = useState<string | null>(clientes[0].n);
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Carga de comisiones"
        description="Estructura comercial por cliente, concepto y plan vigente."
        action={<BtnOutline onClick={() => setNuevoOpen(true)}><Plus size={14} /> Nuevo plan tarifario</BtnOutline>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Clientes con tarifa custom" value="34" />
        <Stat label="Planes activos" value="6" sub="Empresa, Consorcios, …" />
        <Stat label="Comision promedio out" value="0,42 %" />
        <Stat label="Cambios ultimos 30d" value="18" />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[260px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar cliente o CUIT..." className="pl-9" />
            </div>
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Plan: todos</option>
              <option>Empresa</option><option>Consorcios</option>
              <option>Alquileres</option><option>Sector publico</option>
            </select>
          </div>

          {clientes.map(cli => {
            const open = expandido === cli.n;
            return (
              <div key={cli.n} className="border-b last:border-0">
                <button
                  onClick={() => setExpandido(open ? null : cli.n)}
                  className="w-full flex items-center justify-between p-5 hover:bg-muted/30 text-left"
                >
                  <div className="flex items-center gap-3">
                    {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <div>
                      <div className="font-semibold">{cli.n}</div>
                      <div className="text-xs text-muted-foreground font-mono">{cli.cuit}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone="neutral">{cli.plan}</Badge>
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      6 conceptos configurados
                    </span>
                  </div>
                </button>
                {open && (
                  <div className="px-5 pb-5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b">
                            <th className="text-left py-2">Concepto</th>
                            <th className="text-left py-2 w-32">% Variable</th>
                            <th className="text-left py-2 w-32">Monto fijo (ARS)</th>
                            <th className="text-left py-2 w-32">Minimo</th>
                            <th className="text-left py-2 w-32">Maximo</th>
                            <th className="py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {conceptosMeta.map(({ k, label }) => (
                            <tr key={k} className="border-b last:border-0">
                              <td className="py-2.5 font-semibold">{label}</td>
                              <td className="py-2.5"><div className="relative"><Input defaultValue={cli.c[k].p} className="h-9 max-w-24 pr-6 font-mono tabular-nums" /><Percent size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" /></div></td>
                              <td className="py-2.5"><Input defaultValue={cli.c[k].f} className="h-9 max-w-28 font-mono tabular-nums" /></td>
                              <td className="py-2.5"><Input defaultValue="50" className="h-9 max-w-28 font-mono tabular-nums" /></td>
                              <td className="py-2.5"><Input defaultValue="5.000" className="h-9 max-w-28 font-mono tabular-nums" /></td>
                              <td className="py-2.5"></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <BtnOutline className="h-9">Revertir cambios</BtnOutline>
                      <BtnPrimary className="h-9"><Save size={14} /> Guardar comisiones</BtnPrimary>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>

        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><History size={14} /> Historial de cambios</h3>
          <div className="divide-y">
            {historial.map((h, i) => (
              <div key={i} className="py-3">
                <div className="text-sm font-semibold">{h.cli}</div>
                <div className="text-xs mt-0.5">{h.t}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{h.u} · {h.f}</div>
              </div>
            ))}
          </div>
          <BtnOutline className="w-full mt-3 text-xs" onClick={() => setHistOpen(true)}>
            Ver historial completo
          </BtnOutline>
        </Card>
      </div>

      <FormDialog
        open={nuevoOpen}
        onClose={() => setNuevoOpen(false)}
        title="Nuevo plan tarifario"
        description="Defini un plan reutilizable para asignar a varios clientes."
        submitLabel="Crear plan"
        size="lg"
        onSubmit={() => {
          setNuevoOpen(false);
          toast.success("Plan tarifario creado");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Nombre del plan</Label>
            <Input placeholder="Ej. Empresa Plus" />
          </div>
          <div>
            <Label>Plan base</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Vacio</option>
              <option>Empresa</option>
              <option>Consorcios</option>
              <option>Alquileres</option>
              <option>Sector publico</option>
            </select>
          </div>
        </div>
        <div>
          <Label>Descripcion</Label>
          <Input placeholder="Para que segmento aplica este plan" />
        </div>
        <div className="border rounded-md divide-y">
          {conceptosMeta.map(({ k, label }) => (
            <div key={k} className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 p-3 items-center">
              <div className="text-sm font-semibold">{label}</div>
              <Input placeholder="% variable" className="h-9" />
              <Input placeholder="$ fijo" className="h-9" />
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" /> Marcar como plan por defecto para nuevos clientes
        </label>
      </FormDialog>

      {histOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setHistOpen(false)} />
          <div className="relative bg-card rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-xl flex flex-col">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Historial completo de comisiones</h3>
                <p className="text-xs text-muted-foreground">Todos los cambios realizados con trazabilidad por usuario.</p>
              </div>
              <div className="flex gap-2">
                <BtnOutline className="h-9 px-3 text-xs" onClick={() => toast.success("Historial exportado a CSV")}>Exportar CSV</BtnOutline>
                <BtnOutline className="h-9 w-9 px-0" onClick={() => setHistOpen(false)}>✕</BtnOutline>
              </div>
            </div>
            <div className="p-4 border-b flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Cliente, concepto o usuario..." className="pl-9" />
              </div>
              <select className="h-10 px-3 rounded-md border bg-card text-sm">
                <option>ultimos 90 dias</option><option>ultimos 30 dias</option><option>Ano actual</option>
              </select>
              <select className="h-10 px-3 rounded-md border bg-card text-sm">
                <option>Todos los conceptos</option>
                {conceptosMeta.map(c => <option key={c.k}>{c.label}</option>)}
              </select>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-2.5">Fecha</th>
                    <th className="text-left px-5 py-2.5">Cliente</th>
                    <th className="text-left px-5 py-2.5">Concepto</th>
                    <th className="text-left px-5 py-2.5">Anterior</th>
                    <th className="text-left px-5 py-2.5">Nuevo</th>
                    <th className="text-left px-5 py-2.5">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...historial,
                    { f: "18/05/2026 10:33", cli: "Microcreditos del Sur", u: "L. Diaz", t: "Trf out: 0,50 → 0,45" },
                    { f: "12/05/2026 15:02", cli: "Administradora Plaza", u: "T. Vega", t: "QR: 0,70 → 0,80" },
                    { f: "05/05/2026 09:18", cli: "Consorcio Larrea 1200", u: "M. Solis", t: "Servicios: bonificado" },
                    { f: "28/04/2026 14:44", cli: "Municipalidad de Chivilcoy", u: "T. Vega", t: "Plan: Empresa → Sector publico" },
                    { f: "20/04/2026 11:21", cli: "Microcreditos del Sur", u: "L. Diaz", t: "Link de pago: $ 50 → $ 30" },
                  ].map((h, i) => {
                    const [concepto, cambio] = h.t.split(":");
                    const [ant, nuevo] = (cambio ?? "").split("→").map(s => s?.trim());
                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{h.f}</td>
                        <td className="px-5 py-2.5 font-semibold">{h.cli}</td>
                        <td className="px-5 py-2.5 text-xs">{concepto}</td>
                        <td className="px-5 py-2.5 text-xs text-muted-foreground">{ant ?? "—"}</td>
                        <td className="px-5 py-2.5 text-xs font-semibold">{nuevo ?? "—"}</td>
                        <td className="px-5 py-2.5 text-xs">{h.u}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}