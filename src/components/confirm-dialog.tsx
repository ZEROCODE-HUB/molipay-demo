import { Trash2 } from "lucide-react";
import { BtnPrimary, BtnOutline } from "./portal-shell";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg max-w-sm w-full p-6 shadow-xl text-center">
        <Trash2 size={28} className="mx-auto text-red-500 mb-3" />
        <h3 className="font-semibold text-base mb-2">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}
        <div className="flex gap-3 justify-center">
          <BtnOutline onClick={onClose}>Cancelar</BtnOutline>
          <BtnPrimary
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
}
