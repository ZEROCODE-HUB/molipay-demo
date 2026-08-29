import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Smartphone, Key, Monitor, AlertTriangle, CheckCircle2, Plus, Trash2, Mail, QrCode } from "lucide-react";
import { PageHeader, Card, Input, Label, BtnPrimary, BtnOutline, Badge } from "@/components/portal-shell";
import { toast } from "sonner";

export const Route = createFileRoute("/app/seguridad")({ component: Page });


const sessions = [
  { d: "Chrome · MacBook Pro", l: "Buenos Aires, AR", ip: "190.12.44.21", f: "Activa ahora", curr: true },
  { d: "Safari · iPhone 14", l: "Buenos Aires, AR", ip: "190.12.44.21", f: "Hace 2 horas", curr: false },
  { d: "Firefox · Windows", l: "Cordoba, AR", ip: "200.40.18.92", f: "Hace 3 dias", curr: false },
];

const log = [
  { d: "Inicio de sesion exitoso", ip: "190.12.44.21", f: "Hoy 09:12", ok: true },
  { d: "Cambio de contrasena", ip: "190.12.44.21", f: "12/05/2026", ok: true },
  { d: "Intento fallido de login", ip: "45.220.88.10", f: "08/05/2026", ok: false },
  { d: "Nuevo dispositivo autorizado", ip: "190.12.44.21", f: "01/05/2026", ok: true },
  { d: "API Key rotada", ip: "190.12.44.21", f: "28/04/2026", ok: true },
];

const team = [
  { n: "Carla Rivas", e: "carla@empresademo.com", r: "Owner", a: "Activa" },
  { n: "Diego Mendez", e: "diego@empresademo.com", r: "Operador", a: "Activa" },
  { n: "Sofia Lopez", e: "sofia@empresademo.com", r: "Solo lectura", a: "Pendiente" },
];

