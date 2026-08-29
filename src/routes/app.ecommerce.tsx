import { createFileRoute } from "@tanstack/react-router";
import {
  ShoppingCart,
  Power,
  FileText,
  ArrowRight,
  Copy,
  BadgeCheck,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import {
  PageHeader,
  Card,
  Input,
  BtnPrimary,
  BtnOutline,
  Badge,
  Label,
} from "@/components/portal-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ecommerce")({ component: Page });

const txGateway = [
  { f: "Hoy 10:18", id: "PAY-9k2x7a", m: "$ 18.400", e: "Aprobado" },
  { f: "Hoy 09:42", id: "PAY-9k2x6b", m: "$ 92.800", e: "Aprobado" },
  { f: "Ayer 18:30", id: "PAY-9k2x5c", m: "$ 45.000", e: "Aprobado" },
  { f: "Ayer 17:08", id: "PAY-9k2x4d", m: "$ 22.500", e: "Rechazado" },
  { f: "Ayer 14:22", id: "PAY-9k2x3e", m: "$ 8.200", e: "Aprobado" },
  { f: "02/06/2026", id: "PAY-9k2x2f", m: "$ 120.000", e: "Aprobado" },
  { f: "01/06/2026", id: "PAY-9k2x1g", m: "$ 5.600", e: "Rechazado" },
];

const meses = ["Todos", "Hoy", "Ayer", "ultimos 7 dias", "ultimos 30 dias", "Este mes"];

function Page() {
  const copy = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    toast.success(`${label} copiado`);
  };

  return (
    <>
      <PageHeader
        title="E-commerce"
        description="Pasarela de pagos digitales para tu tienda online."
      />

      {/* Stats compactas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Estado pasarela
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Activa
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">API v2 · Conectada</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Transacciones (mes)
          </div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">1.842</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">+12% vs mes anterior</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Volumen (mes)
          </div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">$ 8.4M</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Ticket promedio $ 4.560</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Aprobacion
          </div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">96.2%</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Tasa de conversion</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 mb-6">
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingCart size={16} /> Pasarela de pagos Molly
            </h3>
            <Badge tone="success">
              <Power size={10} className="mr-1" /> Conectada
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            API RESTful para integrar cobros desde tu e-commerce: links de pago, QR, tokenizacion de
            tarjetas y webhooks de notificacion. SDKs para Node, PHP y Python.
          </p>
          <ul className="text-xs text-muted-foreground mt-3 space-y-1">
            <li>
              · <strong className="text-foreground">POST /v2/payments</strong> — crear cobro
            </li>
            <li>
              · <strong className="text-foreground">GET /v2/payments/:id</strong> — consultar estado
            </li>
            <li>
              · <strong className="text-foreground">POST /v2/refunds</strong> — devolucion total o
              parcial
            </li>
            <li>
              · <strong className="text-foreground">Webhook</strong> — notificacion push de cada
              evento
            </li>
          </ul>
          <BtnOutline className="mt-4">
            <FileText size={14} /> Ver documentacion <ArrowRight size={12} />
          </BtnOutline>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Credenciales</h3>
          <div className="space-y-3">
            <div>
              <Label>API key (produccion)</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="••••••••••••••••••••••••"
                  className="font-mono text-xs"
                />
                <BtnOutline
                  className="shrink-0"
                  onClick={() => copy("••••••••••••••••••••••••", "API key")}
                >
                  <Copy size={14} />
                </BtnOutline>
              </div>
            </div>
            <div>
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value="https://api.molly.com.ar/v2/webhooks/empresa-demo"
                  className="font-mono text-xs"
                />
                <BtnOutline
                  className="shrink-0"
                  onClick={() =>
                    copy("https://api.molly.com.ar/v2/webhooks/empresa-demo", "Webhook")
                  }
                >
                  <Copy size={14} />
                </BtnOutline>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground border-t pt-2">
              Rota la API key periodicamente desde Seguridad. Las llamadas requieren firma
              HMAC-SHA256.
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b flex flex-wrap gap-3 items-center justify-between">
          <h3 className="font-semibold">Transacciones procesadas</h3>
          <div className="flex gap-2">
            <select className="h-8 px-2 rounded border bg-card text-xs">
              {meses.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input placeholder="Buscar ID..." className="h-8 pl-7 text-xs max-w-[180px]" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                <th className="text-left px-5 py-2.5">Fecha</th>
                <th className="text-left px-5 py-2.5">ID</th>
                <th className="text-right px-5 py-2.5">Monto</th>
                <th className="text-right px-5 py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {txGateway.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3 text-xs text-muted-foreground">{t.f}</td>
                  <td className="px-5 py-3 font-mono text-xs">{t.id}</td>
                  <td className="px-5 py-3 font-mono tabular-nums text-right font-semibold">{t.m}</td>
                  <td className="px-5 py-3 text-right">
                    <Badge tone={t.e === "Aprobado" ? "success" : "danger"}>{t.e}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
