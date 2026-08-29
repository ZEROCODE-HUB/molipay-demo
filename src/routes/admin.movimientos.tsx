import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Download, Filter, Search, ArrowDownLeft, ArrowUpRight, ChevronRight,
  FileText, X, AlertCircle, Activity,
} from "lucide-react";
import {
  PageHeader, Card, Input, BtnOutline, BtnPrimary, Badge, Stat,
} from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";
import { Label } from "@/components/portal-shell";

export const Route = createFileRoute("/admin/movimientos")({ component: Page });

type Mov = {
  f: string; cli: string; cuit: string; t: string; m: string;
  e: "OK" | "Pendiente" | "Rechazado" | "Alerta";
  ref: string; orig: string; dest: string;
};

const rows: Mov[] = [
  { f: "02/06/2026 10:42", cli: "Microcreditos del Sur", cuit: "30-71239988-0", t: "Transferencia saliente", m: "- 2.480.000,00", e: "OK", ref: "TR-99821", orig: "Operativa", dest: "Proveedor SA · Galicia" },
  { f: "02/06/2026 10:18", cli: "Consorcio Larrea 1200", cuit: "30-71235678-2", t: "Lote cobros", m: "+ 5.840.200,00", e: "OK", ref: "LT-00342", orig: "Expensas", dest: "128 unidades" },
  { f: "02/06/2026 09:55", cli: "Administradora Plaza", cuit: "30-71244455-1", t: "Link de pago", m: "+ 92.800,00", e: "OK", ref: "LP-9k2x7", orig: "Locatario", dest: "Garantias" },
  { f: "02/06/2026 09:32", cli: "Pagos Express SRL", cuit: "30-71300011-4", t: "Transferencia saliente", m: "- 6.200.000,00", e: "Alerta", ref: "TR-99784", orig: "Operativa", dest: "Cuenta no validada · BBVA" },
  { f: "02/06/2026 08:11", cli: "Municipalidad de Chivilcoy", cuit: "30-99876543-2", t: "Cobro QR", m: "+ 18.400,00", e: "OK", ref: "QR-88210", orig: "Caja municipal", dest: "Recaudacion" },
  { f: "02/06/2026 07:42", cli: "Microcreditos del Sur", cuit: "30-71239988-0", t: "Pago servicio", m: "- 64.320,00", e: "OK", ref: "SV-11020", orig: "Operativa", dest: "Edesur" },
  { f: "01/06/2026 22:01", cli: "Cooperativa Norte", cuit: "30-71411223-7", t: "Transferencia entrante", m: "+ 1.240.000,00", e: "Pendiente", ref: "TR-99710", orig: "Banco Nacion", dest: "Operativa" },
  { f: "01/06/2026 18:33", cli: "Consorcio Larrea 1200", cuit: "30-71235678-2", t: "Link de pago", m: "+ 18.400,00", e: "Rechazado", ref: "LP-77x21", orig: "—", dest: "Expensas" },
];