function Page() {
  const [twoFa, setTwoFa] = useState<"email" | "totp">("email");
  const [sesionTiempo, setSesionTiempo] = useState("Nunca");
  const [customTiempo, setCustomTiempo] = useState("");

  return (
    <>
      <PageHeader
        title="Seguridad"
        description="Contrasena, 2FA, sesiones activas, equipo y auditoria."
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Key size={16} /> Cambiar contrasena</h3>
          <form className="space-y-3">
            <div><Label>Contrasena actual</Label><Input type="password" /></div>
            <div><Label>Nueva contrasena</Label><Input type="password" /></div>
            <div><Label>Repetir contrasena</Label><Input type="password" /></div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-600" /> Minimo 12 caracteres</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-600" /> Mayusculas, numeros y simbolos</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-muted-foreground" /> Distinta a las ultimas 5 usadas</div>
            </div>
            <BtnPrimary>Actualizar contrasena</BtnPrimary>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-2 gap-2">
              <h3 className="font-semibold flex items-center gap-2 min-w-0">
                <Smartphone size={16} className="shrink-0" /> <span className="truncate">Doble factor (2FA)</span>
              </h3>
              <Badge tone="success">Activo</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Elegi el metodo de verificacion en dos pasos que preferis usar al iniciar sesion desde un dispositivo nuevo.
            </p>

            <div className="grid sm:grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={() => setTwoFa("email")}
                className={`text-left border rounded-lg p-3 transition ${
                  twoFa === "email"
                    ? "border-primary bg-[color:var(--brand-soft)]"
                    : "hover:border-primary/50 bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary shrink-0" />
                  <span className="font-semibold text-sm">Codigo por email</span>
                  {twoFa === "email" && <Badge tone="success">Activo</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enviamos un codigo de 8 digitos a tu correo corporativo.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTwoFa("totp")}
                className={`text-left border rounded-lg p-3 transition ${
                  twoFa === "totp"
                    ? "border-primary bg-[color:var(--brand-soft)]"
                    : "hover:border-primary/50 bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <QrCode size={16} className="text-primary shrink-0" />
                  <span className="font-semibold text-sm">Google Authenticator</span>
                  {twoFa === "totp" && <Badge tone="success">Activo</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Codigo TOTP de 6 digitos generado en tu app (Google / 1Password / Authy).
                </p>
              </button>
            </div>

            {twoFa === "totp" && (
              <div className="mt-4 border rounded-lg p-4 bg-muted/40">
                <div className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] gap-4 items-start">
                  <div className="w-32 h-32 rounded-md bg-white border grid place-items-center shrink-0">
                    <QrCode size={96} strokeWidth={1} className="text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Escanea el QR con Google Authenticator</div>
                    <div className="text-[11px] text-muted-foreground mt-1">O ingresa manualmente la clave:</div>
                    <div className="font-mono text-xs mt-1 p-2 bg-card border rounded break-all">
                      JBSWY3DPEHPK3PXP-MOLLY-EMPRESA-DEMO
                    </div>
                    <div className="mt-3">
                      <Label>Codigo de verificacion</Label>
                      <Input placeholder="123 456" inputMode="numeric" maxLength={6} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <BtnPrimary
                className="flex-1"
                onClick={() =>
                  toast.success(
                    twoFa === "totp"
                      ? "Google Authenticator configurado como metodo 2FA"
                      : "Codigo por email configurado como metodo 2FA",
                  )
                }
              >
                Guardar metodo 2FA
              </BtnPrimary>
              <BtnOutline>Codigos de respaldo</BtnOutline>
            </div>
          </Card>



        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 mb-6">
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Monitor size={16} /> Sesiones activas</h3>
          <div className="mb-5 pb-5 border-b">
            <div className="text-xs text-muted-foreground mb-2">
              Tiempo de sesion activa: la sesion se cerrara automaticamente despues del periodo de inactividad.
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Nunca", "30 minutos", "1 hora", "6 horas", "1 dia"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setSesionTiempo(opt === "Nunca" ? "" : opt); setCustomTiempo(""); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition ${
                    sesionTiempo === opt
                      ? "border-primary bg-[color:var(--brand-soft)] text-primary"
                      : "border-border hover:border-primary/50 bg-card text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSesionTiempo("custom")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition flex items-center gap-1 ${
                  sesionTiempo === "custom"
                    ? "border-primary bg-[color:var(--brand-soft)] text-primary"
                    : "border-border hover:border-primary/50 bg-card text-muted-foreground"
                }`}
              >
                Custom
              </button>
            </div>
            {sesionTiempo === "custom" && (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={customTiempo}
                  onChange={(e) => setCustomTiempo(e.target.value)}
                  placeholder="Minutos"
                  className="h-9 w-28 text-sm"
                  type="number"
                  min={1}
                />
                <span className="text-xs text-muted-foreground">minutos</span>
                <BtnOutline
                  className="h-9 px-3 text-xs"
                  onClick={() => {
                    if (!customTiempo || Number(customTiempo) < 1) { toast.error("Ingresa un tiempo valido"); return; }
                    toast.success(`Tiempo de sesion: ${customTiempo} minutos`);
                  }}
                >
                  Aplicar
                </BtnOutline>
              </div>
            )}
            {sesionTiempo && sesionTiempo !== "custom" && sesionTiempo !== "" && (
              <p className="text-[11px] text-emerald-700 mt-1.5">
                Tiempo de sesion configurado: {sesionTiempo}
              </p>
            )}
            {sesionTiempo === "" && (
              <p className="text-[11px] text-muted-foreground mt-1.5">
                La sesion no expirara por inactividad.
              </p>
            )}
          </div>
          <div className="divide-y">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    {s.d} {s.curr && <Badge tone="success">Actual</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.l} · {s.ip} · {s.f}</div>
                </div>
                {!s.curr && (
                  <button className="text-xs text-red-600 font-semibold flex items-center gap-1"><Trash2 size={12} /> Cerrar</button>
                )}
              </div>
            ))}
          </div>
          <BtnOutline className="w-full mt-3">Cerrar todas las sesiones</BtnOutline>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Usuarios del equipo</h3>
            <BtnOutline className="h-9 px-3 text-xs"><Plus size={12} /> Invitar</BtnOutline>
          </div>
          <div className="divide-y">
            {team.map((u) => (
              <div key={u.e} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-semibold">{u.n}</div>
                  <div className="text-xs text-muted-foreground">{u.e}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">{u.r}</Badge>
                  <Badge tone={u.a === "Activa" ? "success" : "warn"}>{u.a}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Registro de actividad</h3>
        <div className="divide-y">
          {log.map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                {l.ok ? <CheckCircle2 size={14} className="text-emerald-600" /> : <AlertTriangle size={14} className="text-red-600" />}
                <div className="text-sm">{l.d}</div>
              </div>
              <div className="text-xs text-muted-foreground">{l.ip} · {l.f}</div>
            </div>
          ))}
        </div>
        <BtnOutline className="mt-4">Ver historial completo</BtnOutline>
      </Card>
    </>
  );
}
