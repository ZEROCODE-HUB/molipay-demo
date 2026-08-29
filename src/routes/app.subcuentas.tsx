import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Plus, Copy, ArrowDownLeft, ArrowUpRight, Eye, Pencil, Trash2, Search,
  ArrowLeftRight, Lock, Download, Filter, X, Key, Pause,
  Building2, ChevronDown, ChevronUp, PieChart,
} from "lucide-react";
import { PageHeader, Card, BtnPrimary, BtnOutline, Badge, Stat, Input, Label } from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";

export const Route = createFileRoute("/app/subcuentas")({ component: Page });

type Sub = {
  n: string; apellido: string; email: string; cbu: string;
  tipo: "Operativa" | "Recaudacion" | "Garantias" | "Sueldos";
  e: "Activa" | "Pausada";
  disp: number; ret: number; conc: number;
  ing: string; egr: string;
  resp: string; lim: string; color: string;
  retirosHab: boolean;
};

const subs: Sub[] = [
  { n: "Sucursal Centro", apellido: "Solis", email: "msolis@empresa.com", cbu: "0000003 100011112222 01", tipo: "Operativa", e: "Activa",
    disp: 4220000, ret: 180000, conc: 3950000, ing: "$ 1.840.000", egr: "$ 920.000",
    resp: "M. Solis", lim: "$ 8.000.000 / dia", color: "var(--brand-primary)", retirosHab: true },
  { n: "Sucursal Norte", apellido: "Vega", email: "tvega@empresa.com", cbu: "0000003 100011112222 02", tipo: "Operativa", e: "Activa",
    disp: 1870500, ret: 0, conc: 1870500, ing: "$ 1.220.000", egr: "$ 540.000",
    resp: "T. Vega", lim: "$ 4.000.000 / dia", color: "var(--brand-blue)", retirosHab: true },
  { n: "Operaciones", apellido: "Diaz", email: "ldiaz@empresa.com", cbu: "0000003 100011112222 03", tipo: "Operativa", e: "Activa",
    disp: 6389830, ret: 420000, conc: 5800000, ing: "$ 4.220.000", egr: "$ 2.180.000",
    resp: "L. Diaz", lim: "$ 20.000.000 / dia", color: "var(--brand-dark)", retirosHab: true },
  { n: "Recaudacion expensas", apellido: "Sosa", email: "psosa@empresa.com", cbu: "0000003 100011112222 04", tipo: "Recaudacion", e: "Activa",
    disp: 2150000, ret: 0, conc: 2150000, ing: "$ 5.840.000", egr: "$ 0",
    resp: "P. Sosa", lim: "Sin limite", color: "var(--brand-blue)", retirosHab: true },
  { n: "Sueldos", apellido: "RRHH", email: "rrhh@empresa.com", cbu: "0000003 100011112222 05", tipo: "Sueldos", e: "Activa",
    disp: 980000, ret: 0, conc: 980000, ing: "$ 980.000", egr: "$ 0",
    resp: "RRHH", lim: "$ 5.000.000 / dia", color: "var(--brand-primary)", retirosHab: false },
  { n: "Fondos en garantia", apellido: "Compliance", email: "compliance@empresa.com", cbu: "0000003 100011112222 06", tipo: "Garantias", e: "Pausada",
    disp: 0, ret: 350000, conc: 350000, ing: "$ 0", egr: "$ 0",
    resp: "Compliance", lim: "Solo retiro autorizado", color: "var(--muted-foreground)", retirosHab: false },
];

type Mov = {
  tipo: "ingreso" | "egreso";
  titulo: string;
  txid: string;
  cbu: string;
  entidad: string;
  fecha: string;
  hora: string;
  monto: number;
};




