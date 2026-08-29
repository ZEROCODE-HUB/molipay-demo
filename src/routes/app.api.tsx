import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Copy, Plus, Webhook, BookOpen, CheckCircle2, Circle, Activity, Code2 } from "lucide-react";
import { PageHeader, Card, BtnPrimary, BtnOutline, Badge, Stat, Input, Label } from "@/components/portal-shell";

export const Route = createFileRoute("/app/api")({ component: Page });

const endpoints: [string, string, string][] = [
  ["POST", "/v1/transfers", "Crear una transferencia"],
  ["GET", "/v1/transfers/:id", "Consultar estado"],
  ["GET", "/v1/balances", "Saldo por subcuenta"],
  ["POST", "/v1/payment-links", "Generar link de pago"],
  ["POST", "/v1/qr/dynamic", "Generar QR dinamico"],
  ["POST", "/v1/batch-collections", "Lote de cobros"],
  ["GET", "/v1/movements", "Listar movimientos"],
  ["POST", "/v1/webhooks", "Registrar webhook"],
];

const webhooks = [
  { url: "https://api.empresademo.com/webhooks/molly", e: "payment.completed", s: "OK", last: "Hoy 10:42" },
  { url: "https://api.empresademo.com/webhooks/molly", e: "transfer.failed", s: "OK", last: "Ayer" },
  { url: "https://staging.empresademo.com/hooks", e: "batch.completed", s: "Reintentando", last: "30/05" },
];

const requests = [
  { m: "POST", p: "/v1/transfers", c: "200", t: "248 ms", f: "10:42" },
  { m: "GET", p: "/v1/balances", c: "200", t: "82 ms", f: "10:38" },
  { m: "POST", p: "/v1/payment-links", c: "201", t: "320 ms", f: "10:21" },
  { m: "GET", p: "/v1/movements", c: "200", t: "110 ms", f: "09:55" },
  { m: "POST", p: "/v1/transfers", c: "422", t: "92 ms", f: "09:14" },
];

function Page() {
  return (
    <>
      <PageHeader
        title="API e integraciones"
        description="Credenciales, webhooks, sandbox y documentacion tecnica."
        action={<BtnPrimary><BookOpen size={14} /> Ver documentacion</BtnPrimary>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Requests ultimo mes" value="48.220" sub="↑ 12% vs anterior" />
        <Stat label="Tasa de exito" value="99,4%" sub="ultimas 24h" />
        <Stat label="Latencia media" value="184 ms" sub="P95: 420 ms" />
        <Stat label="Webhooks activos" value="3" sub="2 OK · 1 reintentando" />
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Code2 size={16} /> Credenciales</h3>
            <Badge tone="success">Produccion</Badge>
          </div>
          <div className="space-y-3">
            <Cred label="API Key" value="••••••••••••••••••••••" />
            <Cred label="Token de acceso" value="••••••••••••••••••••••••" />
            <Cred label="Webhook secret" value="••••••••••••••••••••••••" />
          </div>
          <div className="flex gap-2 mt-5">
            <BtnOutline><RefreshCw size={14} /> Rotar claves</BtnOutline>
            <BtnOutline>Modo sandbox</BtnOutline>
          </div>
          <div className="mt-4 p-3 bg-muted rounded text-xs text-muted-foreground">
            <CheckCircle2 size={12} className="inline mr-1 text-emerald-600" />
            ultima rotacion: hace 28 dias. Recomendamos rotar cada 90 dias.
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity size={16} /> Estado de servicios</h3>
          <div className="space-y-2.5">
            {[
              ["API REST", "Operativo", "100%"],
              ["Webhooks", "Operativo", "99,8%"],
              ["Procesamiento de cobros", "Operativo", "99,9%"],
              ["Sandbox", "Operativo", "100%"],
            ].map(([s, e, u]) => (
              <div key={s} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <Circle size={8} className="fill-emerald-500 text-emerald-500" />
                  <span>{s}</span>
                </div>
                <div className="text-xs text-muted-foreground">{e} · {u}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Endpoints disponibles</h3>
            <button className="text-xs text-primary font-semibold">Ver todos</button>
          </div>
          <div className="divide-y">
            {endpoints.map(([m, p, d]) => (
              <div key={p} className="flex items-center gap-3 py-2.5">
                <span className={`inline-flex w-14 justify-center px-2 py-0.5 rounded text-[10px] font-bold ${
                  m === "GET" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                }`}>{m}</span>
                <span className="font-mono text-xs flex-1">{p}</span>
                <span className="text-xs text-muted-foreground hidden md:block">{d}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Webhook size={16} /> Webhooks</h3>
              <BtnOutline className="h-9 px-3 text-xs"><Plus size={12} /> Agregar</BtnOutline>
            </div>
            <div className="divide-y">
              {webhooks.map((w, i) => (
                <div key={i} className="py-2.5">
                  <div className="flex justify-between items-center">
                    <code className="text-xs truncate flex-1 pr-2">{w.url}</code>
                    <Badge tone={w.s === "OK" ? "success" : "warn"}>{w.s}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                    <span>{w.e}</span>
                    <span>{w.last}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">ultimas requests</h3>
            <div className="divide-y text-xs">
              {requests.map((r, i) => (
                <div key={i} className="flex items-center gap-2 py-2">
                  <span className={`w-12 text-center font-bold ${
                    r.m === "GET" ? "text-blue-700" : "text-emerald-700"
                  }`}>{r.m}</span>
                  <span className="font-mono flex-1 truncate">{r.p}</span>
                  <span className={`font-mono font-semibold ${r.c.startsWith("2") ? "text-emerald-700" : "text-red-700"}`}>{r.c}</span>
                  <span className="font-mono text-muted-foreground w-16 text-right">{r.t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Cred({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 border rounded-md bg-muted p-2">
        <code className="text-xs flex-1 truncate">{value}</code>
        <button className="p-1 hover:opacity-70"><Copy size={14} /></button>
      </div>
    </div>
  );
}
