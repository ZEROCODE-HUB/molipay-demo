import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, type ReactNode } from "react";
import {
  Plus, Eye, FileSpreadsheet, Download, Search, Filter, X,
  Play, Pause, PlayIcon, Trash2, Copy, ExternalLink,
} from "lucide-react";
import { Card, BtnPrimary, BtnOutline, Input, Label } from "@/components/portal-shell";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import {
  getLotesGestion,
  getLoteById,
  getRegistrosByLoteId,
  getCBUById,
  formatARS,
  estadoCatalogo,
  medioPagoLabels,
  iniciarLote,
  pausarLote,
  reanudarLote,
  eliminarLote,
  type LoteEstado,
  type Lote,
} from "@/data/cobros-masivos";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const Route = createFileRoute("/app/cobros/gestion")({ component: GestionLotes });

const ESTADO_BADGE: Record<LoteEstado, string> = {
  cargado: "bg-muted text-muted-foreground",
  en_proceso: "bg-amber-100 text-amber-800",
  finalizado: "bg-emerald-100 text-emerald-700",
  pausado: "bg-blue-100 text-blue-700",
  eliminado: "bg-red-100 text-red-700",
  error: "bg-red-100 text-red-700",
};

const ESTADO_LABEL: Record<LoteEstado, string> = {
  cargado: "Cargado / Pendiente",
  en_proceso: "En proceso",
  finalizado: "Finalizado",
  pausado: "Pausado",
  eliminado: "Eliminado",
  error: "Con error",
};

const estados = Object.keys(estadoCatalogo) as LoteEstado[];

