import { createFileRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal-shell";
import { LayoutDashboard, Store } from "lucide-react";
import { RouteSkeleton } from "@/components/route-skeleton";

export const Route = createFileRoute("/app/qr")({
  component: Layout,
  pendingComponent: RouteSkeleton,
});

const tabs = [
  { path: "/app/qr", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/qr/puntos-de-venta", label: "Puntos de Venta", icon: Store },
];

function Layout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Cobros con QR"
        description="Cobra presencialmente con QR interoperables compatibles con cualquier billetera."
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
