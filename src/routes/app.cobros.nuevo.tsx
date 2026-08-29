import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Upload, FileSpreadsheet, Download, X } from "lucide-react";
import { Card, BtnPrimary, BtnOutline, Input, Label } from "@/components/portal-shell";
import { toast } from "sonner";
import { generateId, medioPagoLabels, type MedioPago } from "@/data/cobros-masivos";
import { format } from "date-fns";

export const Route = createFileRoute("/app/cobros/nuevo")({ component: NuevoLote });

const MEDIOS_DISPONIBLES: MedioPago[] = [
  "TRANSFERENCIA",
  "TARJETA_CREDITO",
  "TARJETA_DEBITO",
  "QR",
];

interface CSVRow {
  tipo_entidad: string;
  id_entidad: string;
  sub_entidad: string;
  identificacion_usuario: string;
  monto: number;
  descripcion: string;
  email?: string;
  periodo_facturacion?: string;
  id_unico_beneficiario?: string;
  fecha_vencimiento_1?: string;
  fecha_vencimiento_2?: string;
  fecha_vencimiento_3?: string;
  tasa_interes?: number;
  medios_de_pago?: string;
  pagos_parciales_habilitado?: string;
}

function NuevoLote() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [paso, setPaso] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => { setPage(1); }, [csvData]);

  // Paso 1 - Parametros generales
  const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");
  const [nombre, setNombre] = useState("");
  const [periodo, setPeriodo] = useState(format(new Date(), "yyyy-MM"));
  const [diaProcesamiento, setDiaProcesamiento] = useState(15);
  const [tasaInteres, setTasaInteres] = useState(10);
  const [fechaVenc1, setFechaVenc1] = useState(tomorrow);
  const [fechaVenc2, setFechaVenc2] = useState("");
  const [fechaVenc3, setFechaVenc3] = useState("");
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([
    "TRANSFERENCIA",
    "TARJETA_CREDITO",
    "TARJETA_DEBITO",
  ]);
  const [pagosParciales, setPagosParciales] = useState(true);
  const [notificaciones, setNotificaciones] = useState(false);

  const toggleMedio = (m: MedioPago) => {
    setMediosPago((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const validarPaso1 = (): boolean => {
    if (!nombre.trim()) {
      toast.error("El nombre del lote es obligatorio");
      return false;
    }
    if (!periodo.match(/^\d{4}-\d{2}$/)) {
      toast.error("El periodo debe estar en formato AAAA-MM");
      return false;
    }
    if (!diaProcesamiento || diaProcesamiento < 1 || diaProcesamiento > 31) {
      toast.error("El dia de pago debe ser un numero entre 1 y 31");
      return false;
    }
    if (!fechaVenc1 || fechaVenc1 < tomorrow) {
      toast.error("La primera fecha de vencimiento no puede ser anterior a manana");
      return false;
    }
    if (fechaVenc2 && fechaVenc2 <= fechaVenc1) {
      toast.error("El 2º vencimiento debe ser posterior al 1º");
      return false;
    }
    if (fechaVenc3 && fechaVenc3 <= fechaVenc2) {
      toast.error("El 3º vencimiento debe ser posterior al 2º");
      return false;
    }
    if (mediosPago.length === 0) {
      toast.error("Selecciona al menos un medio de pago");
      return false;
    }
    return true;
  };

  // Paso 2 - CSV
  const descargarPlantilla = () => {
    const headers = [
      "tipo_entidad",
      "id_entidad",
      "sub_entidad",
      "identificacion_usuario",
      "monto",
      "descripcion",
      "email",
      "periodo_facturacion",
      "id_unico_beneficiario",
      "fecha_vencimiento_1",
      "fecha_vencimiento_2",
      "fecha_vencimiento_3",
      "tasa_interes",
      "medios_de_pago",
      "pagos_parciales_habilitado",
    ];
    const example = [
      "edificio",
      "6",
      "UF 3D",
      "Perez, Juan",
      "48200",
      "Expensas mensuales - Edificio 6",
      "juan@email.com",
      "",
      "",
      "2026-04-15",
      "2026-04-30",
      "2026-05-15",
      "10",
      "TRANSFERENCIA|TARJETA_CREDITO",
      "true",
    ];
    const csvContent = [headers.join(","), example.join(",")].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;bom" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-cobros-masivos.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Plantilla descargada");
  };

  const procesarArchivo = (file: File) => {
    setCsvFileName(file.name);
    setSubiendo(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.split("\n").filter((l) => l.trim());
        if (lines.length < 2) {
          toast.error("El archivo debe contener al menos un encabezado y una fila de datos");
          setSubiendo(false);
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const rows: CSVRow[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] ?? "";
          });

          const monto = parseFloat(row["monto"] || "0");
          if (isNaN(monto) || monto <= 0) {
            toast.error(`Fila ${i}: el monto debe ser un numero positivo`);
            setSubiendo(false);
            return;
          }

          if (!row["tipo_entidad"] || !row["id_entidad"] || !row["sub_entidad"]) {
            toast.error(`Fila ${i}: tipo_entidad, id_entidad y sub_entidad son obligatorios`);
            setSubiendo(false);
            return;
          }

          if (!row["identificacion_usuario"]) {
            toast.error(`Fila ${i}: identificacion_usuario es obligatorio`);
            setSubiendo(false);
            return;
          }

          rows.push({
            tipo_entidad: row["tipo_entidad"],
            id_entidad: row["id_entidad"],
            sub_entidad: row["sub_entidad"],
            identificacion_usuario: row["identificacion_usuario"],
            monto,
            descripcion: row["descripcion"] || row["descripcion"] || "",
            email: row["email"] || undefined,
            periodo_facturacion: row["periodo_facturacion"] || undefined,
            id_unico_beneficiario:
              row["id_unico_beneficiario"] || row["id_unico_beneficiario"] || undefined,
            fecha_vencimiento_1: row["fecha_vencimiento_1"] || undefined,
            fecha_vencimiento_2: row["fecha_vencimiento_2"] || undefined,
            fecha_vencimiento_3: row["fecha_vencimiento_3"] || undefined,
            tasa_interes: row["tasa_interes"] ? parseFloat(row["tasa_interes"]) : undefined,
            medios_de_pago: row["medios_de_pago"] || undefined,
            pagos_parciales_habilitado: row["pagos_parciales_habilitado"] || undefined,
          });
        }

        setCsvData(rows);
        toast.success(`${rows.length} registros validos cargados`);
      } catch {
        toast.error("Error al procesar el archivo. Verifica el formato CSV.");
      }
      setSubiendo(false);
    };

    reader.onerror = () => {
      toast.error("Error al leer el archivo");
      setSubiendo(false);
    };

    reader.readAsText(file);
  };

  const handleSubmit = () => {
    toast.success(`Lote "${nombre}" creado con ${csvData.length} registros`, {
      description: "El lote quedo en estado Pendiente de procesamiento",
    });
    navigate({ to: "/app/cobros/gestion" });
  };

  return (
    <div className="max-w-4xl">
      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["Parametros generales", "Carga de CSV", "Confirmacion"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                i === paso
                  ? "bg-primary text-primary-foreground"
                  : i < paso
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < paso ? <Check size={12} /> : <span>{i + 1}</span>}
              {label}
            </div>
            {i < 2 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Paso 1: Parametros generales */}
      {paso === 0 && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-4">Parametros generales</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre del lote</Label>
                <Input
                  placeholder="Ej. Expensas Abril 2026"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <Label>Periodo (AAAA-MM)</Label>
                <Input
                  placeholder="2026-04"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                />
              </div>
              <div>
                <Label>Dia de pago</Label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={diaProcesamiento}
                  onChange={(e) => setDiaProcesamiento(Number(e.target.value))}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Dia del mes en que se procesaran los cobros (1-31).
                </p>
              </div>
              <div>
                <Label>Tasa de interes (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={tasaInteres}
                  onChange={(e) => setTasaInteres(Number(e.target.value))}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Aplica desde el 2º vencimiento en adelante.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Fechas de vencimiento</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>1er vencimiento *</Label>
                <Input
                  type="date"
                  value={fechaVenc1}
                  onChange={(e) => setFechaVenc1(e.target.value)}
                />
              </div>
              <div>
                <Label>2do vencimiento (opcional)</Label>
                <Input
                  type="date"
                  value={fechaVenc2}
                  onChange={(e) => setFechaVenc2(e.target.value)}
                />
              </div>
              <div>
                <Label>3er vencimiento (opcional)</Label>
                <Input
                  type="date"
                  value={fechaVenc3}
                  onChange={(e) => setFechaVenc3(e.target.value)}
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Cada fecha debe ser estrictamente posterior a la anterior. El 1er vencimiento se cobra
              por el monto original, el 2do y 3ro aplican la tasa de interes.
            </p>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Medios de pago y configuracion</h3>
            <div className="space-y-4">
              <div>
                <Label>Medios de pago habilitados</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {MEDIOS_DISPONIBLES.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleMedio(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        mediosPago.includes(m)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-input hover:border-foreground/30"
                      }`}
                    >
                      {medioPagoLabels[m]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pagosParciales}
                    onChange={(e) => setPagosParciales(e.target.checked)}
                    className="rounded"
                  />
                  Permitir pagos parciales
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificaciones}
                    onChange={(e) => setNotificaciones(e.target.checked)}
                    className="rounded"
                  />
                  Habilitar notificaciones
                </label>
              </div>
              {notificaciones && (
                <div className="text-xs text-muted-foreground pl-6">
                  Canal: Email (SMS y WhatsApp proximamente)
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <BtnOutline onClick={() => navigate({ to: "/app/cobros/gestion" })}>
              Cancelar
            </BtnOutline>
            <BtnPrimary
              onClick={() => {
                if (validarPaso1()) setPaso(1);
              }}
            >
              Siguiente <ArrowRight size={14} />
            </BtnPrimary>
          </div>
        </div>
      )}

      {/* Paso 2: Carga de CSV */}
      {paso === 1 && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-3">Carga de archivo</h3>
            <div className="text-sm text-muted-foreground mb-4 space-y-1">
              <p>
                Campos obligatorios:{" "}
                <strong>
                  tipo_entidad, id_entidad, sub_entidad, identificacion_usuario, monto, descripcion
                </strong>
              </p>
              <p>
                Campos opcionales: email, periodo_facturacion, id_unico_beneficiario,
                fecha_vencimiento_1/2/3, tasa_interes, medios_de_pago, pagos_parciales_habilitado
              </p>
              <p>
                Si no se completan los campos opcionales, heredan la configuracion general del lote.
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              <BtnOutline className="h-9 px-3 text-xs" onClick={descargarPlantilla}>
                <Download size={14} /> Descargar plantilla CSV
              </BtnOutline>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) procesarArchivo(f);
              }}
            />

            {csvData.length === 0 ? (
              <div
                className="flex flex-col items-center gap-3 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) procesarArchivo(f);
                }}
              >
                <div className="w-14 h-14 rounded-lg bg-[color:var(--brand-soft)] flex items-center justify-center">
                  <Upload size={24} className="text-[color:var(--brand-dark)]" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Subi un archivo CSV</div>
                  <div className="text-xs text-muted-foreground">
                    Arrastra el archivo o hace clic para seleccionar
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <FileSpreadsheet size={20} className="text-emerald-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{csvFileName}</div>
                    <div className="text-xs text-muted-foreground">
                      {csvData.length} registros parseados correctamente
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCsvData([]);
                      setCsvFileName("");
                    }}
                    className="p-1 rounded hover:bg-emerald-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left px-3 py-2 font-semibold">Entidad</th>
                        <th className="text-left px-3 py-2 font-semibold">Usuario</th>
                        <th className="text-right px-3 py-2 font-semibold">Monto</th>
                        <th className="text-left px-3 py-2 font-semibold">Descripcion</th>
                        <th className="text-left px-3 py-2 font-semibold">Email</th>
                        <th className="text-left px-3 py-2 font-semibold">Venc. 1</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {csvData.slice((page - 1) * pageSize, page * pageSize).map((r, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2">
                            {r.tipo_entidad} {r.id_entidad} - {r.sub_entidad}
                          </td>
                          <td className="px-3 py-2">{r.identificacion_usuario}</td>
                          <td className="px-3 py-2 font-mono tabular-nums text-right font-medium">
                            ${r.monto.toLocaleString("es-AR")}
                          </td>
                          <td className="px-3 py-2 max-w-[150px] truncate">{r.descripcion}</td>
                          <td className="px-3 py-2">{r.email ?? "-"}</td>
                          <td className="px-3 py-2">
                            {r.fecha_vencimiento_1?.slice(0, 10) ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvData.length > pageSize && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <span>{`${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, csvData.length)} de ${csvData.length}`}</span>
                    <div className="flex gap-1">
                      <BtnOutline className="h-7 px-2 text-[11px]" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</BtnOutline>
                      <BtnOutline className="h-7 px-2 text-[11px]" disabled={page >= Math.ceil(csvData.length / pageSize)} onClick={() => setPage((p) => Math.min(Math.ceil(csvData.length / pageSize), p + 1))}>Siguiente</BtnOutline>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <div className="flex justify-between gap-2">
            <BtnOutline onClick={() => setPaso(0)}>
              <ArrowLeft size={14} /> Anterior
            </BtnOutline>
            <BtnPrimary
              disabled={csvData.length === 0 || subiendo}
              onClick={() => {
                if (csvData.length === 0) {
                  toast.error("Debes cargar al menos un registro");
                  return;
                }
                setPaso(2);
              }}
            >
              Siguiente <ArrowRight size={14} />
            </BtnPrimary>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmacion */}
      {paso === 2 && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-4">Resumen del lote</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <div className="font-semibold">{nombre}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Periodo:</span>
                <div className="font-semibold">{periodo}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Dia de pago:</span>
                <div className="font-semibold">Cada mes, dia {diaProcesamiento}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Tasa de interes:</span>
                <div className="font-semibold">{tasaInteres}% (desde 2º vencimiento)</div>
              </div>
              <div>
                <span className="text-muted-foreground">1er vencimiento:</span>
                <div className="font-semibold">{fechaVenc1}</div>
              </div>
              <div>
                <span className="text-muted-foreground">2do vencimiento:</span>
                <div className="font-semibold">{fechaVenc2 || "No configurado"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">3er vencimiento:</span>
                <div className="font-semibold">{fechaVenc3 || "No configurado"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Pagos parciales:</span>
                <div className="font-semibold">
                  {pagosParciales ? "Habilitados" : "Deshabilitados"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Notificaciones:</span>
                <div className="font-semibold">
                  {notificaciones ? "Habilitadas" : "Deshabilitadas"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Medios de pago:</span>
                <div className="font-semibold">
                  {mediosPago.map((m) => medioPagoLabels[m]).join(", ")}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Registros cargados</h3>
            <div className="text-sm">
              <span className="font-display tabular-nums font-semibold text-lg">{csvData.length}</span>{" "}
              <span className="text-muted-foreground">registros</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Monto total estimado:{" "}
              <strong className="font-mono tabular-nums text-foreground">
                ${csvData.reduce((s, r) => s + r.monto, 0).toLocaleString("es-AR")}
              </strong>
            </div>
          </Card>

          <div className="flex justify-between gap-2">
            <BtnOutline onClick={() => setPaso(1)}>
              <ArrowLeft size={14} /> Anterior
            </BtnOutline>
            <BtnPrimary onClick={handleSubmit}>
              <Check size={14} /> Crear lote
            </BtnPrimary>
          </div>
        </div>
      )}
    </div>
  );
}
