import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, type ReactNode } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  PlayIcon,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { Card, BtnPrimary, BtnOutline, Badge } from "@/components/portal-shell";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import {
  getLoteById,
  getRegistrosByLoteId,
  getPagosByRegistroId,
  getCBUById,
  formatARS,
  estadoCatalogo,
  medioPagoLabels,
  iniciarLote,
  pausarLote,
  reanudarLote,
  eliminarLote,
  type Lote,
  type RegistroDeLote,
  type MedioPago,
} from "@/data/cobros-masivos";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/app/cobros/gestion/$id")({
  component: DetalleLote,
});

const ESTADO_STYLES: Record<string, string> = {
  cargado: "bg-muted text-muted-foreground",
  en_proceso: "bg-amber-100 text-amber-800",
  finalizado: "bg-emerald-100 text-emerald-700",
  pausado: "bg-blue-100 text-blue-700",
  eliminado: "bg-red-100 text-red-700",
  error: "bg-red-100 text-red-700",
};

const REGISTRO_ESTADO_BADGE: Record<string, { label: string; style: string }> = {
  pendiente: {
    label: "Pendiente",
    style: "bg-amber-100 text-amber-800",
  },
  pagado_total: {
    label: "Pagado",
    style: "bg-emerald-100 text-emerald-700",
  },
  pagado_parcial: {
    label: "Pago parcial",
    style: "bg-blue-100 text-blue-700",
  },
  vencido: {
    label: "Vencido",
    style: "bg-red-100 text-red-700",
  },
  error: {
    label: "Error",
    style: "bg-red-100 text-red-700",
  },
};

