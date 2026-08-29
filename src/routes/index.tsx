import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Wallet,
  Globe2,
  Building2,
  Smartphone,
  ShieldCheck,
  FileCheck2,
  BarChart3,
  Cog,
  Briefcase,
  Lock,
  HeartHandshake,
  Plane,
  Target,
  Compass,
} from "lucide-react";
import { MollyLogo } from "@/components/molly-logo";
import heroShotSrc from "@/assets/Capturadepantalla.png";
import ogImageSrc from "@/assets/miniaturafinal.png";
import hero17Src from "@/assets/hero-17.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoliPay — Soluciones financieras digitales" },
      { name: "description", content: "MoliPay integra pagos, cobros y remesas para empresas y particulares en América Latina. Plataforma regulada bajo marco normativo BCRA." },
      { property: "og:title", content: "MoliPay — Soluciones financieras digitales" },
      { property: "og:description", content: "Cuenta de pago, Crossborder, CVU Collect y Billetera. Plataforma tecnológica escalable y regulada." },
      { property: "og:image", content: ogImageSrc },
      { property: "og:image:width", content: "1901" },
      { property: "og:image:height", content: "904" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImageSrc },
    ],
  }),
  component: Landing,
});

function Eyebrow({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" | "light" }) {
  const color = tone === "accent" ? "#D3001F" : tone === "light" ? "rgba(255,255,255,0.7)" : "#909090";
  return <div className="font-sans text-[0.72rem] tracking-[0.14em] uppercase font-medium" style={{ color }}>{children}</div>;
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`transition-all duration-300 hover:-translate-y-0.5 bg-white border border-black-100 rounded-md shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Landing() {
  return (
    <div className="bg-white text-black-700">
      <SiteHeader />
      <Hero />
      <LedgerStrip />
      <Servicios />
      <ContamosCon />
      <MisionVision />
      <PorQueElegirnos />
      <RegulatoryStrip />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled ? "bg-white/85 backdrop-blur-[12px] border-b border-black-100" : "bg-transparent";
  const text = scrolled ? "text-black-800" : "text-white/90";
  const outline = scrolled ? "border-black-200 text-black-700 hover:bg-black-50" : "border-white/40 text-white hover:bg-white/10";

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${solid}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-3">
        <MollyLogo size={32} />
        <nav className={`hidden md:flex items-center gap-8 lg:gap-10 font-sans text-[0.975rem] font-medium ${text}`}>
          <a href="#servicios" className="hover:text-red-500 transition-colors">Servicios</a>
          <a href="#nosotros" className="hover:text-red-500 transition-colors">Nosotros</a>
          <a href="#contacto" className="hover:text-red-500 transition-colors">Contacto</a>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/login"
            search={{ register: undefined }}
            className={`hidden md:inline-flex h-10 items-center px-4 rounded-sm text-sm font-medium border transition-colors ${outline}`}
          >
            Iniciá sesión
          </Link>
          <Link
            to="/login"
            search={{ register: "pf" }}
            className={`hidden sm:inline-flex h-10 items-center px-4 rounded-sm text-sm font-medium border transition-colors ${outline}`}
          >
            Registrate
          </Link>
          <Link
            to="/login"
            search={{ register: "pj" }}
            className="inline-flex h-9 sm:h-10 items-center px-3 sm:px-4 rounded-sm text-sm font-medium text-white bg-red-500 hover:bg-red-400 transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Registrá tu empresa</span>
            <span className="sm:hidden">Registrar</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function DashboardMockup() {
  return (
    <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-xl p-1 shadow-2xl hero-dashboard-float">
      <img src={heroShotSrc} alt="Panel de control MoliPay" className="block w-full h-auto rounded-lg" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolation -mt-16 md:-mt-20">
      <div className="hero-kenburns">
        <div
          className="hero-bg-float"
          style={{ backgroundImage: `url(${hero17Src})` }}
          aria-hidden
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-black/55 pointer-events-none" />
      <div aria-hidden className="hero-vignette absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.4))] pointer-events-none" />
      <div aria-hidden className="absolute -top-[15%] right-[5%] w-[500px] h-[500px] rounded-full bg-red-500/10 blur-[60px] pointer-events-none" />
      <div aria-hidden className="absolute -bottom-[10%] -left-[5%] w-[400px] h-[400px] rounded-full bg-navy-500/10 blur-[60px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-[80vh] md:min-h-[90vh] pt-24 md:pt-40 pb-16 sm:pb-20 lg:pb-24">
        <div className="grid lg:grid-cols-2 lg:gap-14 items-center">
          <div>
            <Eyebrow tone="light">MoliPay — Plataforma financiera digital</Eyebrow>
            <h1 className="font-bold text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] mt-6 max-w-[26ch] text-white">
              Soluciones financieras para todos
            </h1>
            <p className="mt-6 max-w-lg text-white/70 text-base leading-relaxed">
              Integramos en una sola plataforma servicios de pagos y cobros para individuos, PyMEs y empresas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#servicios"
                className="inline-flex h-12 items-center gap-2 px-7 rounded-sm text-sm font-medium text-white bg-red-500 hover:bg-red-400 transition-colors"
              >
                Conocé más <ArrowRight size={16} />
              </a>
              <a
                href="#contacto"
                className="inline-flex h-12 items-center px-7 rounded-sm text-sm font-medium text-white border border-white/40 hover:bg-white/10 transition-colors"
              >
                Contactanos
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function LedgerStrip() {
  const items = [
    ["Entidad registrada", "MoliPay S.R.L."],
    ["Cobertura", "América Latina"],
    ["Compliance", "Marco normativo BCRA"],
    ["Plataforma", "100% digital"],
  ];
  return (
    <section className="bg-black-800 border-t border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map(([label, value], i) => (
            <div key={label} className={`py-3 md:py-7 px-2 md:px-6 ${i > 0 ? "border-l border-white/10" : ""}`}>
              <div className="font-sans text-[0.6rem] tracking-[0.14em] uppercase text-red-400">{label}</div>
              <div className="mt-1 md:mt-2 font-sans text-[clamp(0.7rem,2.5vw,0.875rem)] tracking-wider text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Servicios() {
  const items = [
    { icon: Wallet, t: "Cuenta de Pago", d: "CVU para enviar y recibir dinero de cuentas bancarias y billeteras virtuales de manera ágil y segura." },
    { icon: Globe2, t: "Crossborder", d: "Servicios de transferencias internacionales y remesas con cobertura en América Latina." },
    { icon: Building2, t: "CVU Collect", d: "Soluciones de recaudación para desarrolladores inmobiliarios, consorcios e inmobiliarias." },
    { icon: Smartphone, t: "Billetera", d: "QR, tarjetas prepagas físicas y virtuales, pagos NFC y link de pago para comercios." },
  ];
  return (
    <section id="servicios" className="relative overflow-hidden bg-gradient-to-b from-plata-50 to-white border-t border-black-100">
      <div aria-hidden className="absolute top-[20%] -left-[8%] w-[420px] h-[420px] rounded-full bg-red-500/5 blur-[40px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32">
        <Eyebrow tone="accent">Servicios</Eyebrow>
        <h2 className="font-semibold text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] mt-4 text-black-800">
          Nuestros servicios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 md:mt-16">
          {items.map(({ icon: Icon, t, d }) => (
            <GlassCard key={t} className="flex flex-col h-full p-5 sm:p-7">
              <div className="h-px bg-red-500 w-8 mb-6" />
              <Icon size={22} strokeWidth={1.4} className="text-black-800" />
              <h3 className="font-semibold text-[1.375rem] leading-tight mt-4 text-black-800">{t}</h3>
              <p className="mt-3 text-sm text-black-400 leading-relaxed">{d}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContamosCon() {
  const items = [
    { icon: Cog, t: "Plataforma Tecnológica", d: "Sistema escalable y seguro que garantiza el cumplimiento de normas nacionales y compliance." },
    { icon: ShieldCheck, t: "Compliance Integral", d: "Políticas y procedimientos personalizados garantizando el cumplimiento normativo." },
    { icon: FileCheck2, t: "Reporting", d: "Informes y declaraciones obligatorias ante autoridades competentes." },
    { icon: BarChart3, t: "Administración", d: "Seguimiento y control de gestión de toda la actividad." },
    { icon: Briefcase, t: "Management", d: "Acompañamiento estratégico para el crecimiento y desarrollo empresarial." },
  ];
  return (
    <section id="nosotros" className="relative overflow-hidden bg-gradient-to-b from-white to-plata-50 border-t border-black-100">
      <div aria-hidden className="absolute top-[10%] -right-[6%] w-[420px] h-[420px] rounded-full bg-navy-500/5 blur-[40px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <Eyebrow tone="accent">Capacidades</Eyebrow>
        <h2 className="font-semibold text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] mt-4 text-black-800">
          Contamos con
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mt-12 md:mt-16">
          {items.map(({ icon: Icon, t, d }) => (
            <GlassCard key={t} className="h-full flex flex-col p-4 sm:p-5">
              <div className="w-[42px] h-[42px] flex items-center justify-center border border-red-200 rounded-sm bg-red-50/50">
                <Icon size={18} strokeWidth={1.5} className="text-black-800" />
              </div>
              <h3 className="mt-4 font-semibold text-base text-black-800 leading-tight">{t}</h3>
              <p className="mt-2 text-xs text-black-400 leading-relaxed">{d}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function MisionVision() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div aria-hidden className="absolute -top-[10%] left-[40%] w-[600px] h-[600px] rounded-full bg-red-500/5 blur-[40px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-8">
          <article className="p-8 sm:p-10 bg-white/5 backdrop-blur border border-white/10 rounded-md">
            <div className="flex items-center gap-3">
              <Target size={22} strokeWidth={1.4} className="text-red-400" />
              <span className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-red-400">01 — Misión</span>
            </div>
            <h3 className="font-semibold text-[clamp(1.75rem,2.4vw,2.15rem)] leading-tight mt-5 text-white">
              Facilitar la gestión digital de cobros y pagos.
            </h3>
            <p className="mt-6 text-white/70 text-base leading-relaxed">
              Proporcionar soluciones financieras seguras, transparentes y simples que faciliten la
              gestión de cobros y pagos para todos nuestros usuarios en un entorno digital en
              constante evolución.
            </p>
          </article>
          <article className="p-8 sm:p-10 bg-black-800 border border-red-400/30 rounded-md">
            <div className="flex items-center gap-3">
              <Compass size={22} strokeWidth={1.4} className="text-red-400" />
              <span className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-red-400">02 — Visión</span>
            </div>
            <h3 className="font-semibold text-[clamp(1.75rem,2.4vw,2.15rem)] leading-tight mt-5 text-white">
              Ser un referente Fintech en la región.
            </h3>
            <p className="mt-6 text-white/70 text-base leading-relaxed">
              Posicionarnos como un referente en el sector Fintech, acompañando la evolución de
              cobros y pagos digitales con soluciones ágiles y simples.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function PorQueElegirnos() {
  const items = [
    { icon: Lock, t: "Tecnología Segura", d: "Plataforma diseñada para ser dinámica, escalable y segura, cumpliendo con todas las normativas vigentes." },
    { icon: HeartHandshake, t: "Atención Personalizada", d: "Acompañamos a nuestros clientes con una atención cercana, atendiendo todas sus necesidades." },
    { icon: Plane, t: "Alcance Internacional", d: "Operaciones en múltiples países de América Latina con alianzas estratégicas sólidas." },
  ];
  return (
    <section className="relative bg-white border-t border-black-100">
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <Eyebrow tone="accent">Diferenciales</Eyebrow>
            <h2 className="font-semibold text-[clamp(2rem,3.5vw,3rem)] leading-[1.1] mt-4 text-black-800">
              ¿Por qué elegirnos?
            </h2>
          </div>
          <p className="md:max-w-sm text-sm text-black-400 leading-relaxed">
            Tres pilares que definen la forma en la que trabajamos y nos diferencian del resto del sector.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, t, d }) => (
            <article
              key={t}
              className="group transition-all duration-300 hover:-translate-y-0.5 p-8 sm:p-9 bg-white rounded-md border border-black-100 border-t-2 border-t-red-500"
            >
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-red-50 border border-red-200">
                <Icon size={22} strokeWidth={1.5} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-[1.375rem] mt-6 text-black-800 leading-tight">{t}</h3>
              <div className="h-px bg-red-500 w-8 my-3" />
              <p className="text-sm text-black-400 leading-relaxed">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegulatoryStrip() {
  return (
    <section className="bg-black-800 border-t border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="border border-red-400 px-3 py-1.5 font-sans text-[0.7rem] tracking-[0.14em] uppercase text-white">
            BCRA
          </div>
          <div>
            <div className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-red-400">Usuarios financieros</div>
            <div className="mt-1 font-sans text-sm text-white/80">Banco Central de la República Argentina — protección al usuario financiero.</div>
          </div>
        </div>
        <a href="https://www.usuariosfinancieros.gob.ar" target="_blank" rel="noreferrer" className="font-sans text-sm text-white border-b border-red-400 pb-0.5 hover:text-red-400 transition-colors">
          usuariosfinancieros.gob.ar →
        </a>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer id="contacto" className="bg-black text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="bg-white inline-block p-3 rounded-sm">
            <MollyLogo size={32} />
          </div>
          <p className="mt-6 text-sm text-white/50 leading-relaxed max-w-[260px]">
            © 2026 MOLIPAY. Todos los derechos reservados.
          </p>
          <p className="mt-4 font-sans text-[0.65rem] tracking-[0.14em] uppercase text-red-400">
            PSPCP · Marco BCRA
          </p>
        </div>
        <div>
          <div className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-red-400">Enlaces útiles</div>
          <ul className="mt-5 space-y-3 font-sans text-sm text-white/70">
            <li><Link to="/legales/privacidad" className="hover:text-white transition-colors">Políticas de privacidad</Link></li>
            <li><Link to="/legales/terminos" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
            <li><Link to="/legales/comisiones" className="hover:text-white transition-colors">Comisiones</Link></li>
            <li><Link to="/legales/arrepentimiento" className="hover:text-white transition-colors">Botón de arrepentimiento</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-red-400">Contactanos</div>
          <ul className="mt-5 space-y-3 font-sans text-sm text-white/70">
            <li><a href="mailto:contacto@molipay.com.ar" className="hover:text-white transition-colors">contacto@molipay.com.ar</a></li>
            <li><a href="mailto:admin@molipay.com.ar" className="hover:text-white transition-colors">admin@molipay.com.ar</a></li>
            <li><a href="mailto:reclamos@molipay.com.ar" className="hover:text-white transition-colors">reclamos@molipay.com.ar</a></li>
          </ul>
        </div>
        <div>
          <div className="font-sans text-[0.65rem] tracking-[0.14em] uppercase text-red-400">Ente fiscalizador</div>
          <div className="mt-5 border border-white/10 p-4 bg-black-800">
            <div className="font-sans text-[0.6rem] tracking-[0.14em] uppercase text-red-400">BCRA</div>
            <div className="mt-1.5 font-sans text-sm text-white/80 leading-relaxed">Banco Central de la República Argentina</div>
            <a href="https://www.bcra.gob.ar" target="_blank" rel="noreferrer" className="mt-2 inline-block font-sans text-[0.6rem] tracking-[0.14em] uppercase text-white hover:text-red-400 transition-colors">
              bcra.gob.ar →
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between font-sans text-[0.7rem] text-white/40">
          <div>MOLIPAY — CUIT 30-71000000-0</div>
          <div>Los fondos depositados no constituyen depósitos en una entidad financiera ni cuentan con la garantía de la Ley 24.485.</div>
        </div>
      </div>
    </footer>
  );
}