const movimientosPorSub: Record<string, Mov[]> = {
  "Sucursal Centro": [
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-06-02-8841", cbu: "0000003100054321678901", entidad: "Carlos Mendez S.A.", fecha: "02/06/2026", hora: "14:32", monto: 1840000 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-06-02-8842", cbu: "0000003100023456789012", entidad: "Proveedor SA", fecha: "02/06/2026", hora: "11:08", monto: 220000 },
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-06-01-8844", cbu: "0000003100034567890123", entidad: "Cliente #4821", fecha: "01/06/2026", hora: "10:42", monto: 18400 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-05-30-8847", cbu: "0000003100056789012345", entidad: "Edesur S.A.", fecha: "30/05/2026", hora: "18:11", monto: 64320 },
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-05-29-8848", cbu: "0000003100067890123456", entidad: "Link de pago Factura 0033", fecha: "29/05/2026", hora: "09:30", monto: 64800 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-05-28-8849", cbu: "0000003100078901234567", entidad: "AFIP", fecha: "28/05/2026", hora: "09:00", monto: 890000 },
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-05-27-8850", cbu: "0000003100089012345678", entidad: "Conciliacion bancaria", fecha: "27/05/2026", hora: "06:00", monto: 0 },
  ],
  "Operaciones": [
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-06-02-8851", cbu: "0000003100090123456789", entidad: "Proveedor Logistica SA", fecha: "02/06/2026", hora: "10:18", monto: 220000 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-06-01-8852", cbu: "0000003100101234567890", entidad: "Edesur S.A.", fecha: "01/06/2026", hora: "18:11", monto: 64320 },
    { tipo: "egreso", titulo: "Comision Molly", txid: "TX-2026-05-31-8853", cbu: "0000003100112345678901", entidad: "Moli Financial S.A.", fecha: "31/05/2026", hora: "12:00", monto: 4820 },
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-05-30-8854", cbu: "0000003100123456789012", entidad: "Inmobiliaria del Plata", fecha: "30/05/2026", hora: "10:30", monto: 2800000 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-05-29-8855", cbu: "0000003100134567890123", entidad: "OSECAC", fecha: "29/05/2026", hora: "08:30", monto: 420000 },
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-05-28-8856", cbu: "0000003100145678901234", entidad: "Alquileres Galeria Central", fecha: "28/05/2026", hora: "11:00", monto: 3200000 },
  ],
  "Sucursal Norte": [
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-06-02-8857", cbu: "0000003100156789012345", entidad: "Link de pago Factura 0033", fecha: "02/06/2026", hora: "09:30", monto: 64800 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-06-01-8858", cbu: "0000003100167890123456", entidad: "Proveedor SA", fecha: "01/06/2026", hora: "17:44", monto: 35000 },
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-05-30-8859", cbu: "0000003100178901234567", entidad: "Lucia Fernandez", fecha: "30/05/2026", hora: "09:05", monto: 8200 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-05-29-8860", cbu: "0000003100189012345678", entidad: "Pago QR Proveedor", fecha: "29/05/2026", hora: "16:30", monto: 78000 },
  ],
  "Recaudacion expensas": [
    { tipo: "ingreso", titulo: "Cobro masivo — Lote expensas Abril", txid: "TX-2026-06-15-8870", cbu: "0000003100245678901234", entidad: "Lote expensas Abril (102/128)", fecha: "15/06/2026", hora: "08:30", monto: 4120000 },
    { tipo: "ingreso", titulo: "Cobro masivo — Lote expensas Marzo", txid: "TX-2026-06-01-8861", cbu: "0000003100190123456789", entidad: "Lote expensas Marzo (84/128)", fecha: "01/06/2026", hora: "17:02", monto: 3840000 },
    { tipo: "ingreso", titulo: "Cobro masivo — Lote expensas Febrero", txid: "TX-2026-05-25-8862", cbu: "0000003100201234567890", entidad: "Lote expensas Febrero (76/128)", fecha: "25/05/2026", hora: "16:30", monto: 3520000 },
    { tipo: "ingreso", titulo: "Subcuenta creada por cobro masivo", txid: "CREACION-EXP-001", cbu: "0000003100190123456789", entidad: "Creacion automatica desde lote de cobros", fecha: "25/05/2026", hora: "16:30", monto: 0 },
  ],
  "Sueldos": [
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-06-01-8863", cbu: "0000003100212345678901", entidad: "Transferencia cuenta madre", fecha: "01/06/2026", hora: "14:30", monto: 980000 },
    { tipo: "egreso", titulo: "Retiraste dinero", txid: "TX-2026-05-25-8864", cbu: "0000003100223456789012", entidad: "Liquidacion mayo", fecha: "25/05/2026", hora: "10:00", monto: 950000 },
  ],
  "Fondos en garantia": [
    { tipo: "ingreso", titulo: "Ingresaste dinero", txid: "TX-2026-05-01-8865", cbu: "0000003100234567890123", entidad: "Aporte inicial", fecha: "01/05/2026", hora: "09:00", monto: 350000 },
  ],
};

