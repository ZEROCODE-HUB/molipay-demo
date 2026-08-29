import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Zap,
  Flame,
  Droplet,
  Building2,
  Tv,
  Phone,
  Wifi,
  FileText,
  Clock,
  Globe,
  Send,
  Calendar,
  Filter,
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
import type { LucideIcon } from "lucide-react";
import { FormDialog } from "@/components/form-dialog";

export const Route = createFileRoute("/app/servicios")({ component: Page });

type Item = {
  n: string;
  c: string;
  v: string;
  venc: string;
  icon: LucideIcon;
  cat: string;
  e: "Pendiente" | "Proximo" | "Vencido";
  debito?: boolean;
  suscrito: boolean;
};

const servicios: Item[] = [
  { n: "Edesur", c: "Cuenta 8821-039 · Belgrano", v: "$ 64.320,00", venc: "05/06/2026", icon: Zap, cat: "Energia", e: "Pendiente", debito: true, suscrito: true },
  { n: "Metrogas", c: "Cuenta 4421-128 · Belgrano", v: "$ 22.180,00", venc: "08/06/2026", icon: Flame, cat: "Gas", e: "Pendiente", debito: true, suscrito: true },
  { n: "AySA", c: "Cuenta 9990-2211", v: "$ 18.450,00", venc: "12/06/2026", icon: Droplet, cat: "Agua", e: "Proximo", debito: true, suscrito: true },
  { n: "ABL CABA", c: "Partida 12.345.678", v: "$ 45.900,00", venc: "15/06/2026", icon: Building2, cat: "Impuesto", e: "Proximo", suscrito: true },
  { n: "ARBA", c: "Cuenta 88.123-4", v: "$ 88.230,00", venc: "20/06/2026", icon: FileText, cat: "Impuesto", e: "Proximo", suscrito: true },
  { n: "Cablevision", c: "Cuenta 7728-339", v: "$ 32.100,00", venc: "03/06/2026", icon: Tv, cat: "Internet", e: "Vencido", debito: true, suscrito: true },
  { n: "Telecom", c: "Linea 011-4444-5555", v: "$ 14.800,00", venc: "10/06/2026", icon: Phone, cat: "Telefonia", e: "Proximo", debito: true, suscrito: true },
  { n: "Fibertel Empresas", c: "Cuenta 4488-1102", v: "$ 88.500,00", venc: "14/06/2026", icon: Wifi, cat: "Internet", e: "Proximo", debito: true, suscrito: true },
  { n: "Claro Empresas", c: "Linea corporativa", v: "$ 0", venc: "-", icon: Phone, cat: "Telefonia", e: "Proximo", suscrito: false },
  { n: "OSDE", c: "Plan corporativo", v: "$ 0", venc: "-", icon: Building2, cat: "Salud", e: "Proximo", suscrito: false },
  { n: "Mercado Pago", c: "Cuenta merchant", v: "$ 0", venc: "-", icon: Globe, cat: "Servicios", e: "Proximo", suscrito: false },
];

const cats = ["Todos", "Energia", "Gas", "Agua", "Impuesto", "Internet", "Telefonia"];

type TxHist = {
  f: string;
  s: string;
  cat: string;
  m: string;
  e: "Pagado" | "Vencido" | "Cancelado";
};
const historial: TxHist[] = [
  { f: "03/06/2026", s: "Cablevision", cat: "Internet", m: "$ 32.100", e: "Pagado" },
  { f: "01/06/2026", s: "Edesur", cat: "Energia", m: "$ 58.200", e: "Pagado" },
  { f: "28/05/2026", s: "AySA", cat: "Agua", m: "$ 17.900", e: "Pagado" },
  { f: "25/05/2026", s: "ABL CABA", cat: "Impuesto", m: "$ 44.200", e: "Pagado" },
  { f: "22/05/2026", s: "Telecom", cat: "Telefonia", m: "$ 14.800", e: "Pagado" },
  { f: "20/05/2026", s: "Metrogas", cat: "Gas", m: "$ 22.180", e: "Pagado" },
  { f: "18/05/2026", s: "ARBA", cat: "Impuesto", m: "$ 88.230", e: "Pagado" },
  { f: "15/05/2026", s: "Fibertel Empresas", cat: "Internet", m: "$ 88.500", e: "Pagado" },
  { f: "12/05/2026", s: "Edesur", cat: "Energia", m: "$ 58.200", e: "Pagado" },
  { f: "10/05/2026", s: "AySA", cat: "Agua", m: "$ 17.900", e: "Cancelado" },
  { f: "08/05/2026", s: "ABL CABA", cat: "Impuesto", m: "$ 44.200", e: "Vencido" },
  { f: "05/05/2026", s: "Telecom", cat: "Telefonia", m: "$ 14.800", e: "Pagado" },
];

