import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FileBarChart2, Download, Eye, FileText, Filter, Star, Calendar,
  Mail, TrendingUp, ShieldCheck, History, Search, FileSpreadsheet,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Badge, Stat, Label, Input,
} from "@/components/portal-shell";
import { toast } from "sonner";
import { MollyLogo } from "@/components/molly-logo";

export const Route = createFileRoute("/admin/reporteria")({ component: Page });

type Reporte = { s: string; t: string; f: string; u: string; per: string; fmt: string; cat: "Operativo" | "Regulatorio" | "Comercial"; fav?: boolean };

const historialBase: Reporte[] = [
  { s: "RP-2026-000182", t: "Por cuenta madre",     f: "02/06/2026 10:14", u: "M. Solis", per: "May 2026", fmt: "PDF", cat: "Operativo", fav: true },
  { s: "RP-2026-000181", t: "Por subcuenta",        f: "01/06/2026 18:02", u: "T. Vega",  per: "May 2026", fmt: "CSV", cat: "Operativo" },
  { s: "RP-2026-000180", t: "Reporte AML mensual",  f: "01/06/2026 09:48", u: "L. Diaz",  per: "May 2026", fmt: "PDF", cat: "Regulatorio", fav: true },
  { s: "RP-2026-000179", t: "Por tipo de operacion", f: "31/05/2026 16:30", u: "M. Solis", per: "May 2026", fmt: "PDF", cat: "Operativo" },
  { s: "RP-2026-000178", t: "PEP/SDN validaciones", f: "30/05/2026 11:12", u: "P. Sosa",  per: "Abr 2026", fmt: "CSV", cat: "Regulatorio" },
  { s: "RP-2026-000177", t: "Remesas internacionales", f: "29/05/2026 14:22", u: "L. Diaz",  per: "May 2026", fmt: "PDF", cat: "Regulatorio" },
  { s: "RP-2026-000176", t: "Comisiones por cliente", f: "28/05/2026 09:10", u: "T. Vega",  per: "May 2026", fmt: "Excel", cat: "Comercial" },
];

type TipoReporte = {
  v: string; l: string; d: string; cat: "Operativo" | "Regulatorio" | "Comercial"; icon: typeof FileText;
};

const tipos: TipoReporte[] = [
  { v: "madre",   l: "Por cuenta madre",            d: "Consolidado a nivel cliente",                cat: "Operativo",   icon: FileBarChart2 },
  { v: "sub",     l: "Por subcuenta especifica",    d: "Movimientos de una subcuenta CVU",           cat: "Operativo",   icon: FileText },
  { v: "periodo", l: "Por periodo",                 d: "Cortes mensuales, trimestrales o custom",    cat: "Operativo",   icon: Calendar },
  { v: "op",      l: "Por tipo de operacion",       d: "Transferencias, cobros, links, QR, servicios", cat: "Operativo", icon: TrendingUp },
  { v: "kyc",     l: "Reporte KYC",                 d: "Validaciones automaticas y manuales",        cat: "Regulatorio", icon: ShieldCheck },
  { v: "aml",    l: "Reporte AML",                  d: "Alertas, ROS y operaciones revisadas",       cat: "Regulatorio", icon: ShieldCheck },
  { v: "pep",     l: "Reporte PEP / SDN",           d: "Validaciones contra listas oficiales",       cat: "Regulatorio", icon: ShieldCheck },
  { v: "remesas", l: "Reporte de remesas",          d: "Transferencias internacionales (MORE)",      cat: "Regulatorio", icon: TrendingUp },
  { v: "comi",    l: "Comisiones cobradas",         d: "Ingresos por concepto y cliente",            cat: "Comercial",   icon: TrendingUp },
];

type Programado = { n: string; tipo: string; freq: "Diario" | "Semanal" | "Mensual"; dest: string; prox: string; act: boolean };

const programados: Programado[] = [
  { n: "Cierre diario Operaciones", tipo: "Por cuenta madre", freq: "Diario",  dest: "ops@molly.com",      prox: "Manana 08:00", act: true },
  { n: "Reporte AML semanal",       tipo: "Reporte AML",      freq: "Semanal", dest: "compliance@molly.com", prox: "Lun 09:00",    act: true },
  { n: "Comisiones mensuales",      tipo: "Comisiones cobradas", freq: "Mensual", dest: "finanzas@molly.com",  prox: "01/07 07:00",  act: true },
  { n: "PEP/SDN trimestral",        tipo: "Reporte PEP / SDN", freq: "Mensual", dest: "compliance@molly.com", prox: "01/07 06:30",  act: false },
];

