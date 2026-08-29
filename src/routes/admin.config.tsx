import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus, UserCog, Settings, Bell, Save, X, Trash2, ShieldCheck,
  Building, Mail, Globe, SlidersHorizontal, History,
} from "lucide-react";
import {
  PageHeader, Card, BtnPrimary, BtnOutline, Input, Label, Badge, Stat,
} from "@/components/portal-shell";

export const Route = createFileRoute("/admin/config")({ component: Page });

type Rol = "Super Admin" | "Operaciones" | "Compliance" | "Comercial" | "Solo lectura";

const users: Array<{
  n: string; e: string; r: Rol; activo: boolean; ult: string;
}> = [
  { n: "Maria Solis", e: "maria@molly.com.ar", r: "Super Admin", activo: true, ult: "Hace 5 min" },
  { n: "Tomas Vega", e: "tomas@molly.com.ar", r: "Operaciones", activo: true, ult: "Hace 2 horas" },
  { n: "Laura Diaz", e: "laura@molly.com.ar", r: "Compliance", activo: true, ult: "Ayer" },
  { n: "Pablo Sosa", e: "pablo@molly.com.ar", r: "Comercial", activo: true, ult: "Hace 3 dias" },
  { n: "Ana Pinto", e: "ana@molly.com.ar", r: "Solo lectura", activo: false, ult: "20/05/2026" },
];

const modulos = [
  "Clientes y onboarding",
  "CBU y subcuentas",
  "Comisiones",
  "Movimientos",
  "Compliance",
  "Consorcios",
  "Alquileres",
  "Configuracion del sistema",
];

