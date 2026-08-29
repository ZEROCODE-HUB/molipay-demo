import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Send, Search, Upload, Star, MoreVertical, Tag } from "lucide-react";
import { PageHeader, Card, BtnPrimary, BtnOutline, Input, Badge, Stat, Label } from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";

export const Route = createFileRoute("/app/destinatarios")({ component: Page });

const data = [
  { n: "Proveedor SA", a: "proveedor.sa", cbu: "0000003 100099887766 11", b: "Banco Galicia", cat: "Proveedor", fav: true, ult: "Hoy", ops: 42 },
  { n: "Estudio Contable Rios", a: "rios.contable", cbu: "0140017 200044556677 22", b: "Banco Nacion", cat: "Servicios", fav: true, ult: "Ayer", ops: 12 },
  { n: "Servicios Generales SRL", a: "serv.generales", cbu: "0070099 300011223344 33", b: "Santander", cat: "Proveedor", fav: false, ult: "30/05", ops: 28 },
  { n: "Juan Perez", a: "juanperez.mp", cbu: "0000007 100012345678 90", b: "Mercado Pago", cat: "Empleado", fav: false, ult: "29/05", ops: 6 },
  { n: "Distribuidora Norte", a: "dist.norte", cbu: "0110055 400077889911 55", b: "BBVA", cat: "Proveedor", fav: false, ult: "25/05", ops: 18 },
  { n: "Laura Mendez", a: "laura.mendez", cbu: "0170099 100099887700 22", b: "Brubank", cat: "Empleado", fav: false, ult: "20/05", ops: 4 },
];

const categorias = [
  { n: "Todos", c: 24, active: true },
  { n: "Proveedores", c: 12 },
  { n: "Empleados", c: 8 },
  { n: "Servicios", c: 3 },
  { n: "Favoritos", c: 5 },
];

function Page() {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [transferir, setTransferir] = useState<(typeof data)[number] | null>(null);
  const [monto, setMonto] = useState("");
  return (
    <>
      <PageHeader
        title="Mis destinatarios"
        description="Agenda de contactos frecuentes con etiquetas y validacion CBU."
        action={
          <div className="flex gap-2">
            <BtnOutline><Upload size={14} /> Importar CSV</BtnOutline>
            <BtnPrimary onClick={() => setNuevoOpen(true)}><Plus size={16} /> Nuevo destinatario</BtnPrimary>
          </div>
        }
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total destinatarios" value="24" />
        <Stat label="Favoritos" value="5" />
        <Stat label="Nuevos este mes" value="3" />
        <Stat label="Pendientes validar" value="1" sub="CBU sin verificar" />
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <Card className="h-fit">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Categorias</div>
          <div className="space-y-1">
            {categorias.map((c) => (
              <button
                key={c.n}
                className={`w-full flex justify-between px-3 py-2 rounded-md text-sm ${
                  c.active ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] font-semibold" : "hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2"><Tag size={12} /> {c.n}</span>
                <span className="text-xs text-muted-foreground">{c.c}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-2 items-center">
            <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, alias o CBU..." className="pl-9" />
            </div>
            <select className="h-10 px-3 rounded-md border bg-card text-sm">
              <option>Ordenar: mas usados</option>
              <option>Alfabetico</option>
              <option>Recientes</option>
            </select>
          </div>

          <div className="hidden md:grid grid-cols-[auto_1.2fr_1fr_1.4fr_0.8fr_0.8fr_auto] gap-4 px-5 py-3 border-b text-xs uppercase tracking-wide text-muted-foreground">
            <div></div><div>Nombre</div><div>Alias</div><div>CBU</div><div>Categoria</div><div>Ops</div><div></div>
          </div>
          {data.map((d) => (
            <div key={d.n} className="md:grid md:grid-cols-[auto_1.2fr_1fr_1.4fr_0.8fr_0.8fr_auto] gap-4 px-5 py-4 border-b last:border-0 items-center">
              <Star size={14} className={d.fav ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
              <div>
                <div className="font-semibold">{d.n}</div>
                <div className="text-xs text-muted-foreground md:hidden">@{d.a} · {d.b}</div>
              </div>
              <div className="text-sm text-muted-foreground hidden md:block">@{d.a}</div>
              <div className="text-sm font-mono text-muted-foreground hidden md:block">{d.cbu}</div>
              <div className="hidden md:block"><Badge tone="neutral">{d.cat}</Badge></div>
              <div className="text-sm text-muted-foreground hidden md:block">{d.ops} · {d.ult}</div>
              <div className="flex gap-1 mt-2 md:mt-0 justify-end">
                <BtnOutline className="h-9 px-3" onClick={() => { setTransferir(d); setMonto(""); }}>
                  <Send size={14} /> Transferir
                </BtnOutline>
                <button className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent"><MoreVertical size={14} /></button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <FormDialog
        open={nuevoOpen}
        onClose={() => setNuevoOpen(false)}
        title="Nuevo destinatario"
        description="Agregalo a tu agenda para reutilizarlo en transferencias."
        submitLabel="Agregar destinatario"
        onSubmit={() => {
          setNuevoOpen(false);
          toast.success("Destinatario agregado a tu agenda");
        }}
      >
        <div>
          <Label>Nombre o razon social</Label>
          <Input placeholder="Ej. Proveedor SA" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Alias</Label>
            <Input placeholder="proveedor.sa" />
          </div>
          <div>
            <Label>Categoria</Label>
            <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Proveedor</option>
              <option>Empleado</option>
              <option>Servicios</option>
              <option>Otro</option>
            </select>
          </div>
        </div>
        <div>
          <Label>CBU / CVU</Label>
          <Input placeholder="22 digitos" />
        </div>
        <div>
          <Label>CUIT/CUIL (opcional)</Label>
          <Input placeholder="XX-XXXXXXXX-X" />
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" /> Marcar como favorito
        </label>
      </FormDialog>

      <FormDialog
        open={!!transferir}
        onClose={() => setTransferir(null)}
        title={`Transferir a ${transferir?.n ?? ""}`}
        description="Confirma el monto y la subcuenta de origen para enviar la transferencia."
        submitLabel="Enviar transferencia"
        onSubmit={() => {
          const m = monto || "0";
          toast.success(`Transferencia de $ ${m} enviada a ${transferir?.n}`);
          setTransferir(null);
        }}
      >
        {transferir && (
          <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
            <div className="font-semibold text-sm text-foreground">{transferir.n}</div>
            <div className="text-muted-foreground">@{transferir.a} · {transferir.b}</div>
            <div className="font-mono text-muted-foreground">{transferir.cbu}</div>
          </div>
        )}
        <div>
          <Label>Subcuenta de origen</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Operaciones — $ 6.389.830,55</option>
            <option>Sucursal Centro — $ 4.220.000,00</option>
            <option>Sucursal Norte — $ 1.870.500,00</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Monto (ARS)</Label>
            <Input value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0,00" />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input type="date" defaultValue={new Date().toISOString().slice(0,10)} />
          </div>
        </div>
        <div>
          <Label>Concepto</Label>
          <Input placeholder="Pago factura, sueldo, etc." />
        </div>
        <div>
          <Label>Referencia (opcional)</Label>
          <Input placeholder="N° de factura o nota interna" />
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" defaultChecked /> Notificarme cuando se acredite
        </label>
      </FormDialog>
    </>
  );
}
