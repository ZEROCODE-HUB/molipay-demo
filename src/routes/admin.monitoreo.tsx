import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radar, Activity, ShieldAlert, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import {
  PageHeader, Card, BtnOutline, Badge, Stat,
} from "@/components/portal-shell";

export const Route = createFileRoute("/admin/monitoreo")({ component: Page });

const txs = [
  { f: "10:42:18", cli: "Pagos Express SRL", op: "Transferencia", m: "$ 6.200.000", e: "Alertada" },
  { f: "10:41:55", cli: "Microcreditos del Sur", op: "Cobro QR", m: "$ 18.400", e: "OK" },
  { f: "10:41:32", cli: "Consorcio Larrea 1200", op: "Lote expensas", m: "$ 5.840.200", e: "OK" },
  { f: "10:40:11", cli: "Administradora Plaza", op: "Pago servicio", m: "$ 64.320", e: "OK" },
  { f: "10:39:48", cli: "Pagos Express SRL", op: "Transferencia", m: "$ 1.200.000", e: "Demorada" },
  { f: "10:38:22", cli: "Cooperativa Norte", op: "Link de pago", m: "$ 92.800", e: "OK" },
  { f: "10:37:09", cli: "Municipalidad Chivilcoy", op: "Transferencia", m: "$ 2.480.000", e: "OK" },
  { f: "10:36:51", cli: "Pagos Express SRL", op: "Cobro QR", m: "$ 8.200", e: "OK" },
];

const alertas = [
  { cli: "Pagos Express SRL", d: "Operacion > umbral · $ 6.200.000", t: "Hace 2 min" },
  { cli: "Microcreditos del Sur", d: "Frecuencia inusual · 48 ops/h", t: "Hace 11 min" },
  { cli: "Comercializadora ABC", d: "CUIT en lista de control", t: "Hace 28 min" },
];

function Page() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(id);
  }, []);
  const estadoGral = "alert" as "ok" | "alert" | "incident";
  const tonoGral: "success" | "warn" | "danger" =
    estadoGral === "ok" ? "success" : estadoGral === "alert" ? "warn" : "danger";
  const txtGral =
    estadoGral === "ok" ? "Operando con normalidad" :
    estadoGral === "alert" ? "Operando con alertas" : "Con incidencias";

  return (
    <>
      <PageHeader
        title="Monitoreo en tiempo real"
        description="Metricas operativas y alertas con actualizacion automatica."
        action={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> En vivo · refresh 60s
            </span>
            <Badge tone={tonoGral}>{txtGral}</Badge>
          </div>
        }
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Volumen ultimas 24h" value="$ 184,2M" sub="+12% vs ayer" />
        <Stat label="Transacciones activas" value="1.482" sub="324 en curso" />
        <Stat label="Alertas pendientes" value="3" sub="2 criticas" />
        <Stat label="Clientes con actividad inusual" value="2" sub="Pagos Express, Microcreditos" />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2"><Activity size={16} /> Transacciones · ultimos 30 min</h3>
            <span className="text-xs text-muted-foreground">Actualizado hace {tick === 0 ? "0" : tick * 60} s</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                <th className="text-left px-5 py-2.5">Hora</th>
                <th className="text-left px-5 py-2.5">Cliente</th>
                <th className="text-left px-5 py-2.5">Operacion</th>
                <th className="text-right px-5 py-2.5">Monto</th>
                <th className="text-right px-5 py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-2.5 text-xs text-muted-foreground font-mono">{t.f}</td>
                  <td className="px-5 py-2.5 font-semibold text-sm">{t.cli}</td>
                  <td className="px-5 py-2.5 text-xs">{t.op}</td>
                  <td className="px-5 py-2.5 font-mono tabular-nums text-right font-semibold">{t.m}</td>
                  <td className="px-5 py-2.5 text-right">
                    <Badge tone={t.e === "OK" ? "success" : t.e === "Alertada" ? "danger" : "warn"}>{t.e}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><ShieldAlert size={16} className="text-amber-600" /> Alertas pendientes</h3>
            <div className="divide-y">
              {alertas.map((a, i) => (
                <div key={i} className="py-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{a.cli}</div>
                      <div className="text-xs text-muted-foreground">{a.d}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{a.t}</div>
                    </div>
                    <BtnOutline className="h-8 px-2 text-xs shrink-0">
                      Ver cliente <ChevronRight size={12} />
                    </BtnOutline>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Radar size={14} /> Estado del sistema</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Core bancario</span><Badge tone="success"><CheckCircle2 size={10} className="mr-1" /> OK</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pasarela QR/Link</span><Badge tone="success">OK</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Procesamiento de lotes</span><Badge tone="warn"><AlertCircle size={10} className="mr-1" /> Lento</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Compliance engine</span><Badge tone="success">OK</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Conexion COELSA</span><Badge tone="success">OK</Badge></div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}