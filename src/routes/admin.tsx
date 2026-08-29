import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Percent,
  Activity,
  ShieldAlert,
  Home,
  KeySquare,
  Settings,
  FileBarChart2,
  Radar,
  Landmark,
  UserCheck,
  Users,
  Banknote,
  HandCoins,
} from "lucide-react";
import { PortalShell, type NavItem } from "@/components/portal-shell";
import { useDemoMode } from "@/contexts/demo-mode";
import { RouteSkeleton } from "@/components/route-skeleton";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  pendingComponent: RouteSkeleton,
});

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Clientes y KYC",
    icon: Users,
    items: [
      { to: "/admin/clientes", label: "Clientes", icon: Building2 },
      { to: "/admin/kyc", label: "Validacion de identidad", icon: UserCheck },
    ],
  },
  {
    label: "Operaciones Financieras",
    icon: Banknote,
    items: [
      { to: "/admin/cbu", label: "CBU y subcuentas", icon: Wallet },
      { to: "/admin/movimientos", label: "Movimientos", icon: Activity },
      { to: "/admin/comisiones", label: "Comisiones", icon: Percent },
      { to: "/admin/monitoreo", label: "Monitoreo", icon: Radar },
    ],
  },
  {
    label: "Recaudacion",
    icon: HandCoins,
    items: [
      { to: "/admin/recaudacion", label: "Recaudacion sectorial", icon: Landmark },
      { to: "/admin/consorcio", label: "Consorcio", icon: KeySquare },
      { to: "/admin/alquileres", label: "Alquileres", icon: Home },
    ],
  },
  { to: "/admin/compliance", label: "Compliance", icon: ShieldAlert },
  { to: "/admin/reporteria", label: "Reporteria", icon: FileBarChart2 },
  { to: "/admin/config", label: "Configuracion", icon: Settings },
];

function AdminLayout() {
  const { role, setRole } = useDemoMode();
  useEffect(() => {
    if (role !== "admin") setRole("admin");
  }, [role, setRole]);
  return (
    <PortalShell nav={nav} title="Backoffice Molly">
      <Outlet />
    </PortalShell>
  );
}