function Page() {
  const [detalle, setDetalle] = useState<Mov | null>(null);
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paginated = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <PageHeader
        title="Monitor de operaciones"
        description="Operaciones globales de todos los clientes en tiempo real."
        action={
          <div className="flex gap-2">
            <BtnOutline onClick={() => setFiltrosOpen(true)}><Filter size={14} /> Filtros avanzados</BtnOutline>
            <BtnOutline><Download size={14} /> Exportar CSV</BtnOutline>
          </div>
        }
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Volumen del dia" value="$ 184,2M" sub="12.480 operaciones" />
        <Stat label="Operaciones por minuto" value="48" sub="Pico 11:00" />
        <Stat label="Tasa de exito" value="99,2 %" />
        <Stat label="Operaciones con alerta" value="7" sub="Revisar compliance" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b">
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-2">
            <div className="relative lg:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar cliente, CUIT o referencia..." className="pl-9" />
            </div>
            <Input type="date" />
            <Input type="date" />
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Tipo: todos</option>
              <option>Transferencia saliente</option>
              <option>Transferencia entrante</option>
              <option>Cobro QR</option><option>Link de pago</option>
              <option>Lote cobros</option><option>Pago servicio</option>
            </select>
            <BtnPrimary>Aplicar</BtnPrimary>
          </div>
          <div className="grid sm:grid-cols-4 gap-2 mt-2">
            <Input placeholder="Monto minimo" />
            <Input placeholder="Monto maximo" />
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Estado: todos</option>
              <option>OK</option><option>Pendiente</option>
              <option>Rechazado</option><option>Alerta</option>
            </select>
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Cliente: todos</option>
              <option>Microcreditos del Sur</option>
              <option>Consorcio Larrea 1200</option>
              <option>Administradora Plaza</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                <th className="text-left px-5 py-2.5">Fecha</th>
                <th className="text-left px-5 py-2.5">Cliente</th>
                <th className="text-left px-5 py-2.5">Operacion</th>
                <th className="text-left px-5 py-2.5">Referencia</th>
                <th className="text-right px-5 py-2.5">Monto</th>
                <th className="text-right px-5 py-2.5">Estado</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => {
                const isIn = r.m.startsWith("+");
                return (
                  <tr key={r.ref} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">{r.f}</td>
                    <td className="px-5 py-3">
                      <div className="font-semibold">{r.cli}</div>
                      <div className="text-xs text-muted-foreground font-mono">{r.cuit}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${isIn ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                          {isIn ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <span className="text-xs">{r.t}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{r.ref}</td>
                    <td className={`px-5 py-3 font-mono tabular-nums text-right font-semibold whitespace-nowrap ${isIn ? "text-emerald-700" : ""}`}>$ {r.m.replace(/[+\- ]/g, "")}</td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={r.e === "OK" ? "success" : r.e === "Pendiente" ? "warn" : r.e === "Alerta" ? "warn" : "danger"}>{r.e}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <BtnOutline className="h-8 px-2 text-xs" onClick={() => setDetalle(r)}>
                        <ChevronRight size={13} />
                      </BtnOutline>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t flex justify-between items-center text-xs text-muted-foreground">
          <span>{rows.length === 0 ? "0 registros" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, rows.length)} de ${rows.length}`}</span>
          <div className="flex gap-1">
            <BtnOutline className="h-8 px-3 text-xs" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</BtnOutline>
            <BtnOutline className="h-8 px-3 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</BtnOutline>
          </div>
        </div>
      </Card>

      {detalle && <MovDrawer m={detalle} onClose={() => setDetalle(null)} />}

      <FormDialog
        open={filtrosOpen}
        onClose={() => setFiltrosOpen(false)}
        title="Filtros avanzados"
        description="Refina la busqueda combinando multiples criterios."
        submitLabel="Aplicar filtros"
        size="lg"
        onSubmit={() => {
          setFiltrosOpen(false);
          toast.success("Filtros avanzados aplicados");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Desde</Label><Input type="date" /></div>
          <div><Label>Hasta</Label><Input type="date" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tipo de operacion</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Todas</option>
              <option>Transferencias</option>
              <option>Cobros QR</option>
              <option>Links de pago</option>
              <option>Lotes</option>
              <option>Pago servicios</option>
            </select>
          </div>
          <div>
            <Label>Estado</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Todos</option>
              <option>OK</option>
              <option>Pendiente</option>
              <option>Rechazado</option>
              <option>Alerta</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Monto minimo</Label><Input placeholder="$ 0" /></div>
          <div><Label>Monto maximo</Label><Input placeholder="$ 0" /></div>
        </div>
        <div>
          <Label>Cliente / CUIT</Label>
          <Input placeholder="Razon social, CUIT o ID" />
        </div>
        <div>
          <Label>Referencia</Label>
          <Input placeholder="TR-XXXX, LP-XXXX, etc." />
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" /> Solo con alerta de compliance</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Excluir operaciones internas</label>
        </div>
      </FormDialog>
    </>
  );
}

function MovDrawer({ m, onClose }: { m: Mov; onClose: () => void }) {
  const isIn = m.m.startsWith("+");
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <div className="text-xs text-muted-foreground">Detalle de operacion</div>
            <div className="font-semibold font-mono">{m.ref}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <Card>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Monto</div>
            <div className={`font-display tabular-nums text-3xl font-semibold mt-1 ${isIn ? "text-emerald-700" : ""}`}>$ {m.m.replace(/[+\- ]/g, "")}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.f}</div>
            <div className="mt-3"><Badge tone={m.e === "OK" ? "success" : m.e === "Rechazado" ? "danger" : "warn"}>{m.e}</Badge></div>
          </Card>

          <Card>
            <h4 className="font-semibold text-sm mb-3">Detalle</h4>
            <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
              <dt className="text-muted-foreground text-xs">Cliente</dt><dd className="font-semibold">{m.cli}</dd>
              <dt className="text-muted-foreground text-xs">CUIT</dt><dd className="font-mono text-xs">{m.cuit}</dd>
              <dt className="text-muted-foreground text-xs">Tipo</dt><dd>{m.t}</dd>
              <dt className="text-muted-foreground text-xs">Origen</dt><dd className="text-xs">{m.orig}</dd>
              <dt className="text-muted-foreground text-xs">Destino</dt><dd className="text-xs">{m.dest}</dd>
              <dt className="text-muted-foreground text-xs">Referencia</dt><dd className="font-mono text-xs">{m.ref}</dd>
              <dt className="text-muted-foreground text-xs">Comision Molly</dt><dd className="text-xs">$ 2.480,00 (0,10 %)</dd>
            </dl>
          </Card>

          {m.e === "Alerta" && (
            <Card className="border-amber-200 bg-amber-50/40">
              <div className="flex gap-2 items-start">
                <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-amber-900">Alerta de compliance disparada</div>
                  <div className="text-amber-800 mt-1">Monto superior a umbral configurado de $ 5.000.000. Pendiente de revision.</div>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-2">
            <BtnOutline className="flex-1"><FileText size={14} /> Comprobante</BtnOutline>
            <BtnOutline className="flex-1"><Activity size={14} /> Ver trazabilidad</BtnOutline>
          </div>
        </div>
      </div>
    </div>
  );
}