const fmt = (n: number) => "$ " + n.toLocaleString("es-AR");

const fmtMov = (n: number) => (n >= 0 ? "+" : "") + "$ " + Math.abs(n).toLocaleString("es-AR");

function Page() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [transfOpen, setTransfOpen] = useState(false);
  const [detailSub, setDetailSub] = useState<Sub | null>(null);
  const [editSub, setEditSub] = useState<Sub | null>(null);
  const [deletedNames, setDeletedNames] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [estado, setEstado] = useState("Todos");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [confirmarBorrar, setConfirmarBorrar] = useState<Sub | null>(null);

  const filtradas = useMemo(
    () => subs.filter(s =>
      !deletedNames.has(s.n) &&
      (q === "" || s.n.toLowerCase().includes(q.toLowerCase()) || s.cbu.includes(q)) &&
      (tipo === "Todos" || s.tipo === tipo) &&
      (estado === "Todos" || s.e === estado)
    ),
    [q, tipo, estado, deletedNames]
  );

  const totalPages = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const paginated = filtradas.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [q, tipo, estado]);

  const total = subs.reduce((a, s) => a + s.disp + s.ret, 0);
  const totalDisp = subs.reduce((a, s) => a + s.disp, 0);
  const totalRet = subs.reduce((a, s) => a + s.ret, 0);

  return (
    <>
      <PageHeader
        title="Subcuentas"
        description="Una cuenta madre, multiples CBU. Gestiona fondos, responsables, limites."
        action={
          <div className="flex gap-2">
            <BtnOutline onClick={() => setTransfOpen(true)}><ArrowLeftRight size={14} /> Transferir entre subcuentas</BtnOutline>
            <BtnPrimary onClick={() => setNuevoOpen(true)}><Plus size={16} /> Nueva subcuenta</BtnPrimary>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Saldo total</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">{fmt(total)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{subs.length} subcuentas</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Disponible</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">{fmt(totalDisp)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Listo para operar</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Retenido</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">{fmt(totalRet)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Pendiente de liberar</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <PieChart size={11} /> Distribucion del saldo
          </div>
          <div className="text-[10px] mt-1.5 space-y-1.5">
            {subs.slice(0, 3).map((s) => {
              const pct = ((s.disp + s.ret) / total * 100).toFixed(1);
              return (
                <div key={s.n}>
                  <div className="flex justify-between text-[10px] leading-tight">
                    <span className="truncate mr-1">{s.n}</span>
                    <span className="font-semibold shrink-0">{fmt(s.disp + s.ret)} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-0.5">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
            {subs.length > 3 && <div className="text-[10px] text-muted-foreground pt-0.5">+{subs.length - 3} mas</div>}
          </div>
        </div>
      </div>

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full sm:flex-1 sm:min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o CBU..." className="pl-9" />
          </div>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>Todos</option><option>Operativa</option><option>Recaudacion</option><option>Garantias</option><option>Sueldos</option>
          </select>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>Todos</option><option>Activa</option><option>Pausada</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                <th className="text-left px-4 py-2.5">Nombre</th>
                <th className="text-left px-4 py-2.5">Apellido</th>
                <th className="text-left px-4 py-2.5">Email</th>
                <th className="text-left px-4 py-2.5">Estado</th>
                <th className="text-right px-4 py-2.5">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.n} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold">{s.n}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.apellido}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{s.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={s.e === "Activa" ? "success" : "warn"}>{s.e}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setDetailSub(s)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-muted transition" title="Ver detalle"><Eye size={14} /></button>
                      <button onClick={() => { setEditSub(s); setNuevoOpen(true); }} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-muted transition" title="Editar"><Pencil size={14} /></button>
                      <button onClick={() => setConfirmarBorrar(s)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-red-50 hover:text-red-600 transition" title="Borrar"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <span>{filtradas.length === 0 ? "0 registros" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtradas.length)} de ${filtradas.length}`}</span>
          <div className="flex gap-1">
            <BtnOutline className="h-7 px-2 text-[11px]" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</BtnOutline>
            <BtnOutline className="h-7 px-2 text-[11px]" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</BtnOutline>
          </div>
        </div>
      </Card>

      {detailSub && <SubDetailModal sub={detailSub} onClose={() => setDetailSub(null)} />}

      <FormDialog
        open={nuevoOpen}
        onClose={() => { setNuevoOpen(false); setEditSub(null); }}
        title={editSub ? "Editar subcuenta" : "Nueva subcuenta"}
        description={editSub ? "Modifica los datos de la subcuenta." : "Genera un CBU adicional asociado a tu cuenta madre."}
        submitLabel={editSub ? "Guardar cambios" : "Crear subcuenta"}
        onSubmit={() => { setNuevoOpen(false); setEditSub(null); toast.success(editSub ? "Subcuenta actualizada" : "Subcuenta creada correctamente"); }}
      >
        <div><Label>Nombre de la subcuenta</Label><Input placeholder="Ej. Sucursal Sur" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Tipo</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Operativa</option><option>Recaudacion</option><option>Garantias</option><option>Sueldos</option>
            </select>
          </div>
          <div><Label>Responsable</Label><Input placeholder="Usuario o area" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Limite diario (ARS)</Label><Input placeholder="0,00" /></div>
          <div><Label>Saldo inicial</Label><Input placeholder="$ 0,00" /></div>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" defaultChecked /> Activar inmediatamente al crear
        </label>
      </FormDialog>

      <FormDialog
        open={transfOpen}
        onClose={() => setTransfOpen(false)}
        title="Transferir entre subcuentas"
        description="Movimiento interno · acreditacion inmediata, sin comision."
        submitLabel="Transferir"
        onSubmit={() => { setTransfOpen(false); toast.success("Transferencia interna realizada"); }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Desde</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              {subs.map(s => <option key={s.n}>{s.n} — {fmt(s.disp)}</option>)}
            </select>
          </div>
          <div><Label>Hacia</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              {subs.map(s => <option key={s.n}>{s.n}</option>)}
            </select>
          </div>
        </div>
        <div><Label>Monto (ARS)</Label><Input placeholder="0,00" /></div>
        <div><Label>Concepto</Label><Input placeholder="Barrido fin de dia, fondeo, etc." /></div>
      </FormDialog>

      {detailSub && (
        <SubDetailModal
          sub={detailSub}
          onClose={() => setDetailSub(null)}
        />
      )}

      <ConfirmDialog
        open={confirmarBorrar !== null}
        title="¿Eliminar usuario de la subcuenta?"
        description={`Se quitara a ${confirmarBorrar?.apellido} (${confirmarBorrar?.n}) de esta subcuenta. Esta accion no se puede deshacer.`}
        onClose={() => setConfirmarBorrar(null)}
        onConfirm={() => {
          if (confirmarBorrar) {
            setDeletedNames((prev) => { const next = new Set(prev); next.add(confirmarBorrar.n); return next; });
            toast.success("Subcuenta eliminada");
          }
        }}
      />
    </>
  );
}

function SubDetailModal({ sub, onClose }: { sub: Sub; onClose: () => void }) {
  const [editEmail, setEditEmail] = useState(false);
  const [emailVal, setEmailVal] = useState(sub.email);
  const [moveOpen, setMoveOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTipo, setFilterTipo] = useState<"todos" | "ingreso" | "egreso">("todos");
  const [filterSearch, setFilterSearch] = useState("");

  const allMoves = movimientosPorSub[sub.n] ?? [];
  const moves = allMoves.filter((m) => {
    if (filterTipo !== "todos" && m.tipo !== filterTipo) return false;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      if (!m.txid.toLowerCase().includes(q) && !m.entidad.toLowerCase().includes(q) && !m.cbu.includes(q)) return false;
    }
    return true;
  });

  const totalDepositos = allMoves.filter(m => m.tipo === "ingreso").reduce((a, m) => a + m.monto, 0);
  const totalRetiros = allMoves.filter(m => m.tipo === "egreso").reduce((a, m) => a + m.monto, 0);
  const totalComisiones = allMoves.filter(m => m.entidad === "Moli Financial S.A.").reduce((a, m) => a + m.monto, 0);

  const confirmAction = (accion: string, detalle: string): boolean =>
    window.confirm(`¿Estas seguro de que queres ${accion}?\n\n${detalle}`);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-card w-full sm:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col shadow-xl rounded-t-xl sm:rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 bg-card border-b px-5 sm:px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <h2 className="text-base font-semibold">Detalles de Subcuenta</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-7">

          {/* ══════════ BLOQUE: Informacion general ══════════ */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Informacion general</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => { if (confirmAction("cambiar la contrasena de esta subcuenta", "Se enviara un enlace de restablecimiento al email del responsable.")) toast.success("Enlace de restablecimiento enviado"); }}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md border bg-card hover:bg-muted transition text-muted-foreground hover:text-foreground"
                  title="Cambiar contrasena"
                >
                  <Key size={13} />
                </button>
                <button
                  onClick={() => { if (confirmAction(sub.e === "Activa" ? "pausar esta subcuenta" : "reactivar esta subcuenta", "Los fondos quedaran " + (sub.e === "Activa" ? "congelados hasta que la reactives." : "disponibles nuevamente."))) toast.success(sub.e === "Activa" ? "Subcuenta pausada" : "Subcuenta reactivada"); }}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md border bg-card hover:bg-muted transition text-muted-foreground hover:text-foreground"
                  title={sub.e === "Activa" ? "Deshabilitar cuenta" : "Reactivar cuenta"}
                >
                  <Pause size={13} />
                </button>
                <button
                  onClick={() => { if (confirmAction("eliminar esta subcuenta", "Esta accion es irreversible. Todos los fondos seran transferidos a la cuenta madre.")) toast.success("Subcuenta eliminada"); }}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md border bg-card hover:bg-red-50 hover:text-red-600 transition text-muted-foreground"
                  title="Eliminar subcuenta"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {/* Nombre + Email editable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Nombre</span>
                  <p className="font-semibold mt-0.5">{sub.n}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Email</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {editEmail ? (
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          value={emailVal}
                          onChange={(e) => setEmailVal(e.target.value)}
                          className="h-8 text-sm flex-1 min-w-0"
                        />
                        <button
                          onClick={() => { setEditEmail(false); toast.success("Email actualizado"); }}
                          className="h-8 px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded border"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => { setEditEmail(false); setEmailVal(sub.email); }}
                          className="h-8 px-2 text-xs text-muted-foreground hover:bg-muted rounded border"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-muted-foreground">{emailVal}</span>
                        <button
                          onClick={() => setEditEmail(true)}
                          className="text-muted-foreground hover:text-foreground transition"
                          title="Editar email"
                        >
                          <Pencil size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge tone={sub.e === "Activa" ? "success" : "warn"}>
                  {sub.e === "Activa" ? "Activo" : "Desactivado"}
                </Badge>
                <Badge tone={sub.retirosHab ? "success" : "neutral"}>
                  <Lock size={11} className="inline mr-0.5" />
                  Retiros {sub.retirosHab ? "Habilitados" : "Deshabilitados"}
                </Badge>
              </div>
            </div>
          </section>

          {/* ══════════ BLOQUE: Informacion financiera ══════════ */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Informacion financiera</h3>
              <button
                onClick={() => setMoveOpen(true)}
                className="h-7 w-7 inline-flex items-center justify-center rounded-md border bg-card hover:bg-muted transition text-muted-foreground hover:text-foreground"
                title="Mover fondos"
              >
                <Building2 size={13} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Balance actual</div>
                <div className="font-display tabular-nums text-base font-semibold mt-1">{fmt(sub.disp)}</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total depositos</div>
                <div className="font-display tabular-nums text-base font-semibold mt-1 text-emerald-700">{fmt(totalDepositos)}</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total retiros</div>
                <div className="font-display tabular-nums text-base font-semibold mt-1 text-red-700">{fmt(totalRetiros)}</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total comisiones</div>
                <div className="font-display tabular-nums text-base font-semibold mt-1">{fmt(totalComisiones)}</div>
              </div>
            </div>
          </section>

          {/* ══════════ BLOQUE: Historial de movimientos ══════════ */}
          <section>
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h3 className="text-sm font-semibold">Historial de movimientos</h3>
              <div className="flex gap-2">
                <BtnOutline className="h-8 px-3 text-[11px]" onClick={() => toast.success("Reporte descargado (demo)")}>
                  <Download size={12} /> DESCARGAR REPORTE
                </BtnOutline>
                <BtnOutline className="h-8 px-3 text-[11px]" onClick={() => setFilterOpen(!filterOpen)}>
                  <Filter size={12} /> FILTRAR{filterOpen && <ChevronUp size={11} className="ml-1" />}
                </BtnOutline>
              </div>
            </div>

            {filterOpen && (
              <div className="mb-3 p-3 bg-muted/30 rounded-lg border space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Buscar</label>
                    <Input
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      placeholder="TXID, CBU o entidad..."
                      className="h-9 text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Tipo</label>
                    <select
                      value={filterTipo}
                      onChange={(e) => setFilterTipo(e.target.value as "todos" | "ingreso" | "egreso")}
                      className="h-9 px-3 rounded-md border bg-card text-sm w-full"
                    >
                      <option value="todos">Todos</option>
                      <option value="ingreso">Ingresos</option>
                      <option value="egreso">Egresos</option>
                    </select>
                  </div>
                </div>
                {moves.length < allMoves.length && (
                  <p className="text-[11px] text-muted-foreground">
                    {moves.length} de {allMoves.length} movimientos
                  </p>
                )}
              </div>
            )}

            <div className="max-h-[280px] overflow-y-auto border rounded-lg divide-y">
              {moves.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">Sin movimientos registrados</p>
              ) : (
                moves.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 hover:bg-muted/30 transition">
                    <span
                      className="mt-0.5 h-8 w-8 shrink-0 rounded-full inline-flex items-center justify-center text-xs"
                      style={{ background: m.tipo === "ingreso" ? "rgba(5,150,105,0.12)" : "rgba(220,38,38,0.12)" }}
                    >
                      {m.tipo === "ingreso"
                        ? <ArrowDownLeft size={15} className="text-emerald-700" />
                        : <ArrowUpRight size={15} className="text-red-700" />
                      }
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-sm font-semibold">{m.titulo}</p>
                          <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{m.txid}</p>
                        </div>
                        <span className={`font-mono tabular-nums text-sm font-semibold whitespace-nowrap shrink-0 ${m.tipo === "ingreso" ? "text-emerald-700" : "text-red-700"}`}>
                          {fmtMov(m.tipo === "ingreso" ? m.monto : -m.monto)}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                        <span>CBU/CVU: {m.cbu}</span>
                        <span>{m.entidad}</span>
                        <span>{m.fecha} · {m.hora}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* ── Mover fondos sub-dialog ── */}
        {moveOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMoveOpen(false)} />
            <div className="relative bg-card rounded-lg max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Mover fondos</h3>
                <button onClick={() => setMoveOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Direccion</Label>
                  <select className="w-full h-10 px-3 rounded-md border bg-card text-sm mt-1">
                    <option>Cuenta madre → {sub.n}</option>
                    <option>{sub.n} → Cuenta madre</option>
                  </select>
                </div>
                <div>
                  <Label>Monto (ARS)</Label>
                  <Input placeholder="0,00" className="mt-1" />
                </div>
                <div>
                  <Label>Concepto</Label>
                  <Input placeholder="Fondeo, barrido, etc." className="mt-1" />
                </div>
                <BtnPrimary
                  className="w-full mt-2"
                  onClick={() => { setMoveOpen(false); toast.success("Movimiento interno realizado"); }}
                >
                  Transferir
                </BtnPrimary>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