function GestionLotes() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<LoteEstado | "todos">("todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detalleLote, setDetalleLote] = useState<Lote | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<string | null>(null);

  const ejecutarEliminar = () => {
    if (confirmarEliminarId !== null && eliminarLote(confirmarEliminarId)) {
      toast.success("Lote eliminado");
      setDetalleOpen(false);
      setDetalleLote(null);
    }
  };

  const lotes = useMemo(() => {
    let data = getLotesGestion();
    if (busqueda) {
      const q = busqueda.toLowerCase();
      data = data.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.periodo.includes(q),
      );
    }
    if (filtroEstado !== "todos") {
      data = data.filter((l) => l.estado === filtroEstado);
    }
    if (fechaDesde) {
      data = data.filter((l) => l.createdAt.slice(0, 10) >= fechaDesde);
    }
    if (fechaHasta) {
      data = data.filter((l) => l.createdAt.slice(0, 10) <= fechaHasta);
    }
    return data;
  }, [busqueda, filtroEstado, fechaDesde, fechaHasta]);

  useEffect(() => { setPage(1); }, [busqueda, filtroEstado, fechaDesde, fechaHasta]);

  const totalPages = Math.max(1, Math.ceil(lotes.length / pageSize));
  const paginated = lotes.slice((page - 1) * pageSize, page * pageSize);

  const abrirDetalle = (id: string) => {
    const lote = getLoteById(id);
    if (lote) {
      setDetalleLote(lote);
      setDetalleOpen(true);
    }
  };

  const ROWS_OPTIONS = [10, 20, 50];

  const exportExcel = () => {
    const rows = lotes.map((l) => ({
      ID: l.id,
      Nombre: l.nombre,
      Periodo: l.periodo,
      Estado: ESTADO_LABEL[l.estado],
      "Fecha creacion": l.createdAt,
      "Fecha finalizacion": l.fechaFinalizacion ?? "-",
      Progreso: `${l.progreso}%`,
      "Pagos completos": l.cantidadPagos,
      "Pagos parciales": l.cantidadParciales,
      Pendientes: l.cantidadPendientes,
      "Monto total": l.montoTotal,
      "Monto cobrado": l.montoCobrado,
      "Por cobrar": l.montoPorCobrar,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lotes");
    XLSX.writeFile(wb, "cobros-masivos-lotes.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF("landscape");
    doc.text("Reporte de Lotes - Cobros Masivos", 14, 20);
    const total = lotes.reduce((s, l) => s + l.montoTotal, 0);
    const cobrado = lotes.reduce((s, l) => s + l.montoCobrado, 0);
    doc.text(
      `Monto total: ${formatARS(total)} | Cobrado: ${formatARS(cobrado)} | Tasa: ${total > 0 ? Math.round((cobrado / total) * 100) : 0}%`,
      14,
      30,
    );
    const body = lotes.map((l) => [
      l.nombre,
      ESTADO_LABEL[l.estado],
      `${l.progreso}%`,
      formatARS(l.montoTotal),
      formatARS(l.montoCobrado),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      startY: 38,
      head: [["Nombre", "Estado", "Progreso", "Monto total", "Cobrado"]],
      body,
    });
    doc.save("cobros-masivos-lotes.pdf");
  };

  return (
    <>
      {/* Acciones globales */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <BtnPrimary onClick={() => navigate({ to: "/app/cobros/nuevo" })}>
          <Plus size={16} /> Nuevo lote
        </BtnPrimary>
        <BtnOutline className="h-9 px-3 text-xs" onClick={exportExcel}>
          <FileSpreadsheet size={14} /> Excel
        </BtnOutline>
        <BtnOutline className="h-9 px-3 text-xs" onClick={exportPDF}>
          <Download size={14} /> PDF
        </BtnOutline>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar por nombre, ID o periodo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as LoteEstado | "todos")}
              className="h-10 px-3 rounded-md border bg-card text-sm"
            >
              <option value="todos">Todos los estados</option>
              {estados.map((e) => (
                <option key={e} value={e}>
                  {ESTADO_LABEL[e]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <Label>Desde</Label>
            <Input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="h-9 w-36 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Label>Hasta</Label>
            <Input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="h-9 w-36 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Tabla de lotes */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Nombre
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Fecha creacion
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Finalizacion
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Progreso
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Pagos
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Parciales
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Pend.
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Monto total
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Cobrado
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Por cobrar
                </th>
                <th className="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Accion
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-semibold">{l.nombre}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {l.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {l.fechaFinalizacion?.slice(0, 10) ?? "-"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        ESTADO_BADGE[l.estado]
                      }`}
                    >
                      {ESTADO_LABEL[l.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${l.progreso}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{l.progreso}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right">{l.cantidadPagos}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right text-amber-600">{l.cantidadParciales}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right text-muted-foreground">
                    {l.cantidadPendientes}
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right font-semibold">{formatARS(l.montoTotal)}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right text-emerald-600 font-semibold">
                    {formatARS(l.montoCobrado)}
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right text-amber-600 font-semibold">
                    {formatARS(l.montoPorCobrar)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <BtnOutline
                      onClick={() => abrirDetalle(l.id)}
                      className="h-8 px-2.5 text-xs"
                      title="Ver detalle"
                    >
                      <Eye size={14} /> Ver
                    </BtnOutline>
                  </td>
                </tr>
              ))}
              {lotes.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No se encontraron lotes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Paginacion */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Filas por pagina:</span>
          <select
            className="h-8 px-2 rounded border bg-card text-xs"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {ROWS_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>
            {lotes.length === 0
              ? "0 registros"
              : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, lotes.length)} de ${lotes.length}`}
          </span>
        </div>
        <div className="flex gap-1">
          <BtnOutline className="h-8 px-3 text-xs" disabled={page <= 1} onClick={() => setPage(1)}>
            Primero
          </BtnOutline>
          <BtnOutline className="h-8 px-3 text-xs" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Anterior
          </BtnOutline>
          <span className="flex items-center px-3 text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <BtnOutline className="h-8 px-3 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Siguiente
          </BtnOutline>
          <BtnOutline className="h-8 px-3 text-xs" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
            Ultimo
          </BtnOutline>
        </div>
      </div>

      {/* Modal: Detalle del lote */}
      {detalleOpen && detalleLote && (() => {
        const lote = detalleLote;
        const id = lote.id;
        const registros = getRegistrosByLoteId(id);
        const totalRegistros = registros.length;
        const cobrados = registros.filter((r) => r.estado === "pagado_total").length;
        const parciales = registros.filter((r) => r.estado === "pagado_parcial").length;
        const pendientes = registros.filter((r) => r.estado === "pendiente").length;
        const vencidos = registros.filter((r) => r.estado === "vencido").length;
        const conError = registros.filter((r) => r.estado === "error").length;
        const montoTotal = registros.reduce((s, r) => s + r.monto, 0);
        const montoCobrado = registros.reduce((s, r) => s + r.montoPagado, 0);
        const pctCobrado = montoTotal > 0 ? Math.round((montoCobrado / montoTotal) * 100) : 0;

        const handleIniciar = () => {
          if (iniciarLote(id)) {
            toast.success("Lote iniciado - se generaron los links de pago");
            setDetalleLote(getLoteById(id) ?? null);
          } else {
            toast.error("El lote no esta en estado pendiente");
          }
        };
        const handlePausar = () => {
          if (pausarLote(id)) {
            toast.success("Lote pausado");
            setDetalleLote(getLoteById(id) ?? null);
          } else {
            toast.error("No se pudo pausar el lote");
          }
        };
        const handleReanudar = () => {
          if (reanudarLote(id)) {
            toast.success("Lote reanudado");
            setDetalleLote(getLoteById(id) ?? null);
          } else {
            toast.error("No se pudo reanudar el lote");
          }
        };
        const copyLink = (url: string) => {
          navigator.clipboard.writeText(url);
          toast.success("Link copiado al portapapeles");
        };
        const exportExcel = () => {
          const rows = registros.map((r) => ({
            Descripcion: r.descripcion,
            Monto: r.monto,
            Pagado: r.montoPagado,
            "Fecha creacion": r.createdAt.slice(0, 10),
            "1er vencimiento": r.fechaVencimiento1 ?? "-",
            "2do vencimiento": r.fechaVencimiento2 ?? "-",
            "3er vencimiento": r.fechaVencimiento3 ?? "-",
            Email: r.email ?? "-",
            "Tipo entidad": r.tipoEntidad,
            "ID entidad": r.idEntidad,
            "Sub entidad": r.subEntidad,
            "Identificacion usuario": r.identificacionUsuario,
            "Fecha pago": r.fechaPago?.slice(0, 10) ?? "-",
            Estado: r.estado,
            "Link de pago": r.linkDePago ?? "-",
          }));
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Registros");
          XLSX.writeFile(wb, `cobros-lote-${lote.id}.xlsx`);
        };

        const renderAcciones = () => {
          const actions: {
            label: string;
            icon: ReactNode;
            onClick: () => void;
            variant: "primary" | "outline" | "danger";
          }[] = [];
          if (lote.estado === "cargado") {
            actions.push({ label: "Iniciar lote", icon: <Play size={14} />, onClick: handleIniciar, variant: "primary" });
          }
          if (lote.estado === "en_proceso") {
            actions.push({ label: "Pausar", icon: <Pause size={14} />, onClick: handlePausar, variant: "outline" });
          }
          if (lote.estado === "pausado") {
            actions.push({ label: "Reanudar", icon: <PlayIcon size={14} />, onClick: handleReanudar, variant: "primary" });
          }
          if (lote.estado !== "finalizado" && lote.estado !== "eliminado") {
            actions.push({ label: "Eliminar", icon: <Trash2 size={14} />, onClick: () => setConfirmarEliminarId(id), variant: "danger" });
          }
          return actions;
        };

        const acciones = renderAcciones();
        const ESTADO_STYLES: Record<string, string> = {
          cargado: "bg-muted text-muted-foreground",
          en_proceso: "bg-amber-100 text-amber-800",
          finalizado: "bg-emerald-100 text-emerald-700",
          pausado: "bg-blue-100 text-blue-700",
          eliminado: "bg-red-100 text-red-700",
          error: "bg-red-100 text-red-700",
        };
        const REGISTRO_ESTADO_BADGE: Record<string, { label: string; style: string }> = {
          pendiente: { label: "Pendiente", style: "bg-amber-100 text-amber-800" },
          pagado_total: { label: "Pagado", style: "bg-emerald-100 text-emerald-700" },
          pagado_parcial: { label: "Pago parcial", style: "bg-blue-100 text-blue-700" },
          vencido: { label: "Vencido", style: "bg-red-100 text-red-700" },
          error: { label: "Error", style: "bg-red-100 text-red-700" },
        };

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDetalleOpen(false)} />
            <div className="relative bg-card rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate">{lote.nombre}</h3>
                    <p className="text-xs text-muted-foreground">ID: {lote.id} &middot; Periodo: {lote.periodo}</p>
                  </div>
                  <span className={`shrink-0 inline-block px-3 py-1 rounded-full text-xs font-semibold ${ESTADO_STYLES[lote.estado]}`}>
                    {estadoCatalogo[lote.estado]?.label ?? lote.estado}
                  </span>
                </div>
                <button onClick={() => setDetalleOpen(false)} className="shrink-0 p-1.5 hover:bg-muted rounded-md">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {acciones.map((a) => {
                    const Comp = a.variant === "primary" ? BtnPrimary : BtnOutline;
                    const extraClass = a.variant === "danger" ? "border-red-200 text-red-700 hover:bg-red-50" : "";
                    return (
                      <Comp key={a.label} className={`h-9 px-3 text-xs ${extraClass}`} onClick={a.onClick}>
                        {a.icon} {a.label}
                      </Comp>
                    );
                  })}
                  <div className="flex-1" />
                  <BtnOutline className="h-9 px-3 text-xs" onClick={exportExcel}>
                    <FileSpreadsheet size={14} /> Exportar Excel
                  </BtnOutline>
                </div>

                {/* 4 bloques de informacion */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Informacion general</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-semibold">{lote.id}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Estado</span><span>{estadoCatalogo[lote.estado]?.label}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Creacion</span><span>{lote.createdAt.slice(0, 10)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Inicio</span><span>{lote.fechaInicio?.slice(0, 10) ?? "-"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Finalizacion</span><span>{lote.fechaFinalizacion?.slice(0, 10) ?? "-"}</span></div>
                    </div>
                  </Card>
                  <Card>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Estadisticas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Total registros</span><span className="font-semibold">{totalRegistros}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">% Cobrado</span><span className="font-semibold text-emerald-600">{pctCobrado}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Pagos completos</span><span className="font-semibold text-emerald-600">{cobrados}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Pagos parciales</span><span className="font-semibold text-amber-600">{parciales}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Pendientes</span><span className="font-semibold text-muted-foreground">{pendientes}</span></div>
                      {vencidos > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Vencidos</span><span className="font-semibold text-red-600">{vencidos}</span></div>}
                      {conError > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Con error</span><span className="font-semibold text-red-600">{conError}</span></div>}
                    </div>
                  </Card>
                  <Card>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Configuracion</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medios de pago</span>
                        <span className="font-semibold text-right max-w-[180px]">{lote.mediosPago.map((m) => medioPagoLabels[m as keyof typeof medioPagoLabels]).join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pagos parciales</span>
                        <span className={`font-semibold ${lote.pagosParcialesHabilitado ? "text-emerald-600" : "text-muted-foreground"}`}>{lote.pagosParcialesHabilitado ? "Habilitados" : "Deshabilitados"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Notificaciones</span>
                        <span className={`font-semibold ${lote.notificacionesHabilitado ? "text-emerald-600" : "text-muted-foreground"}`}>{lote.notificacionesHabilitado ? "Habilitadas" : "Deshabilitadas"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cuenta</span>
                        <span className="font-semibold">Operaciones</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tasa interes</span>
                        <span className="font-semibold">{lote.tasaInteres}%</span>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Montos</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-display tabular-nums font-semibold text-lg">{formatARS(montoTotal)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Cobrado</span><span className="font-display tabular-nums font-semibold text-emerald-600">{formatARS(montoCobrado)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pendiente</span><span className="font-display tabular-nums font-semibold text-amber-600">{formatARS(montoTotal - montoCobrado)}</span></div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden mt-2">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pctCobrado}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground text-center">{pctCobrado}% cobrado</div>
                    </div>
                  </Card>
                </div>

                {/* Tabla de registros */}
                <Card className="p-0 overflow-hidden">
                  <div className="px-5 py-4 border-b flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Registros del lote</div>
                      <div className="text-xs text-muted-foreground">{totalRegistros} registros</div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Descripcion</th>
                          <th className="text-right px-3 py-3 font-semibold text-xs uppercase">Monto</th>
                          <th className="text-right px-3 py-3 font-semibold text-xs uppercase">Pagado</th>
                          <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Entidad</th>
                          <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Usuario</th>
                          <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Vencimientos</th>
                          <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Medios</th>
                          <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Estado</th>
                          <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {registros.map((r) => {
                          const cb = r.cbuId ? getCBUById(r.cbuId) : null;
                          return (
                            <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-3 py-3 max-w-[180px]">
                                <div className="font-semibold truncate" title={r.descripcion}>{r.descripcion}</div>
                                <div className="text-[10px] text-muted-foreground">{r.id}</div>
                              </td>
                              <td className="px-3 py-3 font-mono tabular-nums text-right font-semibold whitespace-nowrap">{formatARS(r.monto)}</td>
                              <td className="px-3 py-3 text-right whitespace-nowrap">
                                <span className={`${r.montoPagado >= r.monto ? "text-emerald-600" : r.montoPagado > 0 ? "text-amber-600" : "text-muted-foreground"} font-mono tabular-nums font-semibold`}>
                                  {formatARS(r.montoPagado)}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-xs" title={`${r.tipoEntidad} ${r.idEntidad} - ${r.subEntidad}`}>
                                <div className="font-medium">{r.tipoEntidad} {r.idEntidad}</div>
                                <div className="text-muted-foreground">{r.subEntidad}</div>
                              </td>
                              <td className="px-3 py-3 text-xs">
                                <div className="font-medium">{r.identificacionUsuario}</div>
                                {r.email && <div className="text-muted-foreground truncate max-w-[120px]" title={r.email}>{r.email}</div>}
                              </td>
                              <td className="px-3 py-3 text-[11px] whitespace-nowrap">
                                <div>1&ordm;: {r.fechaVencimiento1?.slice(0, 10) ?? "-"}</div>
                                {r.fechaVencimiento2 && <div>2&ordm;: {r.fechaVencimiento2.slice(0, 10)}</div>}
                                {r.fechaVencimiento3 && <div>3&ordm;: {r.fechaVencimiento3.slice(0, 10)}</div>}
                              </td>
                              <td className="px-3 py-3 text-[11px]">
                                {(r.mediosPago ?? lote.mediosPago).map((m) => (
                                  <span key={m} className="inline-block px-1.5 py-0.5 rounded bg-muted mr-1 mb-0.5">
                                    {medioPagoLabels[m as keyof typeof medioPagoLabels]}
                                  </span>
                                ))}
                              </td>
                              <td className="px-3 py-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${REGISTRO_ESTADO_BADGE[r.estado]?.style ?? ""}`}>
                                  {REGISTRO_ESTADO_BADGE[r.estado]?.label ?? r.estado}
                                </span>
                                <div className="mt-1 text-[10px] text-muted-foreground">{r.fechaPago && `Pagado: ${r.fechaPago.slice(0, 10)}`}</div>
                              </td>
                              <td className="px-3 py-3">
                                {r.linkDePago ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => copyLink(r.linkDePago!)} className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-muted transition" title="Copiar link">
                                      <Copy size={13} className="text-muted-foreground" />
                                    </button>
                                    <a href={r.linkDePago} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-muted transition" title="Abrir link">
                                      <ExternalLink size={13} className="text-muted-foreground" />
                                    </a>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground">-</span>
                                )}
                                {r.emailEnviado && <div className="text-[10px] text-emerald-600 mt-0.5">Email enviado</div>}
                              </td>
                            </tr>
                          );
                        })}
                        {registros.length === 0 && (
                          <tr>
                            <td colSpan={9} className="px-5 py-8 text-center text-sm text-muted-foreground">No hay registros en este lote.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      })()}

      <ConfirmDialog
        open={confirmarEliminarId !== null}
        title="¿Eliminar lote?"
        description="Esta accion no se puede deshacer. Los links de pago generados dejaran de funcionar."
        onClose={() => setConfirmarEliminarId(null)}
        onConfirm={ejecutarEliminar}
      />
    </>
  );
}
