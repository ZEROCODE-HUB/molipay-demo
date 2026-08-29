import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type DemoRole = "empresa" | "admin";

type DemoCtx = {
  role: DemoRole | null;
  setRole: (r: DemoRole | null) => void;
  bannerHidden: boolean;
  hideBanner: () => void;
  showBanner: () => void;
};

const Ctx = createContext<DemoCtx | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DemoRole | null>(null);
  const [bannerHidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const r = localStorage.getItem("molly_role") as DemoRole | null;
    if (r === "empresa" || r === "admin") setRoleState(r);
  }, []);

  const setRole = (r: DemoRole | null) => {
    setRoleState(r);
    if (typeof window !== "undefined") {
      if (r) localStorage.setItem("molly_role", r);
      else localStorage.removeItem("molly_role");
    }
    setHidden(false);
  };

  return (
    <Ctx.Provider
      value={{
        role,
        setRole,
        bannerHidden,
        hideBanner: () => setHidden(true),
        showBanner: () => setHidden(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDemoMode() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDemoMode must be used inside DemoModeProvider");
  return c;
}
