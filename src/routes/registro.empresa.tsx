import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/registro/empresa")({
  head: () => ({
    meta: [
      { title: "Registrar empresa — Molipay" },
      { name: "description", content: "Registra tu empresa en Molipay." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedirectToLogin,
});

function RedirectToLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/login", search: { register: "pj" }, replace: true });
  }, [navigate]);
  return null;
}