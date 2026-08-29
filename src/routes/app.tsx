import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Link2,
  QrCode,
  Receipt,
  Upload,
  History,
  UserCog,
  Shield,
  Package,
  Store,
  List,
  ShoppingCart,
  Code2,
} from "lucide-react";
import { PortalShell, type NavItem } from "@/components/portal-shell";
import { SupportBot } from "@/components/support-bot";
import { useDemoMode } from "@/contexts/demo-mode";
import { RouteSkeleton } from "@/components/route-skeleton";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  pendingComponent: RouteSkeleton,
});

const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/historial", label: "Historial", icon: History },
  { to: "/app/transferencias", label: "Transferir", icon: ArrowLeftRight },
  { to: "/app/subcuentas", label: "Subcuentas", icon: Wallet },
  {
    label: "Link de pago",
    icon: Link2,
    items: [
      { to: "/app/link-pago", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/link-pago/productos", label: "Productos", icon: Package },
      { to: "/app/link-pago/e-commerce", label: "E-commerce", icon: ShoppingCart },
    ],
  },
  {
    label: "Cobros con QR",
    icon: QrCode,
    items: [
      { to: "/app/qr", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/qr/puntos-de-venta", label: "Puntos de Venta", icon: Store },
    ],
  },
  { to: "/app/servicios", label: "Pago de servicios", icon: Receipt },
  {
    label: "Cobros masivos",
    icon: Upload,
    items: [
      { to: "/app/cobros", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/cobros/gestion", label: "Gestion de lotes", icon: List },
    ],
  },
  { to: "/app/cuenta", label: "Mi cuenta", icon: UserCog },
  { to: "/app/seguridad", label: "Seguridad", icon: Shield },
  { to: "/app/api-config", label: "Config. APIs Externas", icon: Code2 },
];

function AppLayout() {
  const { role, setRole } = useDemoMode();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "empresa") setRole("empresa");
  }, [role, setRole]);

  return (
    <PortalShell nav={nav} title="Portal Empresa">
      <Outlet />
      <SupportBot />
    </PortalShell>
  );
}
