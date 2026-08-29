import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Eye, FileSpreadsheet, Download } from "lucide-react";
import { Card, BtnOutline, Input, Label } from "@/components/portal-shell";
import {
  periodFilter,
  computeDashboardKPI,
  computePorMedio,
  computePorVencimiento,
  computeNoCobradas,
  computeEvolucion,
  computeLotesRecientes,
  formatARS,
  medioPagoLabels,
  estadoCatalogo,
  type PeriodFilter,
  type LoteEstado,
} from "@/data/cobros-masivos";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const Route = createFileRoute("/app/cobros/")({ component: Dashboard });

const presets = [
  { label: "7 dias", days: 7 },
  { label: "15 dias", days: 15 },
  { label: "30 dias", days: 30 },
  { label: "60 dias", days: 60 },
  { label: "90 dias", days: 90 },
  { label: "Todos", days: 9999 },
];

const MEDIO_COLORS: Record<string, string> = {
  TRANSFERENCIA: "#324595",
  TARJETA_CREDITO: "#D3001F",
  TARJETA_DEBITO: "#000000",
  QR: "#1E8E3E",
};

const VENC_COLORS = ["#1E8E3E", "#E37B1A", "#D3001F"];

const ESTADO_BADGE: Record<LoteEstado, string> = {
  cargado: "bg-plata-200 text-black-600",
  en_proceso: "bg-warning-bg text-warning",
  finalizado: "bg-success-bg text-success",
  pausado: "bg-navy-50 text-navy-500",
  eliminado: "bg-error-bg text-error",
  error: "bg-error-bg text-error",
};

const ESTADO_LABEL: Record<LoteEstado, string> = {
  cargado: "Cargado / Pendiente",
  en_proceso: "En proceso",
  finalizado: "Finalizado",
  pausado: "Pausado",
  eliminado: "Eliminado",
  error: "Con error",
};

function Dashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PeriodFilter>(periodFilter("30 dias", 30));
  const [customDesde, setCustomDesde] = useState("");
  const [customHasta, setCustomHasta] = useState("");

  const kpi = useMemo(() => computeDashboardKPI(filter), [filter]);
  const porMedio = useMemo(() => computePorMedio(filter), [filter]);
  const porVencimiento = useMemo(() => computePorVencimiento(filter), [filter]);
  const noCobradas = useMemo(() => computeNoCobradas(filter), [filter]);
  const evolucion = useMemo(() => computeEvolucion(filter), [filter]);
  const lotesRecientes = useMemo(() => computeLotesRecientes(filter), [filter]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metrica: "Total de lotes", Valor: kpi.totalLotes },
      { Metrica: "En proceso", Valor: kpi.enProceso },
      { Metrica: "Finalizados", Valor: kpi.finalizados },
      { Metrica: "Con error", Valor: kpi.conError },
      { Metrica: "Monto total", Valor: formatARS(kpi.montoTotal) },
      { Metrica: "Monto cobrado", Valor: formatARS(kpi.montoCobrado) },
      { Metrica: "Monto pendiente", Valor: formatARS(kpi.montoPendiente) },
      ...porMedio.map((m) => ({
        Metrica: `Monto ${medioPagoLabels[m.medio as keyof typeof medioPagoLabels] || m.medio}`,
        Valor: formatARS(m.monto),
      })),
      ...porVencimiento.map((v) => ({
        Metrica: v.label,
        Valor: `${v.cantidad} ops - ${formatARS(v.monto)}`,
      })),
      {
        Metrica: "Operaciones no cobradas",
        Valor: `${noCobradas.porcentajeNoCobrado}% - ${formatARS(noCobradas.montoNoCobrado)}`,
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard");
    XLSX.writeFile(wb, `cobros-masivos-dashboard-${filter.label}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dashboard - Cobros Masivos", 14, 20);
    doc.text(`Periodo: ${filter.label}`, 14, 30);
    const body = [
      ["Total de lotes", String(kpi.totalLotes)],
      ["En proceso", String(kpi.enProceso)],
      ["Finalizados", String(kpi.finalizados)],
      ["Con error", String(kpi.conError)],
      ["Monto total", formatARS(kpi.montoTotal)],
      ["Monto cobrado", formatARS(kpi.montoCobrado)],
      ["Monto pendiente", formatARS(kpi.montoPendiente)],
      [
        "Tasa de cobranza",
        kpi.montoTotal > 0 ? `${Math.round((kpi.montoCobrado / kpi.montoTotal) * 100)}%` : "0%",
      ],
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({ startY: 38, head: [["Metrica", "Valor"]], body });
    doc.save(`cobros-masivos-dashboard-${filter.label}.pdf`);
  };

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {presets.map((p) => (
          <button
            key={p.days}
            onClick={() => setFilter(periodFilter(p.label, p.days))}
            className={
              "px-4 py-2 rounded-lg text-xs font-semibold border transition " +
              (filter.label === p.label
                ? "bg-navy-50 text-navy-600 border-transparent"
                : "bg-card hover:bg-muted")
            }
          >
            {p.label}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5">
            <Label>Desde</Label>
            <Input
              type="date"
              value={customDesde}
              onChange={(e) => {
                setCustomDesde(e.target.value);
                if (e.target.value && customHasta) {
                  setFilter(periodFilter("Personalizado", undefined, new Date(e.target.value), new Date(customHasta)));
                }
              }}
              className="h-9 w-36 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Label>Hasta</Label>
            <Input
              type="date"
              value={customHasta}
              onChange={(e) => {
                setCustomHasta(e.target.value);
                if (customDesde && e.target.value) {
                  setFilter(periodFilter("Personalizado", undefined, new Date(customDesde), new Date(e.target.value)));
                }
              }}
              className="h-9 w-36 text-xs"
            />
          </div>
        </div>
        <BtnOutline className="h-9 px-3 text-xs" onClick={exportExcel}>
          <FileSpreadsheet size={14} /> Excel
        </BtnOutline>
        <BtnOutline className="h-9 px-3 text-xs" onClick={exportPDF}>
          <Download size={14} /> PDF
        </BtnOutline>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Total de lotes
          </div>
          <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5">{kpi.totalLotes}</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            En proceso
          </div>
          <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5 text-amber-600">
            {kpi.enProceso}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Finalizados
          </div>
          <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5 text-emerald-600">
            {kpi.finalizados}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Con error
          </div>
          <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5 text-red-600">
            {kpi.conError}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Monto total
          </div>
          <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5">
            {formatARS(kpi.montoTotal)}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cobrado</div>
          <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5 text-emerald-600">
            {formatARS(kpi.montoCobrado)}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Pendiente
          </div>
          <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5 text-amber-600">
            {formatARS(kpi.montoPendiente)}
          </div>
        </div>
      </div>

      {/* Graficos */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {/* Cobros por medio de pago */}
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Cobros por medio de pago
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={porMedio}
                dataKey="monto"
                nameKey="medio"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ medio, porcentaje }: { medio: string; porcentaje: number }) =>
                  `${medioPagoLabels[medio as keyof typeof medioPagoLabels] || medio} ${porcentaje}%`
                }
              >
                {porMedio.map((e) => (
                  <Cell key={e.medio} fill={MEDIO_COLORS[e.medio] || "#666"} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatARS(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Cobros por vencimiento */}
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Cobros por vencimiento
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={porVencimiento}
                dataKey="cantidad"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ label, cantidad }: { label: string; cantidad: number }) =>
                  `${label}: ${cantidad}`
                }
              >
                {porVencimiento.map((_, i) => (
                  <Cell key={i} fill={VENC_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Operaciones no cobradas */}
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Operaciones no cobradas
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">No cobrado</span>
              <span className="text-lg font-bold text-red-600">
                {noCobradas.porcentajeNoCobrado}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500"
                style={{ width: `${noCobradas.porcentajeNoCobrado}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pt-2">
              <div>
                <div className="font-display tabular-nums text-lg font-semibold">{noCobradas.totalOperaciones}</div>
                <div className="text-[10px] text-muted-foreground">Total ops</div>
              </div>
              <div>
                <div className="font-display tabular-nums text-lg font-semibold text-red-600">{noCobradas.vencidas}</div>
                <div className="text-[10px] text-muted-foreground">Vencidas</div>
              </div>
              <div>
                <div className="font-display tabular-nums text-lg font-semibold text-amber-600">{noCobradas.vigentes}</div>
                <div className="text-[10px] text-muted-foreground">Vigentes</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center pt-1">
              Monto no cobrado: {formatARS(noCobradas.montoNoCobrado)}
            </div>
          </div>
        </Card>
      </div>

      {/* Evolucion de pagos */}
      <Card className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Evolucion de pagos
        </h4>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={evolucion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: number) => formatARS(v)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="monto"
              stroke="#D3001F"
              strokeWidth={2}
              name="Monto"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Tabla de lotes recientes */}
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <div className="font-semibold">Lotes recientes</div>
            <div className="text-xs text-muted-foreground">
              {lotesRecientes.length} lotes en el periodo seleccionado
            </div>
          </div>
          <BtnOutline
            className="h-9 px-3 text-xs"
            onClick={() => navigate({ to: "/app/cobros/gestion" })}
          >
            Ver todos
          </BtnOutline>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Nombre / Monto
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Progreso
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Monto total
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Cobrado
                </th>
                <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Pendiente
                </th>
                <th className="text-center px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Accion
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {lotesRecientes.slice(0, 10).map((l) => (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold">{l.nombre}</div>
                    <div className="text-xs text-muted-foreground">
                      {l.cantidadPagos + l.cantidadParciales + l.cantidadPendientes} registros
                    </div>
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
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-[100px]">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${l.progreso}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold min-w-[3rem]">{l.progreso}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right font-semibold">{formatARS(l.montoTotal)}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right text-emerald-600 font-semibold">
                    {formatARS(l.montoCobrado)}
                  </td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right text-amber-600 font-semibold">
                    {formatARS(l.montoTotal - l.montoCobrado)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() =>
                        navigate({ to: "/app/cobros/gestion/$id", params: { id: l.id } })
                      }
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition"
                      title="Ver detalle"
                    >
                      <Eye size={15} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
              {lotesRecientes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No hay lotes en el periodo seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