function Page() {
  const [nuevoUser, setNuevoUser] = useState(false);
  const [editar, setEditar] = useState<typeof users[number] | null>(null);

  return (
    <>
      <PageHeader
        title="Configuracion del sistema"
        description="Usuarios internos, permisos por modulo y parametros generales."
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Usuarios internos" value="12" sub="4 activos ahora" />
        <Stat label="Roles configurados" value="5" />
        <Stat label="ultima auditoria" value="01/06" sub="Sin observaciones" />
        <Stat label="Version" value="2.4.1" sub="Build 2026.06.01" />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mb-6">
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2"><UserCog size={16} /> Usuarios internos de Molly</h3>
            <BtnPrimary onClick={() => setNuevoUser(true)}><Plus size={14} /> Nuevo usuario</BtnPrimary>
          </div>
          <div className="divide-y">
            {users.map(u => (
              <div key={u.e} className="flex items-center justify-between py-3 px-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: "var(--brand-soft)", color: "var(--brand-dark)" }}>
                    {u.n.split(" ").map(p => p[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{u.n}</div>
                    <div className="text-xs text-muted-foreground">{u.e} · ult. acceso {u.ult}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge tone="neutral">{u.r}</Badge>
                  <Badge tone={u.activo ? "success" : "warn"}>{u.activo ? "Activo" : "Inactivo"}</Badge>
                  <BtnOutline className="h-9 px-3 text-xs" onClick={() => setEditar(u)}>Editar</BtnOutline>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><ShieldCheck size={16} /> Roles disponibles</h3>
          <div className="space-y-3 text-sm">
            {[
              ["Super Admin", "Acceso total, gestion de usuarios", "danger"],
              ["Operaciones", "Onboarding, CBU, movimientos", "success"],
              ["Compliance", "Alertas, bloqueos, parametros", "success"],
              ["Comercial", "Clientes, comisiones, sin operatoria", "success"],
              ["Solo lectura", "Consulta global, sin acciones", "neutral"],
            ].map(([r, d, t]) => (
              <div key={r} className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{r}</div>
                  <Badge tone={t as "success" | "danger" | "neutral"}>{r}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2"><SlidersHorizontal size={16} /> Limites operativos por cliente</h3>
            <BtnOutline className="h-9 px-3 text-xs"><History size={12} /> Ver auditoria de cambios</BtnOutline>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Configura monto maximo por transferencia y cantidad maxima de operaciones diarias por cliente. Cada cambio queda registrado con valor anterior, nuevo y usuario.</p>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
                  <th className="text-left px-5 py-2.5">Cliente</th>
                  <th className="text-left px-5 py-2.5">Monto maximo / transferencia</th>
                  <th className="text-left px-5 py-2.5">Operaciones diarias</th>
                  <th className="text-left px-5 py-2.5">ultimo cambio</th>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: "Microcreditos del Sur SA", m: "5.000.000", o: "200", ult: "01/06 · L. Diaz" },
                  { c: "Consorcio Larrea 1200", m: "8.000.000", o: "500", ult: "28/05 · M. Solis" },
                  { c: "Administradora Plaza SRL", m: "3.000.000", o: "150", ult: "15/05 · T. Vega" },
                  { c: "Municipalidad de Chivilcoy", m: "25.000.000", o: "100", ult: "20/02 · M. Solis" },
                ].map((r) => (
                  <tr key={r.c} className="border-b last:border-0">
                    <td className="px-5 py-3 font-semibold">{r.c}</td>
                    <td className="px-5 py-3"><Input defaultValue={r.m} className="h-9 max-w-[180px] font-mono tabular-nums" /></td>
                    <td className="px-5 py-3"><Input defaultValue={r.o} className="h-9 max-w-[120px] font-mono tabular-nums" /></td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.ult}</td>
                    <td className="px-5 py-3 text-right"><BtnPrimary className="h-9 px-3 text-xs"><Save size={12} /> Guardar</BtnPrimary></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Building size={16} /> Datos de la empresa</h3>
          <form className="space-y-3">
            <div><Label>Razon social</Label><Input defaultValue="Molly Money Life SA" /></div>
            <div><Label>CUIT</Label><Input defaultValue="30-71299988-0" /></div>
            <div><Label>Domicilio comercial</Label><Input defaultValue="Av. Corrientes 800, CABA" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Email de soporte</Label><Input defaultValue="soporte@molly.com.ar" /></div>
              <div><Label>Telefono</Label><Input defaultValue="+54 11 4000 0000" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Sitio publico</Label><Input defaultValue="molly.com.ar" /></div>
              <div><Label>Horario operativo</Label><Input defaultValue="24/7" /></div>
            </div>
            <BtnPrimary><Save size={14} /> Guardar cambios</BtnPrimary>
          </form>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell size={16} /> Notificaciones internas</h3>
          <div className="space-y-3 text-sm">
            {[
              ["Nueva alta de cliente", "Email a operaciones"],
              ["Alerta de compliance critica", "Email + Slack a compliance"],
              ["Lote masivo finalizado", "Email al usuario que lo lanzo"],
              ["Cuenta bloqueada", "Email a super admins"],
              ["Error en webhook saliente", "Email + Slack a operaciones"],
            ].map(([n, c], i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-semibold">{n}</div>
                  <div className="text-xs text-muted-foreground">{c}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5 bg-muted peer-checked:bg-primary rounded-full transition relative">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                  </div>
                </label>
              </div>
            ))}
          </div>
          <Card className="bg-muted/30 mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Canales conectados</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Mail size={13} /> Email SMTP</span><Badge tone="success">Activo</Badge></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Globe size={13} /> Slack #molly-alerts</span><Badge tone="success">Activo</Badge></div>
            </div>
          </Card>
        </Card>
      </div>

      {(nuevoUser || editar) && (
        <UserDrawer
          user={editar}
          onClose={() => { setNuevoUser(false); setEditar(null); }}
        />
      )}
    </>
  );
}

function UserDrawer({ user, onClose }: { user: typeof users[number] | null; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="font-semibold text-lg">
            {user ? `Editar — ${user.n}` : "Nuevo usuario interno"}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md"><X size={18} /></button>
        </div>
        <form className="p-6 space-y-4">
          <div><Label>Nombre completo *</Label><Input defaultValue={user?.n} /></div>
          <div><Label>Email corporativo *</Label><Input defaultValue={user?.e} type="email" /></div>
          <div><Label>Rol *</Label>
            <select defaultValue={user?.r} className="w-full h-10 px-3 rounded-md border bg-card text-sm">
              <option>Super Admin</option><option>Operaciones</option>
              <option>Compliance</option><option>Comercial</option>
              <option>Solo lectura</option>
            </select>
          </div>
          <Card className="bg-muted/30">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Permisos por modulo</h4>
            <div className="space-y-2 text-sm">
              {modulos.map(m => (
                <div key={m} className="flex items-center justify-between">
                  <span>{m}</span>
                  <select className="h-8 px-2 rounded border bg-card text-xs">
                    <option>Sin acceso</option>
                    <option>Lectura</option>
                    <option>Lectura y escritura</option>
                  </select>
                </div>
              ))}
            </div>
          </Card>
          <div className="flex items-center gap-2 text-sm pt-2">
            <input id="active" type="checkbox" defaultChecked={user ? user.activo : true} />
            <label htmlFor="active">Usuario activo</label>
          </div>
          <div className="flex gap-2 sticky bottom-0 bg-background pt-3 border-t">
            {user && (
              <BtnOutline className="text-red-600 border-red-200"><Trash2 size={13} /> Eliminar</BtnOutline>
            )}
            <BtnOutline className="flex-1" onClick={onClose}>Cancelar</BtnOutline>
            <BtnPrimary className="flex-1"><Save size={14} /> Guardar</BtnPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}

void Settings;