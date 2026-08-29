import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus, Copy, Wallet, Search, ChevronRight, X, Ban,
  CheckCircle2, ShieldAlert, MoreVertical,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Badge, Input, Label, Stat,
} from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";

export const Route = createFileRoute("/admin/cbu")({ component: Page });

type Cuenta = {
  cli: string; cuit: string; cbu: string; alias: string;
  saldo: string; alta: string; e: "Activa" | "Pausada" | "Bloqueada";
  subs: number;
};

const cuentas: Cuenta[] = [
  { cli: "Microcreditos del Sur", cuit: "30-71239988-0", cbu: "0000003 100099887766 11", alias: "microsur.operativa", saldo: "$ 18.420.000", alta: "03/04/2026", e: "Activa", subs: 3 },
  { cli: "Consorcio Larrea 1200", cuit: "30-71235678-2", cbu: "0000003 100022334455 01", alias: "larrea1200.expensas", saldo: "$ 5.840.200", alta: "12/05/2026", e: "Activa", subs: 2 },
  { cli: "Administradora Plaza", cuit: "30-71244455-1", cbu: "0000003 100044556677 04", alias: "plaza.garantias", saldo: "$ 2.140.000", alta: "01/05/2026", e: "Pausada", subs: 1 },
  { cli: "Municipalidad de Chivilcoy", cuit: "30-99876543-2", cbu: "0000003 100088990011 02", alias: "chivilcoy.recauda", saldo: "$ 84.200.000", alta: "20/02/2026", e: "Activa", subs: 8 },
  { cli: "Pagos Express SRL", cuit: "30-71300011-4", cbu: "0000003 100022113344 09", alias: "pagosexp.main", saldo: "$ 0", alta: "15/03/2026", e: "Bloqueada", subs: 0 },
];

const subDetalle = [
  { n: "Cuenta operativa", cbu: "0000003 100099887766 11", saldo: "$ 12.220.000", e: "Activa" },
  { n: "Desembolsos", cbu: "0000003 100099887766 12", saldo: "$ 4.880.000", e: "Activa" },
  { n: "Cobranzas terceros", cbu: "0000003 100099887766 13", saldo: "$ 1.320.000", e: "Activa" },
];

