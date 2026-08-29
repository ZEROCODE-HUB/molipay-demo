import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, LogOut, MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { MollyLogo } from "./molly-logo";
import { useDemoMode } from "@/contexts/demo-mode";

export type NavLeaf = { to: string; label: string; icon: LucideIcon };
export type NavGroup = { label: string; icon: LucideIcon; items: NavLeaf[] };
export type NavItem = NavLeaf | NavGroup;

const isGroup = (item: NavItem): item is NavGroup =>
  (item as NavGroup).items !== undefined;

const flattenLeaves = (nav: NavItem[]): NavLeaf[] =>
  nav.flatMap((i) => (isGroup(i) ? i.items : [i]));

export function PortalShell({
  nav,
  title,
  children,
}: {
  nav: NavItem[];
  title: string;
  children: ReactNode;
}) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { setRole } = useDemoMode();
  const navigate = useNavigate();

  const leaves = useMemo(() => flattenLeaves(nav), [nav]);
  const mainNav = leaves.slice(0, 4);
  const more = leaves.slice(4);

  const onLogout = () => {
    setRole(null);
    navigate({ to: "/login", search: { register: undefined } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-plata-50">
      <header className="h-14 border-b border-black-100 bg-white flex items-center justify-between px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 text-black-600 hover:text-black-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <MollyLogo size={28} />
          <span className="hidden md:inline text-sm text-black-400 border-l border-black-100 pl-3 ml-1">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs text-black-400">Sesión demo</span>
            <span className="text-sm font-semibold text-black-700">Empresa Demo SA</span>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold bg-red-50 text-red-500">
            ED
          </div>
          <button
            onClick={onLogout}
            className="hidden md:inline-flex items-center gap-1 text-xs text-black-400 hover:text-black-700 transition-colors"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className={`hidden lg:flex flex-col border-r border-navy-600 bg-[#1c2e4a] shrink-0 transition-[width] duration-200 ${
            collapsed ? "w-16 min-w-16" : "w-60"
          }`}
        >
          <div
            className={`flex items-center shrink-0 border-b border-navy-600 ${
              collapsed ? "justify-center py-2" : "justify-between px-3 h-11"
            }`}
          >
            {!collapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60 truncate">
                Navegación
              </span>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="p-2 rounded-sm text-white/60 hover:text-white hover:bg-navy-600 transition-colors"
              title={collapsed ? "Expandir menú" : "Minimizar menú"}
              aria-label={collapsed ? "Expandir menú" : "Minimizar menú"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          <nav className="p-3 flex-1 overflow-y-auto">
            <SidebarNav nav={nav} path={path} collapsed={collapsed} />
          </nav>
        </aside>

        {open && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#1c2e4a] border-r border-navy-600 flex flex-col">
              <div className="p-4 border-b border-navy-600">
                <MollyLogo size={28} />
              </div>
              <nav className="p-3 flex-1 overflow-y-auto">
                <SidebarNav nav={nav} path={path} onNavigate={() => setOpen(false)} />
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-6">
          <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:px-10 lg:py-8">{children}</div>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-white border-t border-black-100 flex items-stretch z-30">
        {mainNav.map((item) => {
          const active = path === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] ${
                active ? "text-moli-orange font-semibold" : "text-black-400"
              }`}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span className="truncate px-1">{item.label}</span>
            </Link>
          );
        })}
        {more.length > 0 && (
          <button
            onClick={() => setOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] text-black-400"
          >
            <MoreHorizontal size={20} strokeWidth={1.75} />
            <span>Más</span>
          </button>
        )}
      </nav>
    </div>
  );
}

function SidebarNav({
  nav,
  path,
  collapsed,
  onNavigate,
}: {
  nav: NavItem[];
  path: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  if (collapsed) {
    return (
      <>
        {nav.map((item) =>
          isGroup(item) ? (
            item.items.map((leaf) => (
              <SidebarLink
                key={leaf.to}
                item={leaf}
                active={path === leaf.to}
                onNavigate={onNavigate}
                collapsed
              />
            ))
          ) : (
            <SidebarLink
              key={item.to}
              item={item}
              active={path === item.to}
              onNavigate={onNavigate}
              collapsed
            />
          )
        )}
      </>
    );
  }

  return (
    <>
      {nav.map((item, idx) =>
        isGroup(item) ? (
          <SidebarGroup key={`g-${idx}-${item.label}`} group={item} path={path} onNavigate={onNavigate} />
        ) : (
          <SidebarLink key={item.to} item={item} active={path === item.to} onNavigate={onNavigate} />
        )
      )}
    </>
  );
}

function SidebarLink({
  item,
  active,
  onNavigate,
  nested = false,
  collapsed = false,
}: {
  item: NavLeaf;
  active: boolean;
  onNavigate?: () => void;
  nested?: boolean;
  collapsed?: boolean;
}) {
  const Icon = item.icon;

  if (collapsed) {
    return (
      <Link
        to={item.to}
        onClick={onNavigate}
        title={item.label}
        aria-label={item.label}
        className={`flex items-center justify-center w-11 h-11 mx-auto mb-1 rounded-lg transition-colors ${
          active
            ? "bg-moli-orange text-white font-semibold"
            : "text-white/80 hover:text-white hover:bg-navy-600"
        }`}
      >
        <Icon size={20} strokeWidth={1.75} />
      </Link>
    );
  }

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm mb-0.5 transition-colors ${
        nested ? "pl-9" : ""
      } ${
        nested
          ? active
            ? "bg-moli-orange-dark text-white font-semibold"
            : "text-white/60 hover:text-white hover:bg-navy-600/50"
          : active
            ? "bg-moli-orange text-white font-semibold"
            : "text-white/80 hover:text-white hover:bg-navy-600"
      }`}
    >
      {!nested && <Icon size={18} strokeWidth={1.75} />}
      {nested && <Icon size={15} strokeWidth={1.75} className="opacity-70" />}
      {item.label}
    </Link>
  );
}

function SidebarGroup({
  group,
  path,
  onNavigate,
}: {
  group: NavGroup;
  path: string;
  onNavigate?: () => void;
}) {
  const containsActive = group.items.some((i) => i.to === path);
  const [open, setOpen] = useState(containsActive);
  const Icon = group.icon;
  const expanded = open || containsActive;
  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors ${
          containsActive
            ? "text-moli-orange font-semibold"
            : "text-white/80 hover:text-white hover:bg-navy-600"
        }`}
        aria-expanded={expanded}
      >
        <Icon size={18} strokeWidth={1.75} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="mt-0.5">
          {group.items.map((it) => (
            <SidebarLink
              key={it.to}
              item={it}
              active={path === it.to}
              onNavigate={onNavigate}
              nested
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Utility primitives used by pages */

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-black-800">{title}</h1>
        {description && <p className="text-sm text-black-400 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white border border-black-100 rounded-md p-6 ${className}`}>{children}</div>;
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wide text-black-400">{label}</div>
      <div className="font-display text-2xl md:text-3xl font-semibold mt-1 text-black-800 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-black-400 mt-1">{sub}</div>}
    </Card>
  );
}

export function BtnPrimary({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-sm bg-red-500 text-white text-sm font-semibold hover:bg-red-400 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 ${p.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function BtnOutline({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-sm border border-black-200 bg-white text-black-700 text-sm font-semibold hover:bg-black-50 active:bg-black-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 ${p.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Input(p: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      className={`w-full h-10 px-3 rounded-sm border border-black-100 bg-white text-sm text-black-700 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 placeholder:text-black-300 disabled:bg-plata-100 disabled:text-black-300 ${p.className ?? ""}`}
    />
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-black-700 mb-1.5 block">
      {children}
    </label>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warn" | "danger" }) {
  const styles: Record<string, string> = {
    neutral: "bg-plata-200 text-black-600",
    success: "bg-success-bg text-success",
    warn: "bg-warning-bg text-warning",
    danger: "bg-error-bg text-error",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}