const auditoria = [
  { f: "02/06 14:22", u: "M. Solis", a: "Descargo",   r: "RP-2026-000182" },
  { f: "02/06 10:14", u: "M. Solis", a: "Genero",     r: "RP-2026-000182" },
  { f: "01/06 18:30", u: "T. Vega",  a: "Compartio",  r: "RP-2026-000181 (compliance@molly.com)" },
  { f: "01/06 18:02", u: "T. Vega",  a: "Genero",     r: "RP-2026-000181" },
  { f: "01/06 11:08", u: "L. Diaz",  a: "Descargo",   r: "RP-2026-000180" },
  { f: "01/06 09:48", u: "L. Diaz",  a: "Genero",     r: "RP-2026-000180 (AML)" },
];

function Page() {
  const [tipo, setTipo] = useState("madre");
  const [preview, setPreview] = useState(false);
  const [tab, setTab] = useState<"generar" | "programados" | "auditoria">("generar");
  const [catFilter, setCatFilter] = useState<"Todos" | "Operativo" | "Regulatorio" | "Comercial">("Todos");
  const [soloFav, setSoloFav] = useState(false);
  const [search, setSearch] = useState("");
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>(
    Object.fromEntries(historialBase.filter(h => h.fav).map(h => [h.s, true]))
  );
  const serie = "RP-2026-000183";

  const historial = useMemo(
    () => historialBase.filter(h =>
      (catFilter === "Todos" || h.cat === catFilter) &&
      (!soloFav || favoritos[h.s]) &&
      (search === "" || h.t.toLowerCase().includes(search.toLowerCase()) || h.s.includes(search))
    ),
    [catFilter, soloFav, favoritos, search]
  );

  const tipoSel = tipos.find(t => t.v === tipo)!;

  return (
    <>
      <PageHeader
        title="Reporteria"
        description="Dashboard ejecutivo, generacion con numero de serie, programacion automatica y auditoria completa."
        action={
          <div className="flex gap-2">
            <BtnOutline onClick={() => setTab("programados")}><Calendar size={14} /> Programados</BtnOutline>
            <BtnOutline onClick={() => setTab("auditoria")}><History size={14} /> Auditoria</BtnOutline>
          </div>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Stat label="Reportes generados (mes)" value="142" sub="+18% vs mes anterior" />
        <Stat label="Volumen reportado" value="$ 1.84B" sub="Total operado" />
        <Stat label="Operaciones" value="48.290" sub="May 2026" />
        <Stat label="Reportes regulatorios" value="12" sub="KYC, AML, PEP, Remesas" />
        <Stat label="Programados activos" value={String(programados.filter(p => p.act).length)} sub={`${programados.length} configurados`} />
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm flex items-center gap-2"><TrendingUp size={14} /> Tendencia mensual de operaciones</h3>
          <select className="h-8 px-2 rounded-md border bg-card text-xs">
            <option>ultimos 6 meses</option><option>ultimo ano</option><option>YTD</option>
          </select>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[42, 58, 51, 67, 74, 82, 78, 91, 88, 102, 124, 142].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t bg-gradient-to-t from-[color:var(--brand-dark)] to-[color:var(--brand-primary)]" style={{ height: `${v / 1.5}%` }} />
              <div className="text-[10px] text-muted-foreground">{["J","J","A","S","O","N","D","E","F","M","A","M"][i]}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-1 border-b mb-5">
        {[
          { k: "generar",     l: "Generar reporte",  i: FileBarChart2 },
          { k: "programados", l: "Programados",      i: Calendar },
          { k: "auditoria",   l: "Auditoria",        i: History },
        ].map((t) => {
          const Icon = t.i;
          return (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 -mb-px ${
                tab === t.k ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} /> {t.l}
            </button>
          );
        })}
      </div>

      {tab === "generar" && (
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 mb-6">
          <Card>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><FileBarChart2 size={16} /> Nuevo reporte</h3>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setPreview(true); }}>
              <div>
                <Label>Tipo de reporte</Label>
                <div className="grid grid-cols-1 gap-2 mt-1 max-h-72 overflow-y-auto pr-1">
                  {tipos.map((t) => {
                    const Icon = t.icon;
                    return (
                      <label key={t.v} className={`flex items-start gap-2 border rounded-md p-2.5 cursor-pointer ${tipo === t.v ? "border-primary bg-[color:var(--brand-soft)]/40" : ""}`}>
                        <input type="radio" name="tipo" value={t.v} checked={tipo === t.v} onChange={() => setTipo(t.v)} className="mt-1" />
                        <Icon size={16} className="mt-0.5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold flex items-center gap-2">
                            {t.l}
                            <Badge tone={t.cat === "Regulatorio" ? "warn" : t.cat === "Comercial" ? "success" : "neutral"}>{t.cat}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">{t.d}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Desde</Label><Input type="date" /></div>
                <div><Label>Hasta</Label><Input type="date" /></div>
              </div>
              <div>
                <Label>Cliente</Label>
                <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
                  <option>Todos los clientes</option><option>Pagos Express SRL</option>
                  <option>Microcreditos del Sur</option><option>Consorcio Larrea 1200</option>
                </select>
              </div>
              <details className="rounded-md border p-3">
                <summary className="text-xs font-semibold cursor-pointer flex items-center gap-1"><Filter size={12} /> Filtros avanzados</summary>
                <div className="space-y-2 mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Monto desde</Label><Input placeholder="0" /></div>
                    <div><Label>Monto hasta</Label><Input placeholder="Sin tope" /></div>
                  </div>
                  <div><Label>Subcuenta</Label>
                    <select className="w-full h-9 px-3 rounded-md border bg-card text-xs">
                      <option>Todas</option><option>Operaciones</option><option>Sucursales</option>
                    </select>
                  </div>
                  <div><Label>Canal</Label>
                    <select className="w-full h-9 px-3 rounded-md border bg-card text-xs">
                      <option>Todos</option><option>Web</option><option>API</option><option>App movil</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs"><input type="checkbox" /> Solo operaciones revisadas por compliance</label>
                </div>
              </details>
              <div>
                <Label>Formato de exportacion</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "PDF",   l: "PDF firmado",   i: FileText },
                    { v: "Excel", l: "Excel",         i: FileSpreadsheet },
                    { v: "CSV",   l: "CSV",           i: FileText },
                  ].map(f => {
                    const I = f.i;
                    return (
                      <label key={f.v} className="border rounded-md p-2 text-center cursor-pointer hover:border-primary">
                        <input type="radio" name="fmt" defaultChecked={f.v === "PDF"} className="sr-only" />
                        <I size={16} className="mx-auto mb-1 text-muted-foreground" />
                        <div className="text-[11px] font-semibold">{f.l}</div>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <BtnOutline type="button" className="flex-1" onClick={() => setPreview(true)}>
                  <Eye size={14} /> Vista previa
                </BtnOutline>
                <BtnPrimary type="submit" className="flex-1"><FileBarChart2 size={14} /> Generar</BtnPrimary>
              </div>
            </form>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2"><FileText size={16} /> Historial de reportes</h3>
                <BtnOutline className="h-9 px-3 text-xs" onClick={() => toast.success("Historial exportado")}><Download size={12} /> Exportar</BtnOutline>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar serie o tipo..." className="h-9 pl-8" />
                </div>
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as typeof catFilter)} className="h-9 px-2 rounded-md border bg-card text-xs">
                  <option>Todos</option><option>Operativo</option><option>Regulatorio</option><option>Comercial</option>
                </select>
                <BtnOutline className={`h-9 px-3 text-xs ${soloFav ? "bg-[color:var(--brand-soft)]" : ""}`} onClick={() => setSoloFav(v => !v)}>
                  <Star size={12} className={soloFav ? "fill-amber-400 text-amber-400" : ""} /> Favoritos
                </BtnOutline>
              </div>
            </div>
            <div className="divide-y max-h-[520px] overflow-y-auto">
              {historial.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">No hay reportes con esos filtros.</div>
              )}
              {historial.map((h) => (
                <div key={h.s} className="flex items-center justify-between py-3 px-5">
                  <div className="flex items-start gap-3 min-w-0">
                    <button onClick={() => setFavoritos(f => ({ ...f, [h.s]: !f[h.s] }))} className="mt-1">
                      <Star size={14} className={favoritos[h.s] ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
                    </button>
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-muted-foreground">{h.s}</div>
                      <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                        {h.t} · {h.per}
                        <Badge tone={h.cat === "Regulatorio" ? "warn" : h.cat === "Comercial" ? "success" : "neutral"}>{h.cat}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Generado por {h.u} · {h.f}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge tone="neutral">{h.fmt}</Badge>
                    <BtnOutline className="h-9 w-9 px-0" onClick={() => toast.success(`Compartiendo ${h.s}`)}><Mail size={12} /></BtnOutline>
                    <BtnOutline className="h-9 px-3 text-xs" onClick={() => toast.success(`Descargando ${h.s}`)}>
                      <Download size={12} /> Descargar
                    </BtnOutline>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "programados" && (
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Calendar size={16} /> Reportes programados</h3>
              <p className="text-xs text-muted-foreground">Envio automatico por correo segun frecuencia.</p>
            </div>
            <BtnPrimary onClick={() => toast.success("Nuevo programado creado")}><Calendar size={14} /> Nuevo programado</BtnPrimary>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2.5">Nombre</th>
                <th className="text-left px-5 py-2.5">Tipo</th>
                <th className="text-left px-5 py-2.5">Frecuencia</th>
                <th className="text-left px-5 py-2.5">Destinatarios</th>
                <th className="text-left px-5 py-2.5">Proxima ejecucion</th>
                <th className="text-left px-5 py-2.5">Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {programados.map((p) => (
                <tr key={p.n} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3 font-semibold">{p.n}</td>
                  <td className="px-5 py-3 text-xs">{p.tipo}</td>
                  <td className="px-5 py-3 text-xs"><Badge tone="neutral">{p.freq}</Badge></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{p.dest}</td>
                  <td className="px-5 py-3 text-xs">{p.prox}</td>
                  <td className="px-5 py-3"><Badge tone={p.act ? "success" : "neutral"}>{p.act ? "Activo" : "Pausado"}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <BtnOutline className="h-8 px-2 text-xs" onClick={() => toast.success(`${p.n} ${p.act ? "pausado" : "activado"}`)}>
                      {p.act ? "Pausar" : "Activar"}
                    </BtnOutline>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "auditoria" && (
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold flex items-center gap-2"><History size={16} /> Trazabilidad de descargas y accesos</h3>
            <p className="text-xs text-muted-foreground">Registro inmutable · cada accion queda auditada con usuario, fecha y reporte.</p>
          </div>
          <div className="divide-y">
            {auditoria.map((a, i) => (
              <div key={i} className="flex justify-between items-center px-5 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] flex items-center justify-center text-[11px] font-semibold">
                    {a.u.split(" ").map(p => p[0]).join("")}
                  </div>
                  <div>
                    <div><strong>{a.u}</strong> · <span className="text-muted-foreground">{a.a}</span> {a.r}</div>
                    <div className="text-xs text-muted-foreground">{a.f}</div>
                  </div>
                </div>
                <Badge tone={a.a === "Descargo" ? "neutral" : a.a === "Compartio" ? "warn" : "success"}>{a.a}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreview(false)} />
          <div className="relative bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
              <div className="font-semibold">Vista previa del reporte</div>
              <BtnOutline className="h-8 px-3 text-xs" onClick={() => setPreview(false)}>Cerrar</BtnOutline>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <MollyLogo />
                <div className="text-right text-xs text-muted-foreground">
                  <div className="font-mono font-semibold text-foreground">{serie}</div>
                  <div>Generado: {new Date().toLocaleString("es-AR")}</div>
                </div>
              </div>
              <h2 className="text-xl font-semibold">Reporte institucional Molly</h2>
              <div className="text-sm text-muted-foreground">
                {tipoSel.l} · <Badge tone={tipoSel.cat === "Regulatorio" ? "warn" : "neutral"}>{tipoSel.cat}</Badge> · Periodo mayo 2026
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-muted/30"><div className="text-xs text-muted-foreground">Ingresos</div><div className="font-display tabular-nums font-semibold text-lg">$ 12.420.300</div></Card>
                <Card className="bg-muted/30"><div className="text-xs text-muted-foreground">Egresos</div><div className="font-display tabular-nums font-semibold text-lg">$ 8.180.500</div></Card>
                <Card className="bg-muted/30"><div className="text-xs text-muted-foreground">Neto</div><div className="font-display tabular-nums font-semibold text-lg text-emerald-700">+ $ 4.239.800</div></Card>
              </div>
              <Card>
                <div className="text-xs text-muted-foreground mb-2">Top 3 conceptos</div>
                <div className="space-y-2 text-sm">
                  {[["Cobros masivos","$ 5.840.200","48%"],["Transferencias salida","$ 3.180.000","26%"],["Servicios","$ 1.240.500","10%"]].map(([n,m,p]) => (
                    <div key={n} className="flex justify-between"><span>{n}</span><span className="text-muted-foreground">{m} <strong className="text-foreground ml-2">{p}</strong></span></div>
                  ))}
                </div>
              </Card>
              <div className="text-xs text-muted-foreground border-t pt-3">
                Documento firmado digitalmente por Molly Money Life SA · Serie {serie} · Hash SHA-256 trazable
              </div>
              <div className="flex gap-2 pt-2">
                <BtnOutline className="flex-1" onClick={() => setPreview(false)}>Cancelar</BtnOutline>
                <BtnPrimary className="flex-1" onClick={() => { setPreview(false); toast.success(`Reporte ${serie} generado`); }}>
                  <Download size={14} /> Descargar
                </BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
