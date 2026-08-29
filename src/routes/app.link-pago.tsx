import { createFileRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal-shell";
import { LayoutDashboard, Package, Store } from "lucide-react";
import { RouteSkeleton } from "@/components/route-skeleton";

export const Route = createFileRoute("/app/link-pago")({
  component: Layout,
  pendingComponent: RouteSkeleton,
});

const tabs = [
  { path: "/app/link-pago", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/link-pago/productos", label: "Productos", icon: Package },
  { path: "/app/link-pago/e-commerce", label: "E-commerce", icon: Store },
];

function Layout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Links de Pago"
        description="Genera y administra links de cobro, productos e integraciones con tu tienda."
      />
      <div className="flex gap-1 mb-6 border-b overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.path}
            onClick={() => navigate({ to: t.path })}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition whitespace-nowrap ${
              path === t.path
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>
      <Outlet />
    </>
  );
}