function DetalleLote() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lote = useMemo(() => getLoteById(id), [id, refresh]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const registros = useMemo(() => getRegistrosByLoteId(id), [id, refresh]);
  const registrosPaginados = registros.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(registros.length / pageSize));

  useEffect(() => { setPage(1); }, [registros.length]);

  const trigger = () => setRefresh((r) => r + 1);

  if (!lote) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={40} className="mx-auto mb-3 text-muted-foreground" />
        <h2 className="font-semibold">Lote no encontrado</h2>
        <p className="text-sm text-muted-foreground mt-1">
          El lote con ID {id} no existe o fue eliminado.
        </p>
        <BtnOutline className="mt-4" onClick={() => navigate({ to: "/app/cobros/gestion" })}>
          Volver a gestion
        </BtnOutline>
      </div>
    );
  }

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
      trigger();
    } else {
      toast.error("El lote no esta en estado pendiente");
    }
  };

  const handlePausar = () => {
    if (pausarLote(id)) {
      toast.success("Lote pausado");
      trigger();
    } else {
      toast.error("No se pudo pausar el lote");
    }
  };

  const handleReanudar = () => {
    if (reanudarLote(id)) {
      toast.success("Lote reanudado");
      trigger();
    } else {
      toast.error("No se pudo reanudar el lote");
    }
  };

  const handleEliminar = () => {
    if (eliminarLote(id)) {
      toast.success("Lote eliminado");
      navigate({ to: "/app/cobros/gestion" });
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
      Estado: REGISTRO_ESTADO_BADGE[r.estado]?.label ?? r.estado,
      "Link de pago": r.linkDePago ?? "-",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    XLSX.writeFile(wb, `cobros-lote-${lote.id}-${lote.nombre.replace(/\s/g, "-")}.xlsx`);
  };

  const renderAcciones = () => {
    const actions: {
      label: string;
      icon: ReactNode;
      onClick: () => void;
      variant: "primary" | "outline" | "danger";
    }[] = [];

    if (lote.estado === "cargado") {
      actions.push({
        label: "Iniciar lote",
        icon: <Play size={14} />,
        onClick: handleIniciar,
        variant: "primary",
      });
    }
    if (lote.estado === "en_proceso") {
      actions.push({
        label: "Pausar",
        icon: <Pause size={14} />,
        onClick: handlePausar,
        variant: "outline",
      });
    }
    if (lote.estado === "pausado") {
      actions.push({
        label: "Reanudar",
        icon: <PlayIcon size={14} />,
        onClick: handleReanudar,
        variant: "primary",
      });
    }
    if (lote.estado !== "finalizado" && lote.estado !== "eliminado") {
      actions.push({
        label: "Eliminar",
        icon: <Trash2 size={14} />,
        onClick: () => setConfirmarEliminar(true),
        variant: "danger",
      });
    }

    return actions;
  };

  const acciones = renderAcciones();

  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate({ to: "/app/cobros/gestion" })}
          className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{lote.nombre}</h2>
          <p className="text-xs text-muted-foreground">
            ID: {lote.id} · Periodo: {lote.periodo}
          </p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            ESTADO_STYLES[lote.estado]
          }`}
        >
          {estadoCatalogo[lote.estado]?.label ?? lote.estado}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-2 mb-6">
        {acciones.map((a) => {
          const Comp = a.variant === "primary" ? BtnPrimary : BtnOutline;
          const extraClass =
            a.variant === "danger" ? "border-red-200 text-red-700 hover:bg-red-50" : "";
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
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Info general */}
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Informacion general
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-semibold">{lote.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <span>{estadoCatalogo[lote.estado]?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creacion</span>
              <span>{lote.createdAt.slice(0, 10)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inicio</span>
              <span>{lote.fechaInicio?.slice(0, 10) ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finalizacion</span>
              <span>{lote.fechaFinalizacion?.slice(0, 10) ?? "-"}</span>
            </div>
          </div>
        </Card>

        {/* Estadisticas */}
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Estadisticas
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total registros</span>
              <span className="font-semibold">{totalRegistros}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">% Cobrado</span>
              <span className="font-semibold text-emerald-600">{pctCobrado}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pagos completos</span>
              <span className="font-semibold text-emerald-600">{cobrados}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pagos parciales</span>
              <span className="font-semibold text-amber-600">{parciales}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pendientes</span>
              <span className="font-semibold text-muted-foreground">{pendientes}</span>
            </div>
            {vencidos > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vencidos</span>
                <span className="font-semibold text-red-600">{vencidos}</span>
              </div>
            )}
            {conError > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Con error</span>
                <span className="font-semibold text-red-600">{conError}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Configuracion */}
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Configuracion
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Medios de pago</span>
              <span className="font-semibold text-right max-w-[180px]">
                {lote.mediosPago
                  .map((m) => medioPagoLabels[m as keyof typeof medioPagoLabels])
                  .join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pagos parciales</span>
              <span
                className={`font-semibold ${lote.pagosParcialesHabilitado ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                {lote.pagosParcialesHabilitado ? "Habilitados" : "Deshabilitados"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notificaciones</span>
              <span
                className={`font-semibold ${lote.notificacionesHabilitado ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                {lote.notificacionesHabilitado ? "Habilitadas" : "Deshabilitadas"}
              </span>
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

        {/* Montos */}
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Montos
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display tabular-nums font-semibold text-lg">{formatARS(montoTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cobrado</span>
              <span className="font-display tabular-nums font-semibold text-emerald-600">{formatARS(montoCobrado)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pendiente</span>
              <span className="font-display tabular-nums font-semibold text-amber-600">
                {formatARS(montoTotal - montoCobrado)}
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pctCobrado}%` }}
              />
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
                <th className="text-left px-3 py-3 font-semibold text-xs uppercase">
                  Vencimientos
                </th>
                <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Medios</th>
                <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Estado</th>
                <th className="text-left px-3 py-3 font-semibold text-xs uppercase">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {registrosPaginados.map((r) => {
                const cb = r.cbuId ? getCBUById(r.cbuId) : null;
                return (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-3 max-w-[180px]">
                      <div className="font-semibold truncate" title={r.descripcion}>
                        {r.descripcion}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">{r.id}</div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                      <span className="font-mono tabular-nums">{formatARS(r.monto)}</span>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <span
                        className={
                          r.montoPagado >= r.monto
                            ? "text-emerald-600 font-semibold font-mono tabular-nums"
                            : r.montoPagado > 0
                              ? "text-amber-600 font-semibold font-mono tabular-nums"
                              : "text-muted-foreground font-mono tabular-nums"
                        }
                      >
                        {formatARS(r.montoPagado)}
                      </span>
                    </td>
                    <td
                      className="px-3 py-3 text-xs"
                      title={`${r.tipoEntidad} ${r.idEntidad} - ${r.subEntidad}`}
                    >
                      <div className="font-medium">
                        {r.tipoEntidad} {r.idEntidad}
                      </div>
                      <div className="text-muted-foreground">{r.subEntidad}</div>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <div className="font-medium">{r.identificacionUsuario}</div>
                      {r.email && (
                        <div
                          className="text-muted-foreground truncate max-w-[120px]"
                          title={r.email}
                        >
                          {r.email}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[11px] whitespace-nowrap">
                      <div>1º: {r.fechaVencimiento1?.slice(0, 10) ?? "-"}</div>
                      {r.fechaVencimiento2 && <div>2º: {r.fechaVencimiento2.slice(0, 10)}</div>}
                      {r.fechaVencimiento3 && <div>3º: {r.fechaVencimiento3.slice(0, 10)}</div>}
                    </td>
                    <td className="px-3 py-3 text-[11px]">
                      {(r.mediosPago ?? lote.mediosPago).map((m) => (
                        <span
                          key={m}
                          className="inline-block px-1.5 py-0.5 rounded bg-muted mr-1 mb-0.5"
                        >
                          {medioPagoLabels[m as keyof typeof medioPagoLabels]}
                        </span>
                      ))}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          REGISTRO_ESTADO_BADGE[r.estado]?.style ?? ""
                        }`}
                      >
                        {REGISTRO_ESTADO_BADGE[r.estado]?.label ?? r.estado}
                      </span>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        {r.fechaPago && `Pagado: ${r.fechaPago.slice(0, 10)}`}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {r.linkDePago ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyLink(r.linkDePago!)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-muted transition"
                            title="Copiar link"
                          >
                            <Copy size={13} className="text-muted-foreground" />
                          </button>
                          <a
                            href={r.linkDePago}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-muted transition"
                            title="Abrir link"
                          >
                            <ExternalLink size={13} className="text-muted-foreground" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">-</span>
                      )}
                      {r.emailEnviado && (
                        <div className="text-[10px] text-emerald-600 mt-0.5">Email enviado</div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {registros.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No hay registros en este lote.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {registros.length > pageSize && (
          <div className="flex items-center justify-between px-5 py-3 border-t text-xs text-muted-foreground">
            <span>{`${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, registros.length)} de ${registros.length}`}</span>
            <div className="flex gap-1">
              <BtnOutline className="h-7 px-2 text-[11px]" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</BtnOutline>
              <BtnOutline className="h-7 px-2 text-[11px]" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</BtnOutline>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmarEliminar}
        title="¿Eliminar lote?"
        description="Esta accion no se puede deshacer. Los links de pago generados dejaran de funcionar."
        onClose={() => setConfirmarEliminar(false)}
        onConfirm={handleEliminar}
      />
    </div>
  );
}
