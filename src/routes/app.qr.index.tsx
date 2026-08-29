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
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Download, FileSpreadsheet, TrendingUp, QrCode, DollarSign, Activity, Store } from "lucide-react";
import { Card, BtnOutline } from "@/components/portal-shell";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const Route = createFileRoute("/app/qr/")({ component: Dashboard });

const presets = [
  { label: "Hoy", days: 0 },
  { label: "7 dias", days: 7 },
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

const STATUS_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#a855f7"];
const EVOLUTION_COLORS = ["#2563eb", "#7c3aed"];

/* ---------- mock data ---------- */

const mockEvolucion = [
  { mes: "Ene", cobros: 142, monto: 12.4 },
  { mes: "Feb", cobros: 168, monto: 14.8 },
  { mes: "Mar", cobros: 195, monto: 18.2 },
  { mes: "Abr", cobros: 221, monto: 21.5 },
  { mes: "May", cobros: 247, monto: 24.1 },
  { mes: "Jun", cobros: 283, monto: 28.9 },
];

const mockStatus = { Aprobado: 924, Pendiente: 48, Rechazado: 23, Reembolsado: 5 };
const mockMontosPorPdv = [
  { name: "Caja principal", amount: 9480000 },
  { name: "Caja secundaria", amount: 5120000 },
  { name: "Sucursal Norte", amount: 3740000 },
  { name: "Evento Mayo", amount: 2860000 },
  { name: "Kiosco Demo", amount: 1920000 },
];

const formatter = (n: number) =>
  "$ " +
  n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
  " ARS";

function Dashboard() {
  const [presetLabel, setPresetLabel] = useState(presets[2].label);

  const statusData = Object.entries(mockStatus).map(([name, value]) => ({ name, value }));
  const volData = mockMontosPorPdv.map((d) => ({ ...d, vol: +(d.amount / 1_000_000).toFixed(1) }));

  const kpis = [
    { icon: QrCode, label: "Total cobros QR", value: "1.283" },
    { icon: DollarSign, label: "Monto total recaudado", value: formatter(23120000) },
    { icon: Activity, label: "Transacciones", value: "1.005" },
    { icon: TrendingUp, label: "Ticket promedio", value: formatter(18020) },
    { icon: Store, label: "PDV activos", value: "5" },
    { icon: TrendingUp, label: "Tasa de exito", value: "92,4%" },
  ];

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      ...kpis.map((k) => ({ Metrica: k.label, Valor: k.value })),
      ...mockMontosPorPdv.map((d) => ({ Metrica: "Monto " + d.name, Valor: formatter(d.amount) })),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard QR");
    XLSX.writeFile(wb, "qr-dashboard-" + presetLabel + ".xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dashboard - Cobros con QR", 14, 20);
    doc.text("Periodo: " + presetLabel, 14, 30);
    const body = kpis.map((k) => [k.label, k.value]);
    (doc as any).autoTable({ startY: 38, head: [["Metrica", "Valor"]], body });
    doc.save("qr-dashboard-" + presetLabel + ".pdf");
  };

  return (
    <div>
      {/* Period filter + export */}
      <div className="flex flex-wrap gap-2 mb-6">
        {presets.map((p) => (
          <button
            key={p.days}
            onClick={() => setPresetLabel(p.label)}
            className={
              "px-4 py-2 rounded-lg text-xs font-semibold border transition " +
              (presetLabel === p.label
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-card border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <k.icon size={14} className="text-muted-foreground" />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
            </div>
            <div className="font-display tabular-nums text-sm md:text-base font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <Card>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Estado de cobros
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
            Monto por punto de venta
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={mockMontosPorPdv}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }: any) => name}
              >
                {mockMontosPorPdv.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatter(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Volumen por PDV (millones ARS)
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => v + "M"} />
              <Bar dataKey="vol" radius={[4, 4, 0, 0]}>
                {volData.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Evolution chart */}
      <Card>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Evolucion de cobros
        </h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={mockEvolucion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cobros"
              stroke={EVOLUTION_COLORS[0]}
              strokeWidth={2}
              name="Cobros"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="monto"
              stroke={EVOLUTION_COLORS[1]}
              strokeWidth={2}
              name="Monto (millones ARS)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
