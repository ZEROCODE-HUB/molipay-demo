import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Search, Eye, Edit3, Trash2, Info, X, Download, Printer } from "lucide-react";
import { Card, Input, Label, BtnPrimary, BtnOutline, Badge } from "@/components/portal-shell";
import { toast } from "sonner";
import { FormDialog } from "@/components/form-dialog";
import QRCode from "qrcode";

export const Route = createFileRoute("/app/qr/puntos-de-venta")({ component: Page });

interface PuntoVenta {
  id: string;
  nombre: string;
  subcuenta: string;
  tipo: "Estatico" | "Dinamico";
  ubicacion: string;
  estado: "Activo" | "Pausado";
  fecha: string;
}

const mockPDVs: PuntoVenta[] = [
  { id: "1", nombre: "Caja principal", subcuenta: "Sucursal Centro", tipo: "Estatico", ubicacion: "Av. Corrientes 1234", estado: "Activo", fecha: "2025-11-10" },
  { id: "2", nombre: "Caja secundaria", subcuenta: "Sucursal Centro", tipo: "Dinamico", ubicacion: "Av. Corrientes 1234", estado: "Activo", fecha: "2025-12-01" },
  { id: "3", nombre: "Sucursal Norte", subcuenta: "Sucursal Norte", tipo: "Estatico", ubicacion: "Av. Cabildo 3400", estado: "Activo", fecha: "2026-01-15" },
  { id: "4", nombre: "Evento Mayo", subcuenta: "Operaciones", tipo: "Dinamico", ubicacion: "Predio Ferial", estado: "Pausado", fecha: "2026-02-20" },
  { id: "5", nombre: "Kiosco Demo", subcuenta: "Operaciones", tipo: "Estatico", ubicacion: "Lavalle 789", estado: "Activo", fecha: "2026-03-05" },
  { id: "6", nombre: "Expreso Norte", subcuenta: "Sucursal Norte", tipo: "Dinamico", ubicacion: "Panamericana Km 38", estado: "Activo", fecha: "2026-04-12" },
  { id: "7", nombre: "Food Truck", subcuenta: "Operaciones", tipo: "Dinamico", ubicacion: "Parque Central", estado: "Pausado", fecha: "2026-05-01" },
  { id: "8", nombre: "Local Once", subcuenta: "Sucursal Centro", tipo: "Estatico", ubicacion: "Av. Rivadavia 2200", estado: "Activo", fecha: "2026-05-20" },
];

const ROWS_OPTIONS = [10, 20, 50];

const initialForm = {
  nombre: "",
  subcuenta: "Sucursal Centro",
  tipo: "Estatico" as PuntoVenta["tipo"],
  ubicacion: "",
  concepto: "",
  montoFijo: "",
};

