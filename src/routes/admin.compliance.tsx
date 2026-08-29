import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldAlert, ShieldCheck, Ban, History, AlertCircle, CheckCircle2,
  Search, Eye, Unlock, Save, Plus, Trash2, ListChecks,
} from "lucide-react";
import {
  PageHeader, Card, Input, Label, BtnPrimary, BtnOutline, Badge, Stat,
} from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";

export const Route = createFileRoute("/admin/compliance")({ component: Page });

type AlertaEstado = "Pendiente" | "Revisada" | "Bloqueada";

const alertas: Array<{
  d: string; cli: string; m: string; tipo: string; f: string; e: AlertaEstado;
}> = [
  { d: "Movimiento mayor a $ 5.000.000", cli: "Pagos Express SRL", m: "$ 6.200.000", tipo: "Umbral monto", f: "Hoy 09:32", e: "Pendiente" },
  { d: "48 operaciones en 1 hora", cli: "Microcreditos del Sur", m: "—", tipo: "Frecuencia", f: "Hoy 08:11", e: "Revisada" },
  { d: "CUIT en lista de control", cli: "Comercializadora ABC", m: "—", tipo: "Lista control", f: "Ayer 17:42", e: "Bloqueada" },
  { d: "Acumulado diario sobre umbral", cli: "Microcreditos del Sur", m: "$ 24,8M", tipo: "Umbral acumulado", f: "Ayer 16:08", e: "Pendiente" },
  { d: "Destinatario menor de edad", cli: "Cooperativa Norte", m: "$ 180.000", tipo: "Edad destinatario", f: "31/05 14:20", e: "Revisada" },
  { d: "Operacion en horario inusual", cli: "Administradora Plaza", m: "$ 980.000", tipo: "Horario", f: "31/05 02:14", e: "Revisada" },
];

const bloqueos = [
  { cli: "Pagos Express SRL", cuit: "30-71300011-4", motivo: "Operatoria atipica · pendiente declaracion jurada", f: "15/03/2026", por: "L. Diaz" },
  { cli: "Comercializadora ABC", cuit: "30-70988877-5", motivo: "CUIT en lista de control oficial", f: "10/04/2026", por: "M. Solis" },
];

type EstadoLista = "Validado" | "Observado" | "Bloqueado";
const listas: Array<{ cli: string; cuit: string; pep: EstadoLista; sdn: EstadoLista; ult: string }> = [
  { cli: "Microcreditos del Sur SA", cuit: "30-71239988-0", pep: "Validado", sdn: "Validado", ult: "01/06/2026" },
  { cli: "Pagos Express SRL", cuit: "30-71300011-4", pep: "Observado", sdn: "Validado", ult: "15/03/2026" },
  { cli: "Comercializadora ABC", cuit: "30-70988877-5", pep: "Bloqueado", sdn: "Bloqueado", ult: "10/04/2026" },
  { cli: "Administradora Plaza SRL", cuit: "30-71244455-1", pep: "Validado", sdn: "Validado", ult: "28/05/2026" },
  { cli: "Cooperativa Norte", cuit: "30-71411223-7", pep: "Validado", sdn: "Observado", ult: "20/05/2026" },
];
const tonoLista = (e: EstadoLista): "success" | "warn" | "danger" =>
  e === "Validado" ? "success" : e === "Observado" ? "warn" : "danger";

const tonoAlerta = (e: AlertaEstado): "warn" | "success" | "danger" =>
  e === "Pendiente" ? "warn" : e === "Revisada" ? "success" : "danger";

