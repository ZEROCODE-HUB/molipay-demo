import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { PageHeader, BtnPrimary } from "@/components/portal-shell";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/cobros")({
  component: Layout,
});

function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Cobros Masivos"
        description="Automatiza la generacion de cobros recurrentes: links de pago, codigos QR y CBU para cada deudor."
        action={
          <BtnPrimary onClick={() => navigate({ to: "/app/cobros/nuevo" })}>
            <Plus size={16} /> Nuevo lote
          </BtnPrimary>
        }
      />
      <Outlet />
    </>
  );
}
