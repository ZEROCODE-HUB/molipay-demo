import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
} from "recharts";
import { Download, FileSpreadsheet } from "lucide-react";
import { Card, BtnOutline } from "@/components/portal-shell";
import {
  periodFilter,
  computeMetrics,
  byMethod,
  byStatus,
  formatARS,
  type PeriodFilter,
} from "@/data/links-pago";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const Route = createFileRoute("/app/link-pago/")({ component: Dashboard });

const presets = [
  { label: "Hoy", days: 0 },
  { label: "15 dias", days: 15 },
  { label: "30 dias", days: 30 },
  { label: "60 dias", days: 60 },
  { label: "90 dias", days: 90 },
];

const COLORS: Record<string, string> = {
  Aprobado: "#22c55e",
  Pendiente: "#f59e0b",
  Rechazado: "#ef4444",
  Reembolsado: "#a855f7",
};
const METHOD_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#d97706",
  "#0891b2",
  "#4f46e5",
  "#9333ea",
  "#16a34a",
  "#ca8a04",
];

function Dashboard() {
  const [filter, setFilter] = useState<PeriodFilter>(periodFilter("30 dias", 30));
  const metrics = computeMetrics(filter);
  const statusData = Object.entries(byStatus(filter)).map(([name, value]) => ({ name, value }));
  const methodData = Object.entries(byMethod(filter)).map(([name, { amount }]) => ({
    name,
    amount,
  }));
  const volData = methodData.map((d) => ({ ...d, vol: +(d.amount / 1_000_000).toFixed(1) }));

  const kpis = [
    { label: "Total aprobado", value: formatARS(metrics.totalApproved) },
    { label: "Transacciones totales", value: metrics.totalTx.toString() },
    { label: "Pendientes", value: metrics.pending.toString() },
    { label: "Rechazadas", value: metrics.rejected.toString() },
    { label: "Reembolsos", value: metrics.refunds.toString() },
    { label: "Tasa de conversion", value: metrics.conversionRate + "%" },
    { label: "Ticket promedio", value: formatARS(metrics.avgTicket) },
  ];

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metrica: "Total aprobado", Valor: formatARS(metrics.totalApproved) },
      { Metrica: "Transacciones totales", Valor: metrics.totalTx },
      { Metrica: "Pendientes", Valor: metrics.pending },
      { Metrica: "Rechazadas", Valor: metrics.rejected },
      { Metrica: "Reembolsos", Valor: metrics.refunds },
      { Metrica: "Tasa de conversion", Valor: metrics.conversionRate + "%" },
      { Metrica: "Ticket promedio", Valor: formatARS(metrics.avgTicket) },
      ...methodData.map((d) => ({ Metrica: "Monto " + d.name, Valor: formatARS(d.amount) })),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard");
    XLSX.writeFile(wb, "links-pago-dashboard-" + filter.label + ".xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dashboard - Links de Pago", 14, 20);
    doc.text("Periodo: " + filter.label, 14, 30);
    const body = kpis.map((k) => [k.label, k.value]);
    (doc as any).autoTable({ startY: 38, head: [["Metrica", "Valor"]], body });
    doc.save("links-pago-dashboard-" + filter.label + ".pdf");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {presets.map((p) => (
          <button
            key={p.days}
            onClick={() => setFilter(periodFilter(p.label, p.days))}
            className={
              "px-4 py-2 rounded-lg text-xs font-semibold border transition " +
              (filter.label === p.label
                ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border-transparent"
                : "bg-card hover:bg-muted")
            }
          >
            {p.label}
          </button>
        ))}
        <div className="flex-1" />
        <BtnOutline className="h-9 px-3 text-xs" onClick={exportExcel}>
          <FileSpreadsheet size={14} /> Excel
        </BtnOutline>
        <BtnOutline className="h-9 px-3 text-xs" onClick={exportPDF}>
          <Download size={14} /> PDF
        </BtnOutline>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-card border rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {k.label}
            </div>
            <div className="font-display tabular-nums text-sm md:text-base font-semibold mt-0.5">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Estado de transacciones
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }: any) => name + " " + value}
              >
                {statusData.map((e) => (
                  <Cell key={e.name} fill={COLORS[e.name] || "#666"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Montos por metodo de pago
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={methodData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }: any) => name}
              >
                {methodData.map((_, i) => (
                  <Cell key={i} fill={METHOD_COLORS[i % METHOD_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatARS(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Volumen por metodo (millones ARS)
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => v + "M"} />
              <Bar dataKey="vol" radius={[4, 4, 0, 0]}>
                {volData.map((_, i) => (
                  <Cell key={i} fill={METHOD_COLORS[i % METHOD_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