function Page() {
  const [pdvs, setPdvs] = useState<PuntoVenta[]>(mockPDVs);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [crearOpen, setCrearOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detallePd, setDetallePd] = useState<PuntoVenta | null>(null);
  const [eliminarOpen, setEliminarOpen] = useState(false);
  const [eliminarId, setEliminarId] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const filtered = useMemo(() => {
    let list = [...pdvs];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.subcuenta.toLowerCase().includes(q) ||
          p.ubicacion.toLowerCase().includes(q),
      );
    }
    if (estadoFilter !== "Todos") {
      list = list.filter((p) => p.estado === estadoFilter);
    }
    if (fechaInicio) {
      list = list.filter((p) => p.fecha >= fechaInicio);
    }
    if (fechaFin) {
      list = list.filter((p) => p.fecha <= fechaFin);
    }
    return list;
  }, [pdvs, search, estadoFilter, fechaInicio, fechaFin]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearch("");
    setEstadoFilter("Todos");
    setFechaInicio("");
    setFechaFin("");
    setPage(1);
  };

  const openCrear = () => {
    setForm(initialForm);
    setEditingId(null);
    setCrearOpen(true);
  };

  const openEditar = (p: PuntoVenta) => {
    setForm({ nombre: p.nombre, subcuenta: p.subcuenta, tipo: p.tipo, ubicacion: p.ubicacion, concepto: "", montoFijo: "" });
    setEditingId(p.id);
    setCrearOpen(true);
  };

  const guardar = () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (editingId) {
      setPdvs((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, nombre: form.nombre, subcuenta: form.subcuenta, tipo: form.tipo, ubicacion: form.ubicacion } : p,
        ),
      );
      toast.success("Punto de venta actualizado");
    } else {
      const nuevo: PuntoVenta = {
        id: String(Date.now()),
        nombre: form.nombre,
        subcuenta: form.subcuenta,
        tipo: form.tipo,
        ubicacion: form.ubicacion,
        estado: "Activo",
        fecha: new Date().toISOString().slice(0, 10),
      };
      setPdvs((prev) => [nuevo, ...prev]);
      toast.success("Punto de venta creado");
    }
    setCrearOpen(false);
  };

  const confirmarEliminar = (id: string) => {
    setEliminarId(id);
    setEliminarOpen(true);
  };

  const ejecutarEliminar = () => {
    if (eliminarId) {
      setPdvs((prev) => prev.filter((p) => p.id !== eliminarId));
      toast.success("Punto de venta eliminado");
    }
    setEliminarOpen(false);
    setEliminarId(null);
  };

  return (
    <>
      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {filtered.length === pdvs.length
              ? `Total: ${pdvs.length} punto${pdvs.length !== 1 ? "s" : ""} de venta`
              : `${filtered.length} de ${pdvs.length} punto${pdvs.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <BtnPrimary onClick={openCrear}>
          <Plus size={15} /> Crear Punto de Venta
        </BtnPrimary>
      </div>

      {/* Banner informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">InformaciOn sobre Puntos de Venta</p>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Los puntos de venta permiten identificar y gestionar los cobros realizados dentro de una misma entidad.
          </p>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Si necesita separar la operaciOn por una unidad de negocio distinta, se recomienda crear una subcuenta y
            habilitar el cobro con QR en dicha subcuenta.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Nombre</Label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          <div>
            <Label>Estado</Label>
            <select
              className="w-full h-10 px-3 rounded-md border bg-card text-sm"
              value={estadoFilter}
              onChange={(e) => { setEstadoFilter(e.target.value); setPage(1); }}
            >
              <option value="Todos">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>
          <div>
            <Label>Fecha inicio</Label>
            <Input type="date" value={fechaInicio} onChange={(e) => { setFechaInicio(e.target.value); setPage(1); }} />
          </div>
          <div>
            <Label>Fecha fin</Label>
            <Input type="date" value={fechaFin} onChange={(e) => { setFechaFin(e.target.value); setPage(1); }} />
          </div>
        </div>
        {(search || estadoFilter !== "Todos" || fechaInicio || fechaFin) && (
          <button
            onClick={resetFilters}
            className="mt-3 text-xs text-primary font-semibold hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </Card>

      {/* Tabla */}
      <Card className="p-0 overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1.2fr_1fr_0.8fr_1fr_0.7fr_1.1fr] gap-4 px-5 py-3 border-b text-xs uppercase tracking-wide text-muted-foreground bg-muted/30">
          <div>Nombre</div>
          <div>Subcuenta</div>
          <div>Tipo QR</div>
          <div>UbicaciOn</div>
          <div>Estado</div>
          <div className="text-right">Acciones</div>
        </div>
        {paginated.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No se encontraron puntos de venta
          </div>
        ) : (
          paginated.map((p) => (
            <div
              key={p.id}
              className="lg:grid lg:grid-cols-[1.2fr_1fr_0.8fr_1fr_0.7fr_1.1fr] gap-4 px-5 py-3.5 border-b last:border-0 items-center"
            >
              <div className="font-semibold text-sm">{p.nombre}</div>
              <div className="font-mono text-sm text-muted-foreground">{p.subcuenta}</div>
              <div className="text-sm text-muted-foreground">{p.tipo}</div>
              <div className="text-sm text-muted-foreground truncate">{p.ubicacion}</div>
              <div>
                <Badge tone={p.estado === "Activo" ? "success" : "warn"}>{p.estado}</Badge>
              </div>
              <div className="flex gap-1 justify-end">
                <BtnOutline
                  className="h-8 px-2.5 text-xs"
                  onClick={async () => {
                    setDetallePd(p);
                    setDetalleOpen(true);
                    const payload = `https://molipay.com.ar/qr/pdv/${p.id}`;
                    const url = await QRCode.toDataURL(payload, { width: 280, margin: 2 });
                    setQrDataUrl(url);
                  }}
                >
                  <Eye size={13} /> Ver
                </BtnOutline>
                <BtnOutline className="h-8 px-2.5 text-xs" onClick={() => openEditar(p)}>
                  <Edit3 size={13} /> Editar
                </BtnOutline>
                <BtnOutline
                  className="h-8 px-2.5 text-xs hover:border-red-400 hover:text-red-600"
                  onClick={() => confirmarEliminar(p.id)}
                >
                  <Trash2 size={13} /> Eliminar
                </BtnOutline>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* PaginaciOn */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Filas por pAgina:</span>
          <select
            className="h-8 px-2 rounded border bg-card text-xs"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {ROWS_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>
            {filtered.length === 0
              ? "0 registros"
              : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} de ${filtered.length}`}
          </span>
        </div>
        <div className="flex gap-1">
          <BtnOutline
            className="h-8 px-3 text-xs"
            disabled={page <= 1}
            onClick={() => setPage(1)}
          >
            Primero
          </BtnOutline>
          <BtnOutline
            className="h-8 px-3 text-xs"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </BtnOutline>
          <span className="flex items-center px-3 text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <BtnOutline
            className="h-8 px-3 text-xs"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </BtnOutline>
          <BtnOutline
            className="h-8 px-3 text-xs"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
          >
            ultimo
          </BtnOutline>
        </div>
      </div>

      {/* Modal: Crear / Editar */}
      <FormDialog
        open={crearOpen}
        onClose={() => setCrearOpen(false)}
        title={editingId ? "Editar Punto de Venta" : "Crear Punto de Venta"}
        description="Complete la informaciOn para habilitar el cobro mediante QR."
        submitLabel={editingId ? "Guardar cambios" : "Crear Punto de Venta"}
        size="lg"
        onSubmit={guardar}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Nombre del punto de venta</Label>
            <Input
              placeholder="Ej. Caja principal"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div>
            <Label>Subcuenta destino</Label>
            <select
              className="w-full h-10 px-3 rounded-md border bg-card text-sm"
              value={form.subcuenta}
              onChange={(e) => setForm((f) => ({ ...f, subcuenta: e.target.value }))}
            >
              <option>Sucursal Centro</option>
              <option>Sucursal Norte</option>
              <option>Operaciones</option>
            </select>
          </div>
          <div>
            <Label>Tipo de QR</Label>
            <select
              className="w-full h-10 px-3 rounded-md border bg-card text-sm"
              value={form.tipo}
              onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as PuntoVenta["tipo"] }))}
            >
              <option value="Estatico">Estatico (monto libre)</option>
              <option value="Dinamico">Dinamico (monto fijo)</option>
            </select>
          </div>
          <div>
            <Label>UbicaciOn</Label>
            <Input
              placeholder="DirecciOn o referencia"
              value={form.ubicacion}
              onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))}
            />
          </div>
          <div>
            <Label>Concepto sugerido (opcional)</Label>
            <Input
              placeholder="Ej. Venta mostrador"
              value={form.concepto}
              onChange={(e) => setForm((f) => ({ ...f, concepto: e.target.value }))}
            />
          </div>
          {form.tipo === "Dinamico" && (
            <div>
              <Label>Monto fijo</Label>
              <Input
                placeholder="$ 0,00"
                value={form.montoFijo}
                onChange={(e) => setForm((f) => ({ ...f, montoFijo: e.target.value }))}
              />
            </div>
          )}
        </div>
      </FormDialog>

      {/* Modal: Ver detalle */}
      {detalleOpen && detallePd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetalleOpen(false)} />
          <div className="relative bg-card rounded-lg max-w-lg w-full p-6 shadow-xl">
            <button
              onClick={() => setDetalleOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
            <h3 className="font-semibold text-lg mb-4">{detallePd.nombre}</h3>

            <div className="grid grid-cols-[1fr_auto] gap-6">
              {/* Info */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subcuenta</span>
                  <span className="font-semibold">{detallePd.subcuenta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo QR</span>
                  <span className="font-semibold">{detallePd.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ubicaci&oacute;n</span>
                  <span className="font-semibold">{detallePd.ubicacion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge tone={detallePd.estado === "Activo" ? "success" : "warn"}>{detallePd.estado}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de creaci&oacute;n</span>
                  <span className="font-semibold">{detallePd.fecha}</span>
                </div>
              </div>

              {/* QR */}
              <div className="flex flex-col items-center gap-2">
                <div className="border-2 rounded-xl p-2 bg-white">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR" className="w-32 h-32" />
                  ) : (
                    <div className="w-32 h-32 bg-muted animate-pulse rounded" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  EscaneA para pagar en<br />
                  {detallePd.nombre}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <BtnOutline className="flex-1 h-9 text-xs" onClick={() => setDetalleOpen(false)}>
                Cerrar
              </BtnOutline>
              <BtnOutline
                className="h-9 text-xs"
                onClick={() => {
                  if (qrDataUrl) {
                    const a = document.createElement("a");
                    a.href = qrDataUrl;
                    a.download = `qr-${detallePd.id}.png`;
                    a.click();
                  }
                }}
              >
                <Download size={13} /> QR
              </BtnOutline>
              <BtnOutline
                className="h-9 text-xs"
                onClick={() => {
                  if (qrDataUrl) {
                    const w = window.open();
                    if (w) {
                      w.document.write(`<img src="${qrDataUrl}" onload="window.print()" />`);
                    }
                  }
                }}
              >
                <Printer size={13} />
              </BtnOutline>
              <BtnPrimary
                className="flex-1 h-9 text-xs"
                onClick={() => {
                  setDetalleOpen(false);
                  openEditar(detallePd);
                }}
              >
                <Edit3 size={13} /> Editar
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminaciOn */}
      {eliminarOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEliminarOpen(false)} />
          <div className="relative bg-card rounded-lg max-w-sm w-full p-6 shadow-xl text-center">
            <Trash2 size={28} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-semibold text-base mb-2">¿Eliminar punto de venta?</h3>
            <p className="text-sm text-muted-foreground mb-6">Esta acciOn no se puede deshacer.</p>
            <div className="flex gap-3 justify-center">
              <BtnOutline onClick={() => setEliminarOpen(false)}>Cancelar</BtnOutline>
              <BtnPrimary
                className="bg-red-600 hover:bg-red-700"
                onClick={ejecutarEliminar}
              >
                Eliminar
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
