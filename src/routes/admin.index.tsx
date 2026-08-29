import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  ShieldAlert,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader, Card, Stat, Badge } from "@/components/portal-shell";

export const Route = createFileRoute("/admin/")({ component: Page });

const volumeData = [
  82, 95, 78, 110, 124, 132, 118, 145, 138, 162, 158, 184, 172, 195,
];

function Page() {
  const max = Math.max(...volumeData);
  return (
    <>
      <PageHeader
        title="Dashboard administrativo"
        description="Estado global de la plataforma Molly Money Life."
        action={
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Activity size={14} className="text-[color:var(--brand-red)]" /> Sistema operativo · 99,98%
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Clientes activos" value="312" sub="+8 esta semana" />
        <Stat label="Volumen del dia" value="$ 184,2M" sub="ARS · 12.480 ops" />
        <Stat label="Alertas pendientes" value="7" sub="3 criticas" />
        <Stat label="Altas en revision" value="12" sub="Validacion de legajo" />
      </div>

      {/* Volume chart + system health */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="font-semibold">Volumen transaccional</h3>
              <p className="text-xs text-muted-foreground">ultimos 14 dias — ARS</p>
            </div>
            <div className="text-xs text-primary font-semibold inline-flex items-center gap-1">
              <TrendingUp size={14} /> +24,6%
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-44">
            {volumeData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[color:var(--brand-blue)] to-[color:var(--brand-red)]"
                  style={{ height: `${(v / max) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Estado del sistema</h3>
          <ul className="space-y-3 text-sm">
            {[
              ["API publica", "operativo", "120 ms"],
              ["Procesador CVU", "operativo", "210 ms"],
              ["QR realtime", "operativo", "85 ms"],
              ["Webhooks", "degradado", "640 ms"],
              ["Conciliacion batch", "operativo", "—"],
            ].map(([n, e, l]) => (
              <li key={n} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {e === "operativo" ? (
                    <CheckCircle2 size={16} className="text-primary" />
                  ) : (
                    <XCircle size={16} className="text-amber-600" />
                  )}
                  {n}
                </span>
                <span className="text-xs text-muted-foreground">{l}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Lower row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Building2 size={16} className="text-[color:var(--brand-blue)]" /> ultimos registros
            </h3>
            <Link to="/admin/clientes" className="text-xs text-primary font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b">
                  <th className="text-left font-semibold py-2 px-5">Razon social</th>
                  <th className="text-left font-semibold py-2">CUIT</th>
                  <th className="text-left font-semibold py-2">Segmento</th>
                  <th className="text-left font-semibold py-2">Estado</th>
                  <th className="text-right font-semibold py-2 px-5">Volumen</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["Consorcio Larrea 1200", "30-71235678-2", "Consorcio", "warn", "Pendiente validacion", "—"],
                  ["Microcreditos del Sur", "30-71239988-0", "Microcredito", "success", "Activo", "$ 8,4M"],
                  ["Administradora Plaza", "30-71244455-1", "Alquileres", "warn", "Documentacion", "—"],
                  ["Municipalidad de Chivilcoy", "30-99876543-2", "Municipio", "success", "Activo", "$ 21,2M"],
                  ["Pagos Express SRL", "30-71300011-4", "Empresa", "danger", "Bloqueado", "—"],
                ].map(([n, c, seg, tone, e, v]) => (
                  <tr key={n}>
                    <td className="py-2.5 px-5 font-semibold">{n}</td>
                    <td className="text-xs text-muted-foreground">{c}</td>
                    <td className="text-xs">{seg}</td>
                    <td>
                      <Badge tone={tone as "success" | "warn" | "danger"}>{e}</Badge>
                    </td>
                    <td className="font-mono tabular-nums text-right px-5 font-semibold">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <ShieldAlert size={16} className="text-[color:var(--brand-red)]" /> Alertas recientes
            </h3>
            <Link to="/admin/compliance" className="text-xs text-primary font-semibold">
              Compliance →
            </Link>
          </div>
          <div className="divide-y">
            {[
              ["Movimiento superior a $5M", "Microcreditos del Sur", "danger", "Hace 12 min"],
              ["Frecuencia anomala – 48 ops/h", "Pagos Express SRL", "warn", "Hace 1 h"],
              ["CUIT en lista de control", "Comercializadora ABC", "danger", "Hace 3 h"],
              ["KYC vencido", "Consorcio Belgrano", "warn", "Hoy 09:00"],
            ].map(([a, c, tone, t]) => (
              <div key={a} className="py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{a}</div>
                  <Badge tone={tone as "warn" | "danger"}>!</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{c}</div>
                <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-1">
                  <Clock size={11} /> {t}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/admin/movimientos"
            className="mt-4 inline-flex items-center gap-1 text-xs text-primary font-semibold"
          >
            Ver movimientos en tiempo real <ArrowUpRight size={12} />
          </Link>
        </Card>
      </div>
    </>
  );
}
