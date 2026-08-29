import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Users, Link2, QrCode,
  Smartphone, TrendingUp, Clock, Download, FileSpreadsheet, FileText,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { PageHeader, Card, BtnOutline } from "@/components/portal-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const formatARS = (n: number) =>
  `$ ${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type PeriodKey = "today" | "15d" | "30d" | "60d" | "90d" | "day" | "range";

const QUICK: Array<{ k: PeriodKey; l: string; days: number }> = [
  { k: "today", l: "Hoy", days: 1 },
  { k: "15d", l: "15 días", days: 15 },
  { k: "30d", l: "30 días", days: 30 },
  { k: "60d", l: "60 días", days: 60 },
  { k: "90d", l: "90 días", days: 90 },
];

function seriesFor(days: number): Array<{
  date: string; depositos: number; cobrosQR: number; linkPago: number; total: number;
}> {
  const out: Array<any> = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const seed = d.getDate() + d.getMonth() * 31;
    const isZero = seed % 11 === 0;
    const dep = isZero ? 0 : (((seed * 37) % 90) + 10) * 100_000;
    const qr = isZero ? 0 : (((seed * 17) % 60) + 5) * 100_000;
    const link = isZero ? 0 : ((seed * 23) % 40) * 100_000;
    out.push({
      date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      depositos: dep,
      cobrosQR: qr,
      linkPago: link,
      total: dep + qr + link,
    });
  }
  return out;
}

function Dashboard() {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const data = useMemo(() => {
    if (period === "day") return seriesFor(1);
    if (period === "range" && desde && hasta) {
      const diff = Math.ceil(
        (new Date(hasta + "T23:59:59").getTime() - new Date(desde + "T00:00:00").getTime())
          / (1000 * 60 * 60 * 24)
      );
      return seriesFor(Math.max(1, diff));
    }
    const days = QUICK.find((p) => p.k === period)?.days ?? 30;
    return seriesFor(days);
  }, [period, day, desde, hasta]);

  const periodLabel = useMemo(() => {
    if (period === "day") return day;
    if (period === "range") return `${desde || "?"} – ${hasta || "?"}`;
    return QUICK.find((p) => p.k === period)?.l ?? "30 días";
  }, [period, day, desde, hasta]);

  const kpis = useMemo(() => {
    const totalDep = data.reduce((s, d) => s + d.depositos, 0);
    const totalQR = data.reduce((s, d) => s + d.cobrosQR, 0);
    const totalLink = data.reduce((s, d) => s + d.linkPago, 0);
    return {
      saldo: 12_480_330.42,
      depositos: totalDep,
      retiros: totalDep * 0.52,
      cuentas: 4,
      cobrosLink: totalLink,
      cobrosQR: totalQR,
      pagosQR: totalQR * 0.35,
    };
  }, [data]);

  const doExport = (fmt: "xlsx" | "pdf") =>
    toast.success(`Reporte ${periodLabel} exportado (${fmt.toUpperCase()})`);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Panel ejecutivo — estado de tu operación financiera."
        action={
          <div className="hidden md:flex items-center gap-2 text-xs text-black-400">
            <Clock size={14} /> Actualizado hace 2 min
          </div>
        }
      />

      <Card className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-black-400 uppercase tracking-wide shrink-0">
            Período
          </span>
          {QUICK.map((p) => (
            <button
              key={p.k}
              onClick={() => setPeriod(p.k)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                period === p.k
                  ? "bg-navy-50 text-navy-600 border-transparent"
                  : "bg-white hover:bg-black-50 border-black-100 text-black-500"
              }`}
            >
              {p.l}
            </button>
          ))}
          <button
            onClick={() => setPeriod("day")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              period === "day"
                ? "bg-navy-50 text-navy-600 border-transparent"
                : "bg-white hover:bg-black-50 border-black-100 text-black-500"
            }`}
          >
            Día específico
          </button>
          <button
            onClick={() => setPeriod("range")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              period === "range"
                ? "bg-navy-50 text-navy-600 border-transparent"
                : "bg-white hover:bg-black-50 border-black-100 text-black-500"
            }`}
          >
            Rango
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-black-400">Día</span>
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="h-9 px-3 rounded-sm border border-black-100 bg-white text-sm text-black-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-black-400">Desde</span>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="h-9 px-3 rounded-sm border border-black-100 bg-white text-sm text-black-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-black-400">Hasta</span>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              min={desde || undefined}
              className="h-9 px-3 rounded-sm border border-black-100 bg-white text-sm text-black-700"
            />
          </div>
          <div className="ml-auto flex gap-2">
            <BtnOutline onClick={() => doExport("xlsx")}>
              <FileSpreadsheet size={14} /> Excel
            </BtnOutline>
            <BtnOutline onClick={() => doExport("pdf")}>
              <FileText size={14} /> PDF
            </BtnOutline>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-black-400 mb-1">Saldo total de la cuenta</div>
              <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-black-800">{formatARS(kpis.saldo)}</div>
              <div className="text-xs text-black-400 mt-0.5">CBU ···· 67890</div>
            </div>
            <div className="w-9 h-9 rounded-sm bg-navy-50 flex items-center justify-center text-navy-500 shrink-0">
              <Wallet size={18} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-black-400 mb-1">Depósitos del período</div>
              <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-black-800">{formatARS(kpis.depositos)}</div>
              <div className="text-xs text-black-400 mt-0.5">{data.length} días</div>
            </div>
            <div className="w-9 h-9 rounded-sm bg-success-bg flex items-center justify-center text-success shrink-0">
              <ArrowDownLeft size={18} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-black-400 mb-1">Retiros del período</div>
              <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-black-800">{formatARS(kpis.retiros)}</div>
              <div className="text-xs text-black-400 mt-0.5">48 operaciones</div>
            </div>
            <div className="w-9 h-9 rounded-sm bg-error-bg flex items-center justify-center text-error shrink-0">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-black-400 mb-1">Total de cuentas</div>
              <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-black-800">{kpis.cuentas}</div>
              <div className="text-xs text-black-400 mt-0.5">1 principal + 3 subcuentas</div>
            </div>
            <div className="w-9 h-9 rounded-sm bg-info-bg flex items-center justify-center text-info shrink-0">
              <Users size={18} />
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-black-400 mb-1">Cobros mediante Link de Pago</div>
              <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-black-800">{formatARS(kpis.cobrosLink)}</div>
              <div className="text-xs text-black-400 mt-0.5">{Math.round(kpis.cobrosLink / 85000)} transacciones</div>
            </div>
            <div className="w-9 h-9 rounded-sm bg-navy-50 flex items-center justify-center text-navy-500 shrink-0">
              <Link2 size={18} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-black-400 mb-1">Cobros mediante Código QR</div>
              <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-black-800">{formatARS(kpis.cobrosQR)}</div>
              <div className="text-xs text-black-400 mt-0.5">{Math.round(kpis.cobrosQR / 32000)} transacciones</div>
            </div>
            <div className="w-9 h-9 rounded-sm bg-warning-bg flex items-center justify-center text-warning shrink-0">
              <QrCode size={18} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-black-400 mb-1">Pagos realizados mediante QR</div>
              <div className="font-display tabular-nums text-xl md:text-2xl font-bold text-black-800">{formatARS(kpis.pagosQR)}</div>
              <div className="text-xs text-black-400 mt-0.5">{Math.round(kpis.pagosQR / 18000)} transacciones</div>
            </div>
            <div className="w-9 h-9 rounded-sm bg-plata-200 flex items-center justify-center text-black-600 shrink-0">
              <Smartphone size={18} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-black-800 truncate">Movimientos diarios</h3>
            <p className="text-xs text-black-400 truncate">{periodLabel}</p>
          </div>
          <span className="text-success font-semibold inline-flex items-center gap-1 text-xs shrink-0">
            <TrendingUp size={14} /> +18,4%
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Depósitos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-black" /> Cobros QR
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-navy-500" /> Link de Pago
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-warning" /> Total del día
          </span>
        </div>
        <div className="w-full" style={{ height: Math.max(200, Math.min(360, 40 * data.length)) }}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barGap={2} barCategoryGap={data.length > 30 ? 4 : 8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4D4D4" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#909090" }}
                  tickLine={false}
                  axisLine={{ stroke: "#D4D4D4" }}
                  interval={data.length > 30 ? Math.floor(data.length / 10) : 0}
                />
                <YAxis
                  tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}M`}
                  tick={{ fontSize: 10, fill: "#909090" }}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      depositos: "Depósitos",
                      cobrosQR: "Cobros QR",
                      linkPago: "Link de Pago",
                      total: "Total del día",
                    };
                    return [formatARS(value), labels[name] || name];
                  }}
                  labelFormatter={(label: string) => `Fecha: ${label}`}
                  contentStyle={{
                    borderRadius: 4,
                    border: "1px solid #D4D4D4",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="depositos" fill="#D3001F" radius={[2, 2, 0, 0]} maxBarSize={32} />
                <Bar dataKey="cobrosQR" fill="#000000" radius={[2, 2, 0, 0]} maxBarSize={32} />
                <Bar dataKey="linkPago" fill="#324595" radius={[2, 2, 0, 0]} maxBarSize={32} />
                <Bar dataKey="total" fill="#E37B1A" radius={[2, 2, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-black-400">
              No hay datos para el período seleccionado.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
