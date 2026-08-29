import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import { Input, BtnPrimary } from "@/components/portal-shell";

type Message = {
  role: "user" | "bot";
  text: string;
};

const faqs = [
  "¿Cómo creo un link de pago?",
  "¿Cómo transfiero dinero?",
  "¿Cómo agrego una subcuenta?",
  "¿Cómo pago un servicio?",
  "¿Qué es el débito directo?",
];

const botResponses: Record<string, string> = {
  "¿Cómo creo un link de pago?":
    "Para crear un link de pago: 1) Andá a la sección 'Link de pago' > 'Productos'. 2) Agregá los productos que querés cobrar. 3) Seleccionálos y hacé clic en 'Generar link'. 4) Configurá los métodos de pago y la fecha de expiración. 5) Confirmá y compartí el link con tu cliente.",
  "¿Cómo transfiero dinero?":
    "Para transferir dinero: 1) Andá a la sección 'Transferir'. 2) Elegí el tipo de transferencia (única, programada). 3) Ingresá el CBU/CVU o seleccioná un destinatario. 4) Indicá el monto y la subcuenta de origen. 5) Revisá los datos y confirmá.",
  "¿Cómo agrego una subcuenta?":
    "Podés agregar una subcuenta desde 'Subcuentas' > 'Nueva subcuenta'. Completá el nombre, tipo (Operativa, Recaudación, etc.), responsable y límite diario. Cada subcuenta tiene su propio CBU.",
  "¿Cómo pago un servicio?":
    "Andá a 'Pago de servicios'. Encontrás tres vistas: Próximos pagos, Servicios suscritos e Historial. Seleccioná el servicio que querés pagar y hacé clic en 'Pagar'. Podés elegir la subcuenta de origen y la fecha de pago.",
  "¿Qué es el débito directo?":
    "El débito directo permite que el cobro de un servicio se realice automáticamente desde tu cuenta en la fecha de vencimiento. Activá la opción 'DD' (Débito Directo) en los servicios compatibles. Solo algunos proveedores lo soportan.",
};

function botReply(text: string): string {
  return (
    botResponses[text] ||
    "No encontré una respuesta específica para tu consulta. ¿Podrías reformularla? También podés contactar a nuestro equipo de soporte en soporte@molipay.com.ar."
  );
}

export function SupportBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "¡Hola! Soy el asistente virtual de Molly. ¿En qué puedo ayudarte?",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: botReply(q) }]);
    }, 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition"
        aria-label="Asistente virtual"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-[color:var(--brand-soft)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[color:var(--brand-dark)] flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">Asistente Molly</div>
                <div className="text-[10px] text-muted-foreground">Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:opacity-70">
              <X size={16} />
            </button>
          </div>

          <div className="px-3 pt-3 flex gap-1.5 overflow-x-auto pb-1 shrink-0">
            {faqs.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border bg-card hover:bg-muted transition whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[280px] max-h-[360px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 p-3 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Escribí tu consulta..."
              className="h-9 text-sm"
            />
            <BtnPrimary className="h-9 w-9 px-0 shrink-0" onClick={() => send(input)}>
              <Send size={14} />
            </BtnPrimary>
          </div>

          <div className="px-3 pb-2 text-[10px] text-muted-foreground">
            También podés escribir a{" "}
            <span className="font-semibold">soporte@molipay.com.ar</span>
          </div>
        </div>
      )}
    </>
  );
}