function Page() {
  const [bloqueoOpen, setBloqueoOpen] = useState<typeof bloqueos[number] | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [verAlerta, setVerAlerta] = useState<typeof alertas[number] | null>(null);
  const [revisarAlerta, setRevisarAlerta] = useState<typeof alertas[number] | null>(null);
  const [bloquearAlerta, setBloquearAlerta] = useState<typeof alertas[number] | null>(null);
  const [histLista, setHistLista] = useState<typeof listas[number] | null>(null);
  const [motivoLev, setMotivoLev] = useState("");
  const [motivoRev, setMotivoRev] = useState("");

  return (
    <>
      <PageHeader
        title="Compliance y alertas"
        description="Reglas parametricas, alertas activas y bloqueos operativos."
        action={<BtnOutline onClick={() => setAuditOpen(true)}><History size={14} /> Auditoria completa</BtnOutline>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat label="Alertas pendientes" value="3" sub="2 criticas" />
        <Stat label="Alertas ultimos 7d" value="42" sub="+18 % vs semana anterior" />
        <Stat label="Clientes bloqueados" value="6" />
        <Stat label="Reglas activas" value="14" sub="3 personalizadas" />
      </div>

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6 mb-6">
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><ShieldCheck size={16} /> Parametros del motor</h3>
          <form className="space-y-3">
            <div>
              <Label>Monto maximo por operacion (ARS)</Label>
              <Input defaultValue="5.000.000" />
            </div>
            <div>
              <Label>Cantidad maxima de operaciones por hora</Label>
              <Input defaultValue="40" />
            </div>
            <div>
              <Label>Monto acumulado diario por cliente (ARS)</Label>
              <Input defaultValue="20.000.000" />
            </div>
            <div>
              <Label>Edad minima del destinatario</Label>
              <Input defaultValue="18" />
            </div>
            <div>
              <Label>Horario operativo permitido</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input defaultValue="06:00" />
                <Input defaultValue="23:00" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs pt-2">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Bloquear automaticamente al disparar</label>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Notificar a compliance por email</label>
            </div>
            <BtnPrimary className="w-full"><Save size={14} /> Guardar parametros</BtnPrimary>
          </form>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2"><ShieldAlert size={16} className="text-[color:var(--brand-red)]" /> Alertas disparadas</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar..." className="h-9 pl-8 max-w-[200px]" />
              </div>
              <select className="h-9 px-2 rounded-md border bg-card text-xs">
                <option>Todas</option><option>Pendientes</option>
                <option>Revisadas</option><option>Bloqueadas</option>
              </select>
            </div>
          </div>
          <div className="divide-y">
            {alertas.map((a, i) => (
              <div key={i} className="p-5 hover:bg-muted/30">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        a.e === "Bloqueada" ? "bg-red-50 text-red-600"
                        : a.e === "Pendiente" ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                      }`}>
                        <ShieldAlert size={14} />
                      </div>
                      <div className="font-semibold text-sm">{a.d}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                      <span><strong className="text-foreground">Cliente:</strong> {a.cli}</span>
                      <span><strong className="text-foreground">Tipo:</strong> {a.tipo}</span>
                      {a.m !== "—" && <span><strong className="text-foreground">Monto:</strong> {a.m}</span>}
                      <span>{a.f}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge tone={tonoAlerta(a.e)}>{a.e}</Badge>
                    {a.e === "Pendiente" && (
                      <div className="flex gap-1">
                        <BtnOutline className="h-8 px-2 text-xs" onClick={() => setVerAlerta(a)}><Eye size={12} /> Ver</BtnOutline>
                        <BtnOutline className="h-8 px-2 text-xs" onClick={() => { setRevisarAlerta(a); setMotivoRev(""); }}>
                          <CheckCircle2 size={12} /> Revisar
                        </BtnOutline>
                        <BtnOutline className="h-8 px-2 text-xs text-red-600 border-red-200" onClick={() => setBloquearAlerta(a)}>
                          <Ban size={12} /> Bloquear
                        </BtnOutline>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Ban size={16} className="text-red-600" /> Bloqueos activos</h3>
          <span className="text-xs text-muted-foreground">{bloqueos.length} cuentas bloqueadas</span>
        </div>
        <div className="divide-y">
          {bloqueos.map(b => (
            <div key={b.cuit} className="flex justify-between items-center py-3">
              <div className="min-w-0">
                <div className="font-semibold text-sm">{b.cli}</div>
                <div className="text-xs text-muted-foreground font-mono">{b.cuit}</div>
                <div className="text-xs mt-1">{b.motivo}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Bloqueado el {b.f} por {b.por}</div>
              </div>
              <BtnOutline className="h-9 px-3 text-xs" onClick={() => { setBloqueoOpen(b); setMotivoLev(""); }}>
                <Unlock size={12} /> Levantar bloqueo
              </BtnOutline>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6 p-0 overflow-hidden">
        <div className="px-5 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2"><ListChecks size={16} /> Listas de control PEP / SDN</h3>
          <span className="text-xs text-muted-foreground">ultima corrida: hoy 06:00</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-muted/30">
              <th className="text-left px-5 py-2.5">Cliente</th>
              <th className="text-left px-5 py-2.5">CUIT</th>
              <th className="text-left px-5 py-2.5">PEP</th>
              <th className="text-left px-5 py-2.5">SDN</th>
              <th className="text-left px-5 py-2.5">ultima validacion</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {listas.map((l) => (
              <tr key={l.cuit} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 font-semibold">{l.cli}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{l.cuit}</td>
                <td className="px-5 py-3"><Badge tone={tonoLista(l.pep)}>{l.pep}</Badge></td>
                <td className="px-5 py-3"><Badge tone={tonoLista(l.sdn)}>{l.sdn}</Badge></td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{l.ult}</td>
                <td className="px-5 py-3 text-right">
                  <BtnOutline className="h-8 px-3 text-xs" onClick={() => setHistLista(l)}>Ver historial</BtnOutline>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2"><History size={16} /> Historial de alertas y bloqueos por cliente</h3>
        <div className="space-y-3 text-sm">
          {[
            { f: "02/06 09:32", t: "Alerta disparada", cli: "Pagos Express SRL", det: "Monto > $ 5M · $ 6.200.000" },
            { f: "15/03 14:21", t: "Cuenta bloqueada", cli: "Pagos Express SRL", det: "Operatoria atipica — por L. Diaz" },
            { f: "10/04 11:08", t: "Cuenta bloqueada", cli: "Comercializadora ABC", det: "CUIT en lista control" },
            { f: "12/03 16:48", t: "Bloqueo levantado", cli: "Cooperativa Norte", det: "Documentacion regularizada — por M. Solis" },
          ].map((h, i) => (
            <div key={i} className="flex gap-3 border-l-2 border-primary/30 pl-3">
              <div className="text-xs text-muted-foreground w-20 shrink-0">{h.f}</div>
              <div>
                <div className="font-semibold">{h.t} <span className="text-muted-foreground font-normal">· {h.cli}</span></div>
                <div className="text-xs text-muted-foreground">{h.det}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {bloqueoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setBloqueoOpen(null)} />
          <div className="relative bg-card rounded-lg max-w-md w-full p-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Levantar bloqueo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Vas a habilitar nuevamente la operatoria de <strong>{bloqueoOpen.cli}</strong>. Esta accion queda auditada.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <Label>Motivo del levantamiento *</Label>
                <Input value={motivoLev} onChange={(e) => setMotivoLev(e.target.value)} placeholder="Detallar..." />
              </div>
              <div>
                <Label>Adjuntar documentacion de respaldo</Label>
                <BtnOutline className="w-full"><Plus size={14} /> Subir archivo</BtnOutline>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <BtnOutline className="flex-1" onClick={() => setBloqueoOpen(null)}>Cancelar</BtnOutline>
              <BtnPrimary
                className="flex-1"
                onClick={() => {
                  if (!motivoLev.trim()) { toast.error("Motivo requerido"); return; }
                  toast.success(`Bloqueo levantado para ${bloqueoOpen.cli}`);
                  setBloqueoOpen(null);
                }}
              >
                <Unlock size={14} /> Levantar bloqueo
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}

      {verAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setVerAlerta(null)} />
          <div className="relative bg-card rounded-lg max-w-lg w-full p-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h3 className="font-semibold">Detalle de alerta</h3>
                <p className="text-xs text-muted-foreground">{verAlerta.tipo} · {verAlerta.f}</p>
              </div>
            </div>
            <Card className="bg-muted/30 space-y-2 text-sm">
              <div><span className="text-muted-foreground text-xs">Descripcion:</span> <strong>{verAlerta.d}</strong></div>
              <div><span className="text-muted-foreground text-xs">Cliente:</span> {verAlerta.cli}</div>
              {verAlerta.m !== "—" && <div><span className="text-muted-foreground text-xs">Monto:</span> {verAlerta.m}</div>}
              <div><span className="text-muted-foreground text-xs">Regla disparada:</span> {verAlerta.tipo}</div>
              <div><span className="text-muted-foreground text-xs">Estado:</span> <Badge tone={tonoAlerta(verAlerta.e)}>{verAlerta.e}</Badge></div>
            </Card>
            <div className="text-xs text-muted-foreground border-t pt-3">
              Esta alerta fue generada automaticamente por el motor de compliance. La revision queda auditada con tu usuario.
            </div>
            <div className="flex gap-2">
              <BtnOutline className="flex-1" onClick={() => setVerAlerta(null)}>Cerrar</BtnOutline>
              <BtnPrimary className="flex-1" onClick={() => { setRevisarAlerta(verAlerta); setVerAlerta(null); setMotivoRev(""); }}>
                <CheckCircle2 size={14} /> Pasar a revision
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}

      {revisarAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRevisarAlerta(null)} />
          <div className="relative bg-card rounded-lg max-w-md w-full p-6 space-y-3">
            <h3 className="font-semibold">Marcar alerta como revisada</h3>
            <p className="text-xs text-muted-foreground">{revisarAlerta.d} · {revisarAlerta.cli}</p>
            <div>
              <Label>Resolucion *</Label>
              <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
                <option>Operacion legitima — sin accion</option>
                <option>Operacion legitima — notificar al cliente</option>
                <option>Reportar como sospechosa (ROS)</option>
                <option>Escalar a UIF</option>
              </select>
            </div>
            <div>
              <Label>Comentario interno *</Label>
              <textarea
                value={motivoRev}
                onChange={(e) => setMotivoRev(e.target.value)}
                className="w-full min-h-[80px] p-3 rounded-md border bg-card text-sm"
                placeholder="Justificacion visible solo para compliance..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <BtnOutline className="flex-1" onClick={() => setRevisarAlerta(null)}>Cancelar</BtnOutline>
              <BtnPrimary
                className="flex-1"
                onClick={() => {
                  if (!motivoRev.trim()) { toast.error("Comentario requerido"); return; }
                  toast.success("Alerta marcada como revisada");
                  setRevisarAlerta(null);
                }}
              >
                <CheckCircle2 size={14} /> Confirmar revision
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}

      {bloquearAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setBloquearAlerta(null)} />
          <div className="relative bg-card rounded-lg max-w-md w-full p-6 space-y-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <Ban size={18} />
              </div>
              <div>
                <h3 className="font-semibold">Bloquear cliente</h3>
                <p className="text-xs text-muted-foreground">{bloquearAlerta.cli}</p>
              </div>
            </div>
            <p className="text-sm">Se bloqueara toda la operatoria del cliente hasta que se levante manualmente.</p>
            <div>
              <Label>Motivo del bloqueo *</Label>
              <Input placeholder="Detallar..." />
            </div>
            <div className="flex gap-2 pt-2">
              <BtnOutline className="flex-1" onClick={() => setBloquearAlerta(null)}>Cancelar</BtnOutline>
              <BtnPrimary
                className="flex-1"
                onClick={() => { toast.success(`${bloquearAlerta.cli} bloqueado`); setBloquearAlerta(null); }}
              >
                <Ban size={14} /> Bloquear
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}

      {histLista && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setHistLista(null)} />
          <div className="relative bg-card rounded-lg max-w-xl w-full max-h-[85vh] overflow-hidden shadow-xl flex flex-col">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Historial PEP / SDN</h3>
                <p className="text-xs text-muted-foreground">{histLista.cli} · CUIT {histLista.cuit}</p>
              </div>
              <BtnOutline className="h-9 w-9 px-0" onClick={() => setHistLista(null)}>✕</BtnOutline>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card><div className="text-xs text-muted-foreground">PEP actual</div><Badge tone={tonoLista(histLista.pep)}>{histLista.pep}</Badge></Card>
                <Card><div className="text-xs text-muted-foreground">SDN actual</div><Badge tone={tonoLista(histLista.sdn)}>{histLista.sdn}</Badge></Card>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { f: histLista.ult, t: "Validacion automatica", det: `PEP: ${histLista.pep} · SDN: ${histLista.sdn}`, u: "Sistema" },
                  { f: "15/04/2026", t: "Validacion automatica", det: "PEP: Validado · SDN: Validado", u: "Sistema" },
                  { f: "10/03/2026", t: "Revision manual", det: "Documentacion societaria verificada", u: "M. Solis" },
                  { f: "12/02/2026", t: "Alta del cliente", det: "Validacion inicial PEP/SDN", u: "L. Diaz" },
                ].map((h, i) => (
                  <div key={i} className="flex gap-3 border-l-2 border-primary/30 pl-3">
                    <div className="text-xs text-muted-foreground w-24 shrink-0">{h.f}</div>
                    <div>
                      <div className="font-semibold">{h.t}</div>
                      <div className="text-xs text-muted-foreground">{h.det} · {h.u}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <FormDialog
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        title="Generar auditoria completa"
        description="Reporte exhaustivo de alertas, bloqueos y operaciones revisadas."
        submitLabel="Generar reporte"
        size="lg"
        onSubmit={() => {
          setAuditOpen(false);
          toast.success("Reporte de auditoria en preparacion · te avisaremos por email");
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Desde</Label><Input type="date" /></div>
          <div><Label>Hasta</Label><Input type="date" /></div>
        </div>
        <div>
          <Label>Cliente</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>Todos los clientes</option>
            <option>Pagos Express SRL</option>
            <option>Microcreditos del Sur</option>
            <option>Consorcio Larrea 1200</option>
          </select>
        </div>
        <div>
          <Label>Incluir en el reporte</Label>
          <div className="space-y-1.5 mt-1 text-xs">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Alertas disparadas</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Bloqueos y levantamientos</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Operaciones revisadas manualmente</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Cambios en parametros del motor</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Accesos y acciones de usuarios admin</label>
          </div>
        </div>
        <div>
          <Label>Formato</Label>
          <select className="w-full h-10 px-3 rounded-md border bg-card text-sm">
            <option>PDF firmado</option>
            <option>CSV</option>
            <option>JSON (API)</option>
          </select>
        </div>
      </FormDialog>
    </>
  );
}

// Avoid unused import warnings
void Trash2;