import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Crear una cuenta — Molipay" },
      { name: "description", content: "Registrate en Molipay." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegistroLayout,
});

function RegistroLayout() {
  const navigate = useNavigate();
  const matches = useRouterState({ select: (s) => s.matches });
  const isExactRoute = matches.length > 0 && matches[matches.length - 1]?.routeId === "/registro";

  useEffect(() => {
    if (isExactRoute) {
      navigate({ to: "/login", search: { register: "pf" }, replace: true });
    }
  }, [isExactRoute, navigate]);

  if (isExactRoute) return null;

  return <Outlet />;
}