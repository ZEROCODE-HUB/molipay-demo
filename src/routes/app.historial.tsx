import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Download, Filter, FileText, ArrowDownLeft, ArrowUpRight,
  ChevronRight, Wallet, X, Eye, FileSpreadsheet, Share2,
} from "lucide-react";
import { PageHeader, Card, Input, BtnOutline, BtnPrimary, Badge } from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";
import { MollyLogo } from "@/components/molly-logo";

export const Route = createFileRoute("/app/historial")({ component: Page });

const formatARS = (n: number) =>
  `$ ${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const EMPRESA = {
  nombre: "Money Life S.R.L.",
  cuit: "30-71000000-0",
  cbu: "0000003100001234567890",
};

function isInternalTransfer(txid: string) {
  return /^\d+$/.test(txid);
}

function isCoelsa(txid: string) {
  return /^[A-Za-z0-9]{22}$/.test(txid);
}

function txidLabel(txid: string) {
  if (isInternalTransfer(txid)) return { label: "Transferencia interna", code: txid };
  if (isCoelsa(txid)) return { label: "Codigo COELSA", code: txid };
  return { label: "TXID", code: txid };
}

type Categoria = "Ingresos" | "Egresos" | "Comisiones" | "Cobros con Tarjeta" | "Pagos con QR" | "Cobros con QR";

type Mov = {
  txid: string;
  tipo: "ingreso" | "egreso";
  categoria: Categoria;
  titular: string;
  cuit: string;
  cbuCvu: string;
  fecha: string;
  monto: number;
  estado: "Acreditado" | "Pendiente" | "Rechazado";
  medio: string;
  referencia: string;
  usuario: string;
  numeroOp: string;
  canal: "Web" | "API" | "Movil";
  subcuenta: string;
  senderName: string;
  senderCuit: string;
  senderCbu: string;
  receiverName: string;
  receiverCuit: string;
  receiverCbu: string;
};

const movs: Mov[] = [
  { txid: "TX-2026-06-02-8841", tipo: "ingreso", categoria: "Cobros con QR", titular: "Carlos Mendez S.A.", cuit: "30-71234567-8", cbuCvu: "0000003100054321678901", fecha: "02/06/2026 14:32", monto: 1840000, estado: "Acreditado", medio: "Cobro QR", referencia: "QR-8821", usuario: "Sistema", numeroOp: "OP-2026-4421", canal: "Web", subcuenta: "Sucursal Centro", senderName: "Carlos Mendez S.A.", senderCuit: "30-71234567-8", senderCbu: "0000003100054321678901", receiverName: EMPRESA.nombre, receiverCuit: EMPRESA.cuit, receiverCbu: EMPRESA.cbu },
  { txid: "TX-2026-06-02-8842", tipo: "egreso", categoria: "Egresos", titular: "Proveedor SA", cuit: "30-71888888-1", cbuCvu: "0000003100023456789012", fecha: "02/06/2026 11:08", monto: 220000, estado: "Acreditado", medio: "Transferencia", referencia: "TR-9982", usuario: "Admin", numeroOp: "OP-2026-4422", canal: "Web", subcuenta: "Operaciones", senderName: EMPRESA.nombre, senderCuit: EMPRESA.cuit, senderCbu: EMPRESA.cbu, receiverName: "Proveedor SA", receiverCuit: "30-71888888-1", receiverCbu: "0000003100023456789012" },
  { txid: "8843", tipo: "ingreso", categoria: "Ingresos", titular: "Consorcio Av. Siempre Viva", cuit: "30-72345678-9", cbuCvu: "0000003100076543210987", fecha: "01/06/2026 18:30", monto: 1480500, estado: "Acreditado", medio: "Lote", referencia: "LT-0034", usuario: "Admin", numeroOp: "OP-2026-4423", canal: "Web", subcuenta: "Operaciones", senderName: "Consorcio Av. Siempre Viva", senderCuit: "30-72345678-9", senderCbu: "0000003100076543210987", receiverName: EMPRESA.nombre, receiverCuit: EMPRESA.cuit, receiverCbu: EMPRESA.cbu },
  { txid: "TX-2026-06-01-8844", tipo: "egreso", categoria: "Egresos", titular: "Edesur S.A.", cuit: "30-50000000-4", cbuCvu: "0000003100034567890123", fecha: "01/06/2026 16:12", monto: 64320, estado: "Acreditado", medio: "Servicio", referencia: "SV-1102", usuario: "Sistema", numeroOp: "OP-2026-4424", canal: "API", subcuenta: "Sucursal Norte", senderName: EMPRESA.nombre, senderCuit: EMPRESA.cuit, senderCbu: EMPRESA.cbu, receiverName: "Edesur S.A.", receiverCuit: "30-50000000-4", receiverCbu: "0000003100034567890123" },
  { txid: "LP9k2x7COELSA8823456", tipo: "ingreso", categoria: "Cobros con Tarjeta", titular: "Estudio Rios Asoc.", cuit: "30-73456789-0", cbuCvu: "0000003100045678901234", fecha: "31/05/2026 14:08", monto: 92800, estado: "Acreditado", medio: "Link de pago", referencia: "LP-9k2x7", usuario: "Sistema", numeroOp: "OP-2026-4425", canal: "Web", subcuenta: "Operaciones", senderName: "Estudio Rios Asoc.", senderCuit: "30-73456789-0", senderCbu: "0000003100045678901234", receiverName: EMPRESA.nombre, receiverCuit: EMPRESA.cuit, receiverCbu: EMPRESA.cbu },
  { txid: "COELSA9988776655443322", tipo: "egreso", categoria: "Egresos", titular: "Estudio Rios Asoc.", cuit: "30-73456789-0", cbuCvu: "0000003100045678901234", fecha: "30/05/2026 11:22", monto: 145000, estado: "Acreditado", medio: "Transferencia", referencia: "TR-9974", usuario: "Admin", numeroOp: "OP-2026-4426", canal: "Web", subcuenta: "Operaciones", senderName: EMPRESA.nombre, senderCuit: EMPRESA.cuit, senderCbu: EMPRESA.cbu, receiverName: "Estudio Rios Asoc.", receiverCuit: "30-73456789-0", receiverCbu: "0000003100045678901234" },
  { txid: "TX-2026-05-30-8847", tipo: "ingreso", categoria: "Cobros con QR", titular: "Lucia Fernandez", cuit: "27-38456789-1", cbuCvu: "0000003100056789012345", fecha: "30/05/2026 09:05", monto: 8200, estado: "Acreditado", medio: "Cobro QR", referencia: "QR-8820", usuario: "Sistema", numeroOp: "OP-2026-4427", canal: "Movil", subcuenta: "Sucursal Centro", senderName: "Lucia Fernandez", senderCuit: "27-38456789-1", senderCbu: "0000003100056789012345", receiverName: EMPRESA.nombre, receiverCuit: EMPRESA.cuit, receiverCbu: EMPRESA.cbu },
  { txid: "TX-2026-05-29-8848", tipo: "egreso", categoria: "Egresos", titular: "Juan Perez", cuit: "20-27890123-4", cbuCvu: "0000003100067890123456", fecha: "29/05/2026 17:44", monto: 35000, estado: "Pendiente", medio: "Transferencia", referencia: "TR-9968", usuario: "Admin", numeroOp: "OP-2026-4428", canal: "Web", subcuenta: "Sucursal Norte", senderName: EMPRESA.nombre, senderCuit: EMPRESA.cuit, senderCbu: EMPRESA.cbu, receiverName: "Juan Perez", receiverCuit: "20-27890123-4", receiverCbu: "0000003100067890123456" },
  { txid: "TX-2026-05-28-8849", tipo: "ingreso", categoria: "Ingresos", titular: "Inmobiliaria del Plata", cuit: "30-74567890-1", cbuCvu: "0000003100078901234567", fecha: "28/05/2026 10:30", monto: 2800000, estado: "Acreditado", medio: "Transferencia", referencia: "TR-9967", usuario: "Sistema", numeroOp: "OP-2026-4429", canal: "API", subcuenta: "Operaciones", senderName: "Inmobiliaria del Plata", senderCuit: "30-74567890-1", senderCbu: "0000003100078901234567", receiverName: EMPRESA.nombre, receiverCuit: EMPRESA.cuit, receiverCbu: EMPRESA.cbu },
  { txid: "TX-2026-05-27-8850", tipo: "egreso", categoria: "Egresos", titular: "AFIP", cuit: "30-50000000-4", cbuCvu: "0000003100089012345678", fecha: "27/05/2026 09:00", monto: 890000, estado: "Acreditado", medio: "Servicio", referencia: "SV-1101", usuario: "Sistema", numeroOp: "OP-2026-4430", canal: "API", subcuenta: "Operaciones", senderName: EMPRESA.nombre, senderCuit: EMPRESA.cuit, senderCbu: EMPRESA.cbu, receiverName: "AFIP", receiverCuit: "30-50000000-4", receiverCbu: "0000003100089012345678" },
  { txid: "TX-2026-05-26-8851", tipo: "ingreso", categoria: "Cobros con Tarjeta", titular: "Club Social y Deportivo", cuit: "30-75678901-2", cbuCvu: "0000003100090123456789", fecha: "26/05/2026 15:45", monto: 550000, estado: "Acreditado", medio: "Link de pago", referencia: "LP-9k2x6", usuario: "Sistema", numeroOp: "OP-2026-4431", canal: "Web", subcuenta: "Sucursal Centro", senderName: "Club Social y Deportivo", senderCuit: "30-75678901-2", senderCbu: "0000003100090123456789", receiverName: EMPRESA.nombre, receiverCuit: EMPRESA.cuit, receiverCbu: EMPRESA.cbu },
  { txid: "TX-2026-05-25-8852", tipo: "egreso", categoria: "Comisiones", titular: "OSECAC", cuit: "30-71000000-0", cbuCvu: "0000003100001234567890", fecha: "25/05/2026 08:30", monto: 420000, estado: "Rechazado", medio: "Comision", referencia: "TR-9966", usuario: "Admin", numeroOp: "OP-2026-4432", canal: "Web", subcuenta: "Sucursal Norte", senderName: EMPRESA.nombre, senderCuit: EMPRESA.cuit, senderCbu: EMPRESA.cbu, receiverName: "OSECAC", receiverCuit: "30-71000000-0", receiverCbu: "0000003100001234567890" },
  { txid: "TX-2026-05-24-8853", tipo: "ingreso", categoria: "Ingresos", titular: "Alquileres Galeria Central", cuit: "30-76789012-3", cbuCvu: "0000003100101234567890", fecha: "24/05/2026 11:00", monto: 3200000, estado: "Acreditado", medio: "Transferencia", referencia: "TR-9965", usuario: "Sistema", numeroOp: "OP-2026-4433", canal: "Web", subcuenta: "Operaciones", senderName: "Alquileres Galeria Central", senderCuit: "30-76789012-3", senderCbu: "0000003100101234567890", receiverName: EMPRESA.nombre, receiverCuit: EMPRESA.cuit, receiverCbu: EMPRESA.cbu },
  { txid: "TX-2026-05-23-8854", tipo: "egreso", categoria: "Pagos con QR", titular: "Proveedor Logistica SA", cuit: "30-77890123-4", cbuCvu: "0000003100112345678901", fecha: "23/05/2026 16:30", monto: 78000, estado: "Acreditado", medio: "Cobro QR", referencia: "QR-8819", usuario: "Admin", numeroOp: "OP-2026-4434", canal: "Movil", subcuenta: "Sucursal Centro", senderName: EMPRESA.nombre, senderCuit: EMPRESA.cuit, senderCbu: EMPRESA.cbu, receiverName: "Proveedor Logistica SA", receiverCuit: "30-77890123-4", receiverCbu: "0000003100112345678901" },
];

function parseRowDate(f: string): Date {
  const [d, t] = f.split(" ");
  const [dd, mm, yyyy] = d.split("/").map(Number);
  const [hh, min] = (t ?? "00:00").split(":").map(Number);
  return new Date(yyyy, mm - 1, dd, hh, min);
}

const CATEGORIAS: Array<{ k: string; l: string }> = [
  { k: "Todas", l: "Todas" },
  { k: "Ingresos", l: "Ingresos" },
  { k: "Egresos", l: "Egresos" },
  { k: "Comisiones", l: "Comisiones" },
  { k: "Cobros con Tarjeta", l: "Cobros con Tarjeta" },
  { k: "Pagos con QR", l: "Pagos con QR" },
  { k: "Cobros con QR", l: "Cobros con QR" },
];

function Page() {
  const [vista, setVista] = useState<"principal" | "sub">("principal");
  const [sub, setSub] = useState("Operaciones");
  const [preview, setPreview] = useState(false);
  const [detalle, setDetalle] = useState<Mov | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [subFiltro, setSubFiltro] = useState("Todas");
  const [buscarCbu, setBuscarCbu] = useState("");
  const [buscarCuit, setBuscarCuit] = useState("");
  const [buscarTxid, setBuscarTxid] = useState("");
  const [buscarTitular, setBuscarTitular] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const serie = "RP-EMP-2026-000042";

  const filtered = movs.filter((r) => {
    const rd = parseRowDate(r.fecha);
    if (desde) { const d1 = new Date(desde + "T00:00:00"); if (rd < d1) return false; }
    if (hasta) { const d2 = new Date(hasta + "T23:59:59"); if (rd > d2) return false; }
    if (categoria !== "Todas" && r.categoria !== categoria) return false;
    if (subFiltro !== "Todas" && r.subcuenta !== subFiltro) return false;
    if (buscarCbu && !r.cbuCvu.includes(buscarCbu)) return false;
    if (buscarCuit && !r.cuit.includes(buscarCuit)) return false;
    if (buscarTxid) {
      const q = buscarTxid.toLowerCase();
      if (!r.txid.toLowerCase().includes(q) && !r.numeroOp.toLowerCase().includes(q)) return false;
    }
    if (buscarTitular && !r.titular.toLowerCase().includes(buscarTitular.toLowerCase())) return false;
    return true;
  });

  const subcuentas = [...new Set(movs.map((m) => m.subcuenta))];
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [desde, hasta, categoria, subFiltro, buscarCbu, buscarCuit, buscarTxid, buscarTitular]);

  const totalIngresos = filtered.filter((r) => r.tipo === "ingreso").reduce((s, r) => s + r.monto, 0);
  const totalEgresos = filtered.filter((r) => r.tipo === "egreso").reduce((s, r) => s + r.monto, 0);
  const totalPendientes = filtered.filter((r) => r.estado === "Pendiente" || r.estado === "Rechazado").length;

  function limpiarFiltros() {
    setDesde(""); setHasta(""); setCategoria("Todas"); setSubFiltro("Todas");
    setBuscarCbu(""); setBuscarCuit(""); setBuscarTxid(""); setBuscarTitular("");
  }

  return (
    <>
      <PageHeader
        title="Historial"
        description="Auditoria completa de movimientos con filtros, exportacion y detalle de transacciones."
        action={
          <div className="flex gap-2">
            <BtnOutline onClick={() => setPreview(true)}><Download size={14} /> Exportar reporte</BtnOutline>
          </div>
        }
      />

      {/* Vista tabs */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Wallet size={14} className="text-muted-foreground" />
            <span className="font-semibold">Vista:</span>
          </div>
          <div className="flex gap-1.5">
            {([["principal", "Cuenta principal"], ["sub", "Por subcuenta"]] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setVista(k)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  vista === k
                    ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border-transparent"
                    : "bg-card hover:bg-muted"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {vista === "sub" && (
            <select value={sub} onChange={(e) => setSub(e.target.value)} className="h-9 px-3 rounded-md border bg-card text-sm">
              {subcuentas.map((s) => <option key={s}>{s}</option>)}
            </select>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {vista === "principal" ? "Mostrando consolidado de cuenta madre" : `Filtrando movimientos de ${sub}`}
          </span>
        </div>
      </Card>

      {/* KPIs resumen */}
      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground mb-1">Ingresos del periodo</div>
          <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-emerald-700">{formatARS(totalIngresos)}</div>
          <div className="text-xs text-muted-foreground mt-1">{filtered.filter((r) => r.tipo === "ingreso").length} movimientos</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground mb-1">Egresos del periodo</div>
          <div className="text-xl md:text-2xl font-bold text-foreground">{formatARS(totalEgresos)}</div>
          <div className="text-xs text-muted-foreground mt-1">{filtered.filter((r) => r.tipo === "egreso").length} movimientos</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground mb-1">Neto</div>
          <div className={`font-display tabular-nums text-xl md:text-2xl font-bold ${totalIngresos - totalEgresos >= 0 ? "text-emerald-700" : "text-red-600"}`}>
            {totalIngresos - totalEgresos >= 0 ? "+ " : "- "}{formatARS(Math.abs(totalIngresos - totalEgresos))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground mb-1">Pendientes / Rechazados</div>
          <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-foreground">{totalPendientes}</div>
          <div className="text-xs text-muted-foreground mt-1">{filtered.filter((r) => r.estado === "Pendiente").length} pendientes, {filtered.filter((r) => r.estado === "Rechazado").length} rechazados</div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        {/* Rango de fechas */}
        <div className="flex flex-wrap items-end gap-4 mb-5">
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Fecha de inicio</label>
            <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Fecha de fin</label>
            <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} min={desde || undefined} />
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Tipo de operacion</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="h-10 px-3 rounded-md border bg-card text-sm w-full sm:w-auto sm:min-w-[170px]">
              {CATEGORIAS.map(({ k, l }) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Subcuenta</label>
            <select value={subFiltro} onChange={(e) => setSubFiltro(e.target.value)} className="h-10 px-3 rounded-md border bg-card text-sm w-full sm:w-auto sm:min-w-[150px]">
              <option value="Todas">Todas</option>
              {subcuentas.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Busquedas independientes */}
        <div className="border-t pt-4 mb-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Busquedas especificas</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">CBU / CVU</label>
              <Input placeholder="Buscar por CBU/CVU..." value={buscarCbu} onChange={(e) => setBuscarCbu(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">CUIT</label>
              <Input placeholder="Buscar por CUIT..." value={buscarCuit} onChange={(e) => setBuscarCuit(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">TXID / N° Operacion</label>
              <Input placeholder="Buscar por TXID..." value={buscarTxid} onChange={(e) => setBuscarTxid(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Nombre del titular</label>
              <Input placeholder="Buscar por titular..." value={buscarTitular} onChange={(e) => setBuscarTitular(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="text-xs text-muted-foreground">
            {filtered.length} de {movs.length} movimientos
          </div>
          <div className="flex gap-2">
            <BtnOutline className="h-8 px-4 text-xs" onClick={limpiarFiltros}>
              Limpiar filtros
            </BtnOutline>
            <BtnOutline className="h-8 px-4 text-xs" onClick={() => setPreview(true)}>
              <Download size={13} /> Exportar
            </BtnOutline>
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                <th className="text-left px-5 py-3 font-semibold">Movimiento</th>
                <th className="text-left px-5 py-3 font-semibold">TXID</th>
                <th className="text-left px-5 py-3 font-semibold">CBU / CVU</th>
                <th className="text-left px-5 py-3 font-semibold">Titular</th>
                <th className="text-left px-5 py-3 font-semibold">CUIT</th>
                <th className="text-left px-5 py-3 font-semibold">Fecha</th>
                <th className="text-right px-5 py-3 font-semibold">Monto</th>
                <th className="px-5 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                    No hay movimientos que coincidan con los filtros.
                  </td>
                </tr>
              )}
              {paginated.map((r, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 min-w-0 max-w-[220px]">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        r.tipo === "ingreso" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}>
                        {r.tipo === "ingreso" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {r.tipo === "ingreso" ? "Recibiste dinero" : "Enviaste dinero"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">{r.medio} · {r.categoria}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-mono text-muted-foreground">{r.txid}</div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">{txidLabel(r.txid).label}</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-muted-foreground max-w-[140px] truncate">{r.cbuCvu}</td>
                  <td className="px-5 py-4 text-sm font-medium truncate max-w-[160px]">{r.titular}</td>
                  <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{r.cuit}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{r.fecha}</td>
                  <td className={`px-5 py-4 font-mono tabular-nums text-right font-semibold whitespace-nowrap text-sm ${r.tipo === "ingreso" ? "text-emerald-700" : ""}`}>
                    {r.tipo === "ingreso" ? "+ " : "- "}{formatARS(r.monto)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <button
                        title="Ver detalle"
                        onClick={() => setDetalle(r)}
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border bg-card hover:bg-accent hover:border-primary/40 transition"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        title="Descargar comprobante"
                        onClick={() => toast.success(`Comprobante ${r.txid} descargado`)}
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border bg-card hover:bg-accent hover:border-primary/40 transition"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        title="Compartir"
                        onClick={() => toast.success(`Enlace de comprobante ${r.txid} copiado`)}
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border bg-card hover:bg-accent hover:border-primary/40 transition"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        title="Ver mas"
                        onClick={() => setDetalle(r)}
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border bg-card hover:bg-accent hover:border-primary/40 transition"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t text-xs text-muted-foreground">
          <div>{filtered.length === 0 ? "0 registros" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} de ${filtered.length}`}</div>
          <div className="flex gap-2">
            <BtnOutline className="h-8 px-4 text-xs" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</BtnOutline>
            <BtnOutline className="h-8 px-4 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</BtnOutline>
          </div>
        </div>
      </Card>

      {/* Comprobante / Detalle */}
      {detalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetalle(null)} />
          <div className="relative bg-card rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10 rounded-t-xl">
              <div className="font-semibold">Comprobante de transaccion</div>
              <button onClick={() => setDetalle(null)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-accent transition">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tipo de operacion */}
              <div className="flex items-center gap-4 pb-5 border-b">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  detalle.tipo === "ingreso" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {detalle.tipo === "ingreso" ? <ArrowDownLeft size={26} /> : <ArrowUpRight size={26} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold">
                    {detalle.tipo === "ingreso" ? "Recibiste dinero" : "Enviaste dinero"}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{detalle.medio}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span>{detalle.fecha}</span>
                  </div>
                </div>
              </div>

              {/* Monto + Estado + ID */}
              <div className="flex items-end justify-between pb-5 border-b">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Monto</div>
                  <div className={`font-display tabular-nums text-2xl font-bold ${detalle.tipo === "ingreso" ? "text-emerald-700" : ""}`}>
                    {detalle.tipo === "ingreso" ? "+ " : "- "}{formatARS(detalle.monto)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Estado</div>
                  <Badge tone={detalle.estado === "Acreditado" ? "success" : detalle.estado === "Pendiente" ? "warn" : "danger"}>
                    {detalle.estado}
                  </Badge>
                </div>
              </div>

              {/* TXID con identificacion */}
              <div className="pb-5 border-b">
                <div className="text-xs text-muted-foreground mb-1">{txidLabel(detalle.txid).label}</div>
                <div className="font-mono text-sm font-medium break-all">{detalle.txid}</div>
              </div>

              {/* Desde */}
              <div className="pb-5 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Desde</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Nombre</div>
                    <div className="font-medium truncate">{detalle.senderName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">CUIT</div>
                    <div className="font-mono text-xs">{detalle.senderCuit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">CBU / CVU</div>
                    <div className="font-mono text-xs truncate">{detalle.senderCbu}</div>
                  </div>
                </div>
              </div>

              {/* Hacia */}
              <div className="pb-5 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hacia</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Nombre</div>
                    <div className="font-medium truncate">{detalle.receiverName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">CUIT</div>
                    <div className="font-mono text-xs">{detalle.receiverCuit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">CBU / CVU</div>
                    <div className="font-mono text-xs truncate">{detalle.receiverCbu}</div>
                  </div>
                </div>
              </div>

              {/* Info adicional */}
              <div className="grid grid-cols-2 gap-4 text-sm pb-2">
                <div>
                  <div className="text-xs text-muted-foreground">N° de operacion</div>
                  <div className="font-medium">{detalle.numeroOp}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Referencia</div>
                  <div className="font-mono text-xs">{detalle.referencia}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Canal de origen</div>
                  <div>{detalle.canal}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Usuario</div>
                  <div>{detalle.usuario}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Subcuenta</div>
                  <div>{detalle.subcuenta}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Categoria</div>
                  <div>{detalle.categoria}</div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-4 border-t">
                <BtnPrimary className="flex-1" onClick={() => { toast.success(`Comprobante ${detalle.txid} descargado`); }}>
                  <Download size={15} /> Descargar comprobante
                </BtnPrimary>
                <BtnOutline className="flex-1" onClick={() => { toast.success(`Enlace de comprobante ${detalle.txid} copiado al portapapeles`); }}>
                  <Share2 size={15} /> Compartir comprobante
                </BtnOutline>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros avanzados */}
      <FormDialog
        open={false}
        onClose={() => {}}
        title="Filtros avanzados"
        description="Combina criterios para acotar tu historial."
        submitLabel="Aplicar filtros"
        size="lg"
        onSubmit={() => {}}
      >
        <div />
      </FormDialog>

      {/* Preview reporte */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreview(false)} />
          <div className="relative bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10 rounded-t-xl">
              <div className="font-semibold">Vista previa del reporte</div>
              <BtnOutline className="h-8 px-4 text-xs" onClick={() => setPreview(false)}>Cerrar</BtnOutline>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex items-center justify-between border-b pb-5">
                <MollyLogo />
                <div className="text-right text-xs text-muted-foreground">
                  <div className="font-mono font-semibold text-foreground">{serie}</div>
                  <div>Generado: {new Date().toLocaleString("es-AR")}</div>
                </div>
              </div>
              <h2 className="text-xl font-semibold">Reporte de movimientos</h2>
              <div className="text-sm text-muted-foreground">
                {vista === "principal" ? "Cuenta principal (consolidado)" : `Subcuenta: ${sub}`}
                {categoria !== "Todas" && ` · Categoria: ${categoria}`}
              </div>
              <Card className="bg-muted/30 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div><div className="text-xs text-muted-foreground">Ingresos</div><div className="font-display tabular-nums font-semibold">{formatARS(totalIngresos)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Egresos</div><div className="font-display tabular-nums font-semibold">{formatARS(totalEgresos)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Neto</div><div className="font-display tabular-nums font-semibold text-emerald-700">{totalIngresos - totalEgresos >= 0 ? "+ " : "- "}{formatARS(Math.abs(totalIngresos - totalEgresos))}</div></div>
                </div>
              </Card>
              <div className="text-xs text-muted-foreground border-t pt-4">
                Documento firmado digitalmente por {EMPRESA.nombre} · Serie {serie}
              </div>
              <div className="flex gap-3 pt-2">
                <BtnOutline className="flex-1" onClick={() => { setPreview(false); toast.success("Reporte Excel descargado"); }}>
                  <FileSpreadsheet size={14} /> Excel (.xlsx)
                </BtnOutline>
                <BtnPrimary className="flex-1" onClick={() => { setPreview(false); toast.success(`Reporte ${serie} descargado`); }}>
                  <Download size={14} /> PDF
                </BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