function Page() {
  const [detalle, setDetalle] = useState<Cuenta | null>(null);
  const [filtro, setFiltro] = useState("");
  const [nuevoOpen, setNuevoOpen] = useState(false);

  const list = cuentas.filter(c => c.cli.toLowerCase().includes(filtro.toLowerCase()) || c.cuit.includes(filtro));

  return (
    <>
      <PageHeader
        title="CBU y subcuentas"
        description="Asignacion de CVU/CBU a clientes y administracion de subcuentas operativas."
        action={<BtnPrimary onClick={() => setNuevoOpen(true)}><Plus size={16} /> Asignar nuevo CBU</BtnPrimary>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Cuentas activas" value="287" sub="14 nuevas este mes" />
        <Stat label="Subcuentas asignadas" value="1.842" />
        <Stat label="Saldo total bajo gestion" value="$ 2,18B" sub="ARS · cuentas operativas" />
        <Stat label="CBU bloqueados" value="6" sub="Accion de compliance" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={filtro} onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar cliente, CUIT, CBU o alias..." className="pl-9" />
          </div>
          <select className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>Estado: todos</option><option>Activa</option><option>Pausada</option><option>Bloqueada</option>
          </select>
        </div>

        <div className="hidden md:grid grid-cols-[1.4fr_1fr_1.6fr_1fr_0.8fr_0.8fr_auto] gap-4 px-5 py-3 border-b text-[11px] uppercase tracking-wide text-muted-foreground">
          <div>Cliente</div><div>CUIT</div><div>CBU / Alias</div>
          <div className="text-right">Saldo</div><div>Subc.</div><div>Estado</div><div></div>
        </div>
        {list.length === 0 ? (
          <div className="flex flex-col items-center text-center py-14">
            <Wallet size={28} className="text-muted-foreground mb-2" />
            <div className="font-semibold">No hay cuentas que coincidan</div>
            <div className="text-sm text-muted-foreground mt-1">Ajusta tu busqueda o asigna un nuevo CBU.</div>
          </div>
        ) : list.map((r) => (
          <div key={r.cbu} className="md:grid md:grid-cols-[1.4fr_1fr_1.6fr_1fr_0.8fr_0.8fr_auto] gap-4 px-5 py-4 border-b last:border-0 items-center">
            <div className="font-semibold">{r.cli}</div>
            <div className="text-xs text-muted-foreground font-mono">{r.cuit}</div>
            <div>
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                {r.cbu}
                <button className="hover:text-foreground"><Copy size={11} /></button>
              </div>
              <div className="text-xs text-primary font-semibold">@{r.alias}</div>
            </div>
            <div className="font-mono tabular-nums text-right text-sm font-semibold">{r.saldo}</div>
            <div className="text-sm">{r.subs}</div>
            <div>
              <Badge tone={r.e === "Activa" ? "success" : r.e === "Pausada" ? "warn" : "danger"}>{r.e}</Badge>
            </div>
            <div className="flex justify-end mt-2 md:mt-0">
              <BtnOutline className="h-9 px-3 text-xs" onClick={() => setDetalle(r)}>
                Detalle <ChevronRight size={12} />
              </BtnOutline>
            </div>
          </div>
        ))}
      </Card>

      {detalle && <CuentaDrawer c={detalle} onClose={() => setDetalle(null)} />}

      <FormDialog
        open={nuevoOpen}
        onClose={() => setNuevoOpen(false)}
        title="Asignar nuevo CBU"
        description="Genera un CVU/CBU para asociarlo a un cliente existente o nuevo."
        submitLabel="Asignar CBU"
        onSubmit={() => {
          setNuevoOpen(false);
          toast.success("CBU asignado correctamente");
        }}
      >
        <div>
          <Label>Cliente</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            {cuentas.map((c) => <option key={c.cuit}>{c.cli}</option>)}
            <option>+ Nuevo cliente…</option>
          </select>
        </div>
        <div>
          <Label>CUIT</Label>
          <Input placeholder="30-XXXXXXXX-X" />
        </div>
        <div>
          <Label>Alias deseado</Label>
          <Input placeholder="empresa.operativa" />
        </div>
        <div>
          <Label>Tipo de cuenta</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>CVU operativa</option>
            <option>CBU recaudacion</option>
            <option>CVU garantias</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" defaultChecked /> Crear subcuenta inicial por defecto
        </label>
      </FormDialog>
    </>
  );
}

function CuentaDrawer({ c, onClose }: { c: Cuenta; onClose: () => void }) {
  const [confirmar, setConfirmar] = useState<null | "bloquear" | "activar">(null);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <div className="text-xs text-muted-foreground">Detalle de cuenta</div>
            <div className="font-semibold text-lg">{c.cli}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-muted-foreground">Saldo consolidado</div>
                <div className="font-display tabular-nums text-3xl font-semibold mt-1">{c.saldo}</div>
                <div className="text-xs text-muted-foreground mt-1">CBU principal <span className="font-mono">{c.cbu}</span></div>
                <div className="text-xs text-primary font-semibold">@{c.alias}</div>
              </div>
              <Badge tone={c.e === "Activa" ? "success" : c.e === "Pausada" ? "warn" : "danger"}>{c.e}</Badge>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sm">Subcuentas asociadas ({c.subs})</h4>
              <BtnOutline className="h-8 px-3 text-xs"><Plus size={12} /> Agregar subcuenta</BtnOutline>
            </div>
            <div className="divide-y">
              {subDetalle.slice(0, c.subs || 0).map(s => (
                <div key={s.cbu} className="flex justify-between items-center py-3">
                  <div>
                    <div className="font-semibold text-sm">{s.n}</div>
                    <div className="text-xs text-muted-foreground font-mono">{s.cbu}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums text-sm font-semibold">{s.saldo}</span>
                    <Badge tone="success">{s.e}</Badge>
                    <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent"><MoreVertical size={12} /></button>
                  </div>
                </div>
              ))}
              {c.subs === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Sin subcuentas. Asigna una para segmentar la operatoria del cliente.
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h4 className="font-semibold text-sm mb-3">Acciones</h4>
            <div className="grid grid-cols-2 gap-2">
              <BtnOutline onClick={() => toast.success("Subcuenta agregada al cliente")}><Plus size={14} /> Asignar nuevo CBU</BtnOutline>
              <BtnOutline><Copy size={14} /> Copiar credenciales</BtnOutline>
              {c.e !== "Bloqueada" ? (
                <BtnOutline className="text-red-600 border-red-200 col-span-2"
                  onClick={() => setConfirmar("bloquear")}>
                  <Ban size={14} /> Bloquear cuenta
                </BtnOutline>
              ) : (
                <BtnPrimary className="col-span-2" onClick={() => setConfirmar("activar")}>
                  <CheckCircle2 size={14} /> Reactivar cuenta
                </BtnPrimary>
              )}
            </div>
          </Card>
        </div>
      </div>

      {confirmar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmar(null)} />
          <div className="relative bg-card rounded-lg max-w-md w-full p-6">
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmar === "bloquear" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                {confirmar === "bloquear" ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {confirmar === "bloquear" ? "Bloquear cuenta" : "Reactivar cuenta"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta accion {confirmar === "bloquear" ? "impedira toda operacion" : "permitira operar nuevamente"} para {c.cli}. Quedara registro auditable.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Label>Motivo *</Label>
              <Input placeholder="Detallar motivo..." />
            </div>
            <div className="flex gap-2 mt-5">
              <BtnOutline className="flex-1" onClick={() => setConfirmar(null)}>Cancelar</BtnOutline>
              <BtnPrimary className="flex-1" onClick={() => setConfirmar(null)}>Confirmar</BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}