import { type ReactNode } from "react";
import { X } from "lucide-react";
import { BtnPrimary, BtnOutline } from "./portal-shell";

export function FormDialog({
  open,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Crear",
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  size?: "md" | "lg";
}) {
  if (!open) return null;
  const w = size === "lg" ? "max-w-2xl" : "max-w-md";
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-card rounded-lg w-full ${w} max-h-[90vh] overflow-y-auto shadow-xl`}>
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex justify-between items-start z-10">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-muted rounded-md">
            <X size={18} />
          </button>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <div className="flex gap-2 pt-2">
            <BtnOutline type="button" className="flex-1" onClick={onClose}>
              Cancelar
            </BtnOutline>
            <BtnPrimary type="submit" className="flex-1">
              {submitLabel}
            </BtnPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}