const remesas: Array<{
  f: string;
  pais: string;
  banco: string;
  mARS: string;
  mDest: string;
  tc: string;
  e: "Completado" | "En proceso" | "Rechazado";
}> = [
  {
    f: "01/06/2026",
    pais: "Colombia",
    banco: "Bancolombia",
    mARS: "$ 850.000",
    mDest: "COP 3.420.000",
    tc: "1 ARS = 4,02 COP",
    e: "Completado",
  },
  {
    f: "28/05/2026",
    pais: "Mexico",
    banco: "BBVA Mexico",
    mARS: "$ 1.200.000",
    mDest: "MXN 20.400",
    tc: "Cripto USDT",
    e: "Completado",
  },
  {
    f: "20/05/2026",
    pais: "Espana",
    banco: "Santander ES",
    mARS: "$ 2.400.000",
    mDest: "EUR 1.860",
    tc: "Bonos AL30/AL30D",
    e: "En proceso",
  },
  {
    f: "15/05/2026",
    pais: "Brasil",
    banco: "Itau",
    mARS: "$ 680.000",
    mDest: "BRL 3.180",
    tc: "P2P",
    e: "Rechazado",
  },
];

function parseDate(d: string) {
  const [dd, mm, yyyy] = d.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

function daysUntil(d: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const t = parseDate(d);
  return Math.ceil((t.getTime() - now.getTime()) / 86400000);
}

type Tab = "servicios" | "remesas";
type SectionTab = "proximos" | "suscritos" | "disponibles" | "historial";

const PREVIEW_LIMIT = 5;

function Page() {
  const [pagar, setPagar] = useState<Item | null>(null);
  const [tab, setTab] = useState<Tab>("servicios");
  const [remesaOpen, setRemesaOpen] = useState(false);
  const [catFilt, setCatFilt] = useState("Todos");
  const [sort, setSort] = useState("vencimiento");

  const [hCat, setHCat] = useState("Todas");
  const [hStatus, setHStatus] = useState("Todos");
  const [hDesde, setHDesde] = useState("");
  const [sectionTab, setSectionTab] = useState<SectionTab>("proximos");
  const [proxAll, setProxAll] = useState(false);
  const [suscAll, setSuscAll] = useState(false);
  const [dispAll, setDispAll] = useState(false);
  const [histAll, setHistAll] = useState(false);
  const [debitoSet, setDebitoSet] = useState<Set<string>>(new Set());
  const [editarServicio, setEditarServicio] = useState<Item | null>(null);

  const sorted = [...servicios].sort((a, b) => {
    if (sort === "vencimiento") return parseDate(a.venc).getTime() - parseDate(b.venc).getTime();
    if (sort === "monto")
      return (
        parseFloat(a.v.replace(/[^0-9,]/g, "").replace(",", ".")) -
        parseFloat(b.v.replace(/[^0-9,]/g, "").replace(",", "."))
      );
    return a.n.localeCompare(b.n);
  });
  const filtrados = catFilt === "Todos" ? sorted : sorted.filter((s) => s.cat === catFilt);

  const prox = [...filtrados].sort(
    (a, b) => parseDate(a.venc).getTime() - parseDate(b.venc).getTime(),
  );

  const suscritos = useMemo(() => filtrados.filter((s) => s.suscrito), [filtrados]);
  const disponibles = useMemo(() => servicios.filter((s) => !s.suscrito), []);

  const hFiltrados = historial.filter((t) => {
    if (hCat !== "Todas" && t.cat !== hCat) return false;
    if (hStatus !== "Todos" && t.e !== hStatus) return false;
    if (hDesde && parseDate(t.f).getTime() < parseDate(hDesde).getTime()) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Servicios y pagos"
        description="Pago de servicios, remesas internacionales e historial de operaciones."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Servicios adheridos
          </div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">14</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            A pagar este mes
          </div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">$ 384.480</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">8 facturas</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Vencidos</div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">1</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Cablevision - $ 32.100</div>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Pagado este mes
          </div>
          <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">$ 1.240.300</div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b">
        {(
          [
            ["servicios", "Servicios"],
            ["remesas", "Remesas y crossborder"],
          ] as Array<[Tab, string]>
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === k
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "servicios" && (
        <>
          <div className="flex gap-1 mb-5 bg-muted/50 p-1 rounded-lg">
            {([
              ["proximos", `Proximos pagos (${prox.length})`],
              ["suscritos", `Suscritos (${suscritos.length})`],
              ["disponibles", `Disponibles (${disponibles.length})`],
              ["historial", `Historial (${hFiltrados.length})`],
            ] as Array<[SectionTab, string]>).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setSectionTab(k)}
                className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition ${
                  sectionTab === k
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {sectionTab === "proximos" && (
            <Card className="mb-6">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                Proximos pagos y vencimientos
              </h3>
              <div className="divide-y">
                {(proxAll ? prox : prox.slice(0, PREVIEW_LIMIT)).map((s) => {
                  const Icon = s.icon;
                  const dd = daysUntil(s.venc);
                  const isVencido = dd < 0;
                  return (
                    <div key={s.n + s.c} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-md bg-[color:var(--brand-soft)] flex items-center justify-center shrink-0">
                          <Icon size={16} className="text-[color:var(--brand-dark)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{s.n}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.c} · {s.cat}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-semibold">{s.v}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end">
                            <Clock size={10} />
                            {isVencido ? `Vencido hace ${Math.abs(dd)} dias` : `Vence en ${dd} dias`}
                          </div>
                        </div>
                        <Badge tone={isVencido ? "danger" : s.e === "Pendiente" ? "warn" : "neutral"}>
                          {isVencido ? "Vencido" : s.e}
                        </Badge>
                        {s.debito && (
                          <button
                            onClick={() => {
                              setDebitoSet((prev) => {
                                const next = new Set(prev);
                                const k = s.n + s.c;
                                if (next.has(k)) next.delete(k);
                                else next.add(k);
                                return next;
                              });
                              toast.success(
                                debitoSet.has(s.n + s.c)
                                  ? "Debito directo desactivado de " + s.n
                                  : "Debito directo activado para " + s.n,
                              );
                            }}
                            className={`h-9 px-2.5 rounded-md text-[11px] font-semibold border transition ${
                              debitoSet.has(s.n + s.c)
                                ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border-transparent"
                                : "bg-card text-muted-foreground border-border hover:bg-muted"
                            }`}
                            title="Debito directo"
                          >
                            DD
                          </button>
                        )}
                        <BtnPrimary className="h-9 px-4" onClick={() => setPagar(s)}>
                          Pagar
                        </BtnPrimary>
                      </div>
                    </div>
                  );
                })}
              </div>
              {prox.length > PREVIEW_LIMIT && (
                <button
                  onClick={() => setProxAll(!proxAll)}
                  className="w-full text-center text-xs font-semibold text-primary pt-3 pb-1 hover:opacity-80 transition border-t border-border mt-1"
                >
                  {proxAll ? "Mostrar menos" : `Ver todos (${prox.length})`}
                </button>
              )}
            </Card>
          )}

          {sectionTab === "suscritos" && (
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Servicios suscritos</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar servicio o numero de cuenta..." className="pl-9" />
                </div>
                <select className="h-10 px-3 rounded-md border bg-card text-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="vencimiento">Orden: vencimiento</option>
                  <option value="monto">Monto</option>
                  <option value="alfabetico">Alfabetico</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cats.map((c) => (
                  <button key={c} onClick={() => setCatFilt(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${catFilt === c ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border-transparent" : "bg-card hover:bg-muted"}`}>{c}</button>
                ))}
              </div>
              <div className="divide-y">
                {(suscAll ? suscritos : suscritos.slice(0, PREVIEW_LIMIT)).map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.n + s.c} className="flex items-center justify-between gap-3 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md bg-[color:var(--brand-soft)] flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-[color:var(--brand-dark)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{s.n} <span className="text-muted-foreground font-normal">· {s.cat}</span></div>
                          <div className="text-xs text-muted-foreground truncate">{s.c}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="text-sm font-semibold">{s.v}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end"><Clock size={10} /> Vence {s.venc}</div>
                        </div>
                        <Badge tone={s.e === "Vencido" ? "danger" : s.e === "Pendiente" ? "warn" : "neutral"}>{s.e}</Badge>
                        {s.debito && (
                          <button onClick={() => { setDebitoSet((prev) => { const next = new Set(prev); const k = s.n + s.c; if (next.has(k)) next.delete(k); else next.add(k); return next; }); toast.success(debitoSet.has(s.n + s.c) ? "Debito directo desactivado de " + s.n : "Debito directo activado para " + s.n); }} className={`h-9 px-2.5 rounded-md text-[11px] font-semibold border transition ${debitoSet.has(s.n + s.c) ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border-transparent" : "bg-card text-muted-foreground border-border hover:bg-muted"}`} title="Debito directo">DD</button>
                        )}
                        <BtnOutline className="h-9 px-2.5 text-xs" onClick={() => setEditarServicio(s)}>Editar</BtnOutline>
                        <BtnPrimary className="h-9 px-4" onClick={() => setPagar(s)}>Pagar</BtnPrimary>
                      </div>
                    </div>
                  );
                })}
              </div>
              {suscritos.length > PREVIEW_LIMIT && (
                <button onClick={() => setSuscAll(!suscAll)} className="w-full text-center text-xs font-semibold text-primary pt-3 pb-1 hover:opacity-80 transition border-t border-border mt-1">
                  {suscAll ? "Mostrar menos" : `Ver todos (${suscritos.length})`}
                </button>
              )}
            </Card>
          )}

          {sectionTab === "disponibles" && (
            <Card className="mb-6">
              <h3 className="font-semibold text-sm mb-4">Servicios disponibles para suscribir</h3>
              <div className="divide-y">
                {(dispAll ? disponibles : disponibles.slice(0, PREVIEW_LIMIT)).map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.n + s.c} className="flex items-center justify-between gap-3 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{s.n} <span className="text-muted-foreground font-normal">· {s.cat}</span></div>
                          <div className="text-xs text-muted-foreground truncate">No suscrito</div>
                        </div>
                      </div>
                      <BtnPrimary className="h-9 px-4 shrink-0" onClick={() => { toast.success("Suscripcion a " + s.n + " iniciada"); }}>Suscribir</BtnPrimary>
                    </div>
                  );
                })}
              </div>
              {disponibles.length > PREVIEW_LIMIT && (
                <button onClick={() => setDispAll(!dispAll)} className="w-full text-center text-xs font-semibold text-primary pt-3 pb-1 hover:opacity-80 transition border-t border-border mt-1">
                  {dispAll ? "Mostrar menos" : `Ver todos (${disponibles.length})`}
                </button>
              )}
            </Card>
          )}

          {sectionTab === "historial" && (
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-4 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Filter size={14} className="text-muted-foreground" />
                  Historial de transacciones
                </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <Search
                      size={12}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Buscar servicio..."
                      className="h-8 pl-7 text-xs max-w-[160px]"
                    />
                  </div>
                  <select
                    className="h-8 px-2 rounded border bg-card text-xs"
                    value={hCat}
                    onChange={(e) => setHCat(e.target.value)}
                  >
                    <option value="Todas">Categoria: todas</option>
                    {cats
                      .filter((c) => c !== "Todos")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                  <select
                    className="h-8 px-2 rounded border bg-card text-xs"
                    value={hStatus}
                    onChange={(e) => setHStatus(e.target.value)}
                  >
                    <option value="Todos">Estado: todos</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Vencido">Vencido</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Desde:</span>
                    <input
                      type="date"
                      className="h-8 px-2 rounded border bg-card text-xs"
                      value={hDesde}
                      onChange={(e) => setHDesde(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                      <th className="text-left px-5 py-2.5">Fecha</th>
                      <th className="text-left px-5 py-2.5">Servicio</th>
                      <th className="text-left px-5 py-2.5">Categoria</th>
                      <th className="text-right px-5 py-2.5">Monto</th>
                      <th className="text-right px-5 py-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(histAll ? hFiltrados : hFiltrados.slice(0, PREVIEW_LIMIT)).map((t, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 text-xs text-muted-foreground">{t.f}</td>
                        <td className="px-5 py-3 font-semibold text-sm">{t.s}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{t.cat}</td>
                        <td className="px-5 py-3 font-mono tabular-nums text-right font-semibold">{t.m}</td>
                        <td className="px-5 py-3 text-right">
                          <Badge
                            tone={
                              t.e === "Pagado"
                                ? "success"
                                : t.e === "Cancelado"
                                  ? "neutral"
                                  : "danger"
                            }
                          >
                            {t.e}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hFiltrados.length > PREVIEW_LIMIT && (
                <button
                  onClick={() => setHistAll(!histAll)}
                  className="w-full text-center text-xs font-semibold text-primary pt-3 pb-1 hover:opacity-80 transition border-t border-border mt-1"
                >
                  {histAll ? "Mostrar menos" : `Ver todos (${hFiltrados.length})`}
                </button>
              )}
            </Card>
          )}
        </>
      )}

      {tab === "remesas" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-card border rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Enviadas este mes
              </div>
              <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">12</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">$ 18,4M ARS</div>
            </div>
            <div className="bg-card border rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Paises destino
              </div>
              <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">6</div>
            </div>
            <div className="bg-card border rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                TC promedio
              </div>
              <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">MORE rate</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Bonos · Cripto · P2P</div>
            </div>
            <div className="bg-card border rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                En proceso
              </div>
              <div className="font-display tabular-nums text-base md:text-lg font-semibold mt-0.5">2</div>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
            <Card>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe size={16} /> Nueva remesa internacional
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Procesada via MORE con la mejor cotizacion disponible (bonos, cripto o P2P).
              </p>
              <BtnPrimary className="w-full" onClick={() => setRemesaOpen(true)}>
                <Send size={14} /> Enviar remesa
              </BtnPrimary>
            </Card>
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Historial de remesas</h3>
                <div className="flex gap-2">
                  <select className="h-9 px-2 rounded-md border bg-card text-xs">
                    <option>Pais: todos</option>
                    <option>Colombia</option>
                    <option>Mexico</option>
                    <option>Espana</option>
                    <option>Brasil</option>
                  </select>
                  <Input type="date" className="h-9 max-w-[140px]" />
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                    <th className="text-left px-5 py-2.5">Fecha</th>
                    <th className="text-left px-5 py-2.5">Destino</th>
                    <th className="text-right px-5 py-2.5">ARS</th>
                    <th className="text-right px-5 py-2.5">Recibe</th>
                    <th className="text-right px-5 py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {remesas.map((r, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 text-xs text-muted-foreground">{r.f}</td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-sm">{r.pais}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.banco} · {r.tc}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono tabular-nums text-right font-semibold">{r.mARS}</td>
                      <td className="px-5 py-3 font-mono tabular-nums text-right">{r.mDest}</td>
                      <td className="px-5 py-3 text-right">
                        <Badge
                          tone={
                            r.e === "Completado"
                              ? "success"
                              : r.e === "En proceso"
                                ? "warn"
                                : "danger"
                          }
                        >
                          {r.e}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </>
      )}

      <FormDialog
        open={editarServicio !== null}
        onClose={() => setEditarServicio(null)}
        title={editarServicio ? `Editar ${editarServicio.n}` : "Editar servicio"}
        description="Modifica la configuracion del servicio."
        submitLabel="Guardar cambios"
        onSubmit={() => { setEditarServicio(null); toast.success("Servicio actualizado"); }}
      >
        {editarServicio && (
          <>
            <div><Label>Numero de cuenta / referencia</Label><Input defaultValue={editarServicio.c} /></div>
            <div><Label>Categoria</Label>
              <select className="w-full h-10 px-3 rounded-md border bg-card text-sm" defaultValue={editarServicio.cat}>
                {cats.filter((c) => c !== "Todos").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked={editarServicio.debito} /> Debito automatico habilitado</label>
          </>
        )}
      </FormDialog>

      <FormDialog
        open={pagar !== null}
        onClose={() => setPagar(null)}
        title={pagar ? `Pagar ${pagar.n}` : "Pagar servicio"}
        description={pagar ? `${pagar.c} · Vence ${pagar.venc}` : undefined}
        submitLabel="Confirmar pago"
        onSubmit={() => {
          const s = pagar;
          setPagar(null);
          if (s) toast.success(`Pago de ${s.n} confirmado por ${s.v}`);
        }}
      >
        <div className="p-4 rounded-md bg-muted">
          <div className="text-xs text-muted-foreground">Total a pagar</div>
          <div className="font-display tabular-nums text-2xl font-semibold mt-0.5">{pagar?.v}</div>
        </div>
        <div>
          <Label>Subcuenta de origen</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Operaciones — $ 6.389.830,55</option>
            <option>Sucursal Centro — $ 4.220.000,00</option>
            <option>Sucursal Norte — $ 1.870.500,00</option>
          </select>
        </div>
        <div>
          <Label>Fecha de pago</Label>
          <Input type="date" />
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" /> Adherir al debito automatico mensual
        </label>
      </FormDialog>

      <FormDialog
        open={remesaOpen}
        onClose={() => setRemesaOpen(false)}
        title="Enviar remesa internacional"
        description="Procesada via MORE · cotizacion aplicada al confirmar."
        submitLabel="Enviar remesa"
        size="lg"
        onSubmit={() => {
          setRemesaOpen(false);
          toast.success("Remesa enviada · en proceso de liquidacion");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Monto en ARS</Label>
            <Input placeholder="$ 0,00" />
          </div>
          <div>
            <Label>Pais destino</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Colombia</option>
              <option>Mexico</option>
              <option>Espana</option>
              <option>Brasil</option>
              <option>Chile</option>
              <option>Uruguay</option>
            </select>
          </div>
        </div>
        <div>
          <Label>Banco / cuenta del destinatario</Label>
          <Input placeholder="Ej. Bancolombia · Cuenta ahorros 1234-5678" />
        </div>
        <div>
          <Label>Beneficiario</Label>
          <Input placeholder="Nombre completo y documento" />
        </div>
        <div>
          <Label>Tipo de conversion</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Automatico (mejor cotizacion disponible)</option>
            <option>Bonos (AL30/AL30D)</option>
            <option>Cripto (USDT)</option>
            <option>P2P</option>
          </select>
        </div>
        <Card className="bg-muted/30">
          <div className="text-xs text-muted-foreground">Estimacion al confirmar</div>
          <div className="flex justify-between mt-1">
            <span className="font-semibold">1 ARS = 4,02 COP</span>
            <span className="font-semibold">≈ COP 4.020.000</span>
          </div>
        </Card>
      </FormDialog>
    </>
  );
}
