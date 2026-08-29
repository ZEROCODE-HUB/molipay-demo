import { subDays, format, addDays, parseISO } from "date-fns";

// ===== Tipos principales =====
export type LoteEstado =
  "cargado" | "en_proceso" | "finalizado" | "pausado" | "eliminado" | "error";

export type MedioPago = "TRANSFERENCIA" | "TARJETA_CREDITO" | "TARJETA_DEBITO" | "QR";

export type RegistroEstado = "pendiente" | "pagado_total" | "pagado_parcial" | "vencido" | "error";

export type PagoEstado = "aprobado" | "pendiente" | "rechazado";

export type TipoOperacion = "TRANSFERENCIA_BANCARIA" | "QR" | "TARJETA_DEBITO_CREDITO";

export interface Lote {
  id: string;
  nombre: string;
  periodo: string;
  diaProcesamiento: string;
  estado: LoteEstado;
  tasaInteres: number;
  fechaVencimiento1: string;
  fechaVencimiento2: string | null;
  fechaVencimiento3: string | null;
  mediosPago: MedioPago[];
  pagosParcialesHabilitado: boolean;
  notificacionesHabilitado: boolean;
  createdAt: string;
  fechaInicio: string | null;
  fechaFinalizacion: string | null;
}

export interface RegistroDeLote {
  id: string;
  loteId: string;
  tipoEntidad: string;
  idEntidad: string;
  subEntidad: string;
  identificacionUsuario: string;
  monto: number;
  descripcion: string;
  email: string | null;
  periodoFacturacion: string | null;
  idUnicoBeneficiario: string | null;
  fechaVencimiento1: string | null;
  fechaVencimiento2: string | null;
  fechaVencimiento3: string | null;
  tasaInteres: number | null;
  mediosPago: MedioPago[] | null;
  pagosParcialesHabilitado: boolean | null;
  cbuId: string | null;
  linkDePago: string | null;
  estado: RegistroEstado;
  montoPagado: number;
  fechaPago: string | null;
  createdAt: string;
  emailEnviado: boolean;
}

export interface Pago {
  id: string;
  registroId: string;
  loteId: string;
  monto: number;
  montoDeclarado: number | null;
  medioPago: MedioPago;
  tipoOperacion: TipoOperacion;
  timestamp: string;
  estado: PagoEstado;
  externalReference: string | null;
}

export interface CBURecord {
  id: string;
  tipoEntidad: string;
  idEntidad: string;
  subEntidad: string;
  cbu: string;
  alias: string;
  createdAt: string;
}

// ===== Helpers =====
const now = new Date();

function fmt(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function fmtFull(d: Date): string {
  return format(d, "yyyy-MM-dd HH:mm:ss");
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

function entidadLabel(tipo: string, id: string, sub: string): string {
  return `${tipo} ${id} - ${sub}`;
}

export function formatARS(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(n);
}

export function generateId(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let r = "";
  for (let i = 0; i < 6; i++) r += chars[rand(0, chars.length - 1)];
  return `${prefix}-${r}`;
}

// ===== Mock CBUs =====
const cbuPool: CBURecord[] = [];
const cbuSet = new Set<string>();

function getOrCreateCBU(tipo: string, id: string, sub: string): CBURecord {
  const key = `${tipo}|${id}|${sub}`;
  if (cbuSet.has(key)) {
    return cbuPool.find(
      (c) => c.tipoEntidad === tipo && c.idEntidad === id && c.subEntidad === sub,
    )!;
  }
  const cbu: CBURecord = {
    id: generateId("CBU"),
    tipoEntidad: tipo,
    idEntidad: id,
    subEntidad: sub,
    cbu: `00000031000${String(rand(10000000000, 99999999999))}`,
    alias: `${tipo}.${id}.${sub.replace(/\s/g, "")}`,
    createdAt: fmtFull(now),
  };
  cbuPool.push(cbu);
  cbuSet.add(key);
  return cbu;
}

// ===== Deudores =====
const deudores = [
  { nombre: "Pérez, Juan", email: "juan.perez@email.com", tipo: "edificio", id: "6", sub: "UF 3D" },
  {
    nombre: "López, María",
    email: "maria.lopez@email.com",
    tipo: "edificio",
    id: "6",
    sub: "UF 4A",
  },
  {
    nombre: "Gómez, Pedro",
    email: "pedro.gomez@email.com",
    tipo: "edificio",
    id: "6",
    sub: "UF 5B",
  },
  { nombre: "Sosa, Ana", email: "ana.sosa@email.com", tipo: "edificio", id: "6", sub: "UF 7C" },
  { nombre: "Vega, Tomás", email: "tomas.vega@email.com", tipo: "edificio", id: "6", sub: "UF 8A" },
  { nombre: "Díaz, Laura", email: "laura.diaz@email.com", tipo: "edificio", id: "6", sub: "UF 9B" },
  {
    nombre: "Martínez, Carlos",
    email: "carlos.martinez@email.com",
    tipo: "edificio",
    id: "7",
    sub: "UF 1A",
  },
  {
    nombre: "Giménez, Sofía",
    email: "sofia.gimenez@email.com",
    tipo: "edificio",
    id: "7",
    sub: "UF 2B",
  },
  {
    nombre: "Rodríguez, Diego",
    email: "diego.rodriguez@email.com",
    tipo: "edificio",
    id: "7",
    sub: "UF 3C",
  },
  {
    nombre: "Fernández, Lucía",
    email: "lucia.fernandez@email.com",
    tipo: "edificio",
    id: "7",
    sub: "UF 4D",
  },
  {
    nombre: "Álvarez, Roberto",
    email: "roberto.alvarez@email.com",
    tipo: "edificio",
    id: "8",
    sub: "UF 1A",
  },
  {
    nombre: "Moreno, Carla",
    email: "carla.moreno@email.com",
    tipo: "edificio",
    id: "8",
    sub: "UF 2B",
  },
  {
    nombre: "Romero, Pablo",
    email: "pablo.romero@email.com",
    tipo: "club",
    id: "12",
    sub: "Socio 145",
  },
  {
    nombre: "Castillo, Elena",
    email: "elena.castillo@email.com",
    tipo: "club",
    id: "12",
    sub: "Socio 189",
  },
  {
    nombre: "Ríos, Fernando",
    email: "fernando.rios@email.com",
    tipo: "club",
    id: "12",
    sub: "Socio 234",
  },
  {
    nombre: "Molina, Graciela",
    email: "graciela.molina@email.com",
    tipo: "club",
    id: "15",
    sub: "Socio 056",
  },
  {
    nombre: "Acosta, Jorge",
    email: "jorge.acosta@email.com",
    tipo: "local",
    id: "3",
    sub: "Loc 1",
  },
  {
    nombre: "Pereyra, Natalia",
    email: "natalia.pereyra@email.com",
    tipo: "local",
    id: "3",
    sub: "Loc 2",
  },
  {
    nombre: "Silva, Gustavo",
    email: "gustavo.silva@email.com",
    tipo: "edificio",
    id: "9",
    sub: "UF 1A",
  },
  {
    nombre: "Medina, Patricia",
    email: "patricia.medina@email.com",
    tipo: "edificio",
    id: "9",
    sub: "UF 2B",
  },
  {
    nombre: "Ortiz, Alejandro",
    email: "alejandro.ortiz@email.com",
    tipo: "colegio",
    id: "23",
    sub: "Curso 5°A",
  },
  {
    nombre: "Vázquez, Marcela",
    email: "marcela.vazquez@email.com",
    tipo: "colegio",
    id: "23",
    sub: "Curso 5°B",
  },
  {
    nombre: "Roldán, Sergio",
    email: "sergio.roldan@email.com",
    tipo: "colegio",
    id: "23",
    sub: "Curso 6°A",
  },
  {
    nombre: "Campos, Valeria",
    email: "valeria.campos@email.com",
    tipo: "edificio",
    id: "10",
    sub: "UF 1C",
  },
  {
    nombre: "Núñez, Daniel",
    email: "daniel.nunez@email.com",
    tipo: "edificio",
    id: "10",
    sub: "UF 2D",
  },
];

// ===== Generación de lotes =====
function generarRegistros(
  loteId: string,
  desde: number,
  cantidad: number,
  montoBase: number,
  config: {
    fechaVencimiento1: string;
    fechaVencimiento2: string | null;
    fechaVencimiento3: string | null;
    mediosPago: MedioPago[];
    pagosParciales: boolean;
    tasaInteres: number;
  },
): RegistroDeLote[] {
  const registros: RegistroDeLote[] = [];
  for (let i = 0; i < cantidad; i++) {
    const idx = ((desde + i) % deudores.length + deudores.length) % deudores.length;
    const d = deudores[idx];
    const pagoCompleto = Math.random() < 0.65;
    const pagoParcial = !pagoCompleto && Math.random() < 0.2;
    const vencido = !pagoCompleto && !pagoParcial && Math.random() < 0.3;

    let estado: RegistroEstado;
    let montoPagado = 0;
    let fechaPago: string | null = null;

    if (pagoCompleto) {
      estado = "pagado_total";
      montoPagado = montoBase;
      fechaPago = fmtFull(addDays(parseISO(config.fechaVencimiento1), rand(-3, 3)));
    } else if (pagoParcial) {
      estado = "pagado_parcial";
      montoPagado = Math.round(montoBase * (rand(30, 70) / 100));
      fechaPago = fmtFull(addDays(parseISO(config.fechaVencimiento1), rand(0, 5)));
    } else if (vencido) {
      estado = "vencido";
      montoPagado = 0;
    } else {
      estado = "pendiente";
    }

    const cbu = getOrCreateCBU(d.tipo, d.id, d.sub);

    registros.push({
      id: generateId("REG"),
      loteId,
      tipoEntidad: d.tipo,
      idEntidad: d.id,
      subEntidad: d.sub,
      identificacionUsuario: d.nombre,
      monto: montoBase,
      descripcion: `Expensas mensuales - ${d.tipo} ${d.id}`,
      email: d.email,
      periodoFacturacion: null,
      idUnicoBeneficiario: null,
      fechaVencimiento1: config.fechaVencimiento1,
      fechaVencimiento2: config.fechaVencimiento2,
      fechaVencimiento3: config.fechaVencimiento3,
      tasaInteres: config.tasaInteres,
      mediosPago: config.mediosPago,
      pagosParcialesHabilitado: config.pagosParciales,
      cbuId: cbu.id,
      linkDePago: `https://pay.molly.com.ar/l/${generateId("LNK").toLowerCase()}`,
      estado,
      montoPagado,
      fechaPago,
      createdAt: fmtFull(subDays(now, rand(5, 60))),
      emailEnviado: Math.random() < 0.3,
    });
  }
  return registros;
}

function generarPagos(registro: RegistroDeLote): Pago[] {
  if (registro.montoPagado <= 0) return [];
  const pagos: Pago[] = [];

  if (registro.estado === "pagado_total") {
    const medio = pick(
      registro.mediosPago ??
        (["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO", "QR"] as MedioPago[]),
    );
    pagos.push({
      id: generateId("PAY"),
      registroId: registro.id,
      loteId: registro.loteId,
      monto: registro.montoPagado,
      montoDeclarado:
        Math.random() < 0.2 ? registro.montoPagado + rand(-500, 500) : registro.montoPagado,
      medioPago: medio,
      tipoOperacion:
        medio === "QR"
          ? "QR"
          : medio === "TRANSFERENCIA"
            ? "TRANSFERENCIA_BANCARIA"
            : "TARJETA_DEBITO_CREDITO",
      timestamp: registro.fechaPago ?? fmtFull(now),
      estado: "aprobado",
      externalReference: null,
    });
  } else if (registro.estado === "pagado_parcial") {
    const pago = {
      id: generateId("PAY"),
      registroId: registro.id,
      loteId: registro.loteId,
      monto: registro.montoPagado,
      montoDeclarado: registro.montoPagado,
      medioPago: "TRANSFERENCIA" as MedioPago,
      tipoOperacion: "TRANSFERENCIA_BANCARIA" as TipoOperacion,
      timestamp: registro.fechaPago ?? fmtFull(now),
      estado: "aprobado" as PagoEstado,
      externalReference: null,
    };
    pagos.push(pago);
  }
  return pagos;
}

// ===== Datos mock =====
export const lotesMock: Lote[] = [];
export const registrosMock: RegistroDeLote[] = [];
export const pagosMock: Pago[] = [];
export const cbusMock: CBURecord[] = cbuPool;

function addLote(
  id: string,
  nombre: string,
  periodo: string,
  diasAtras: number,
  estado: LoteEstado,
  tasaInteres: number,
  mediosPago: MedioPago[],
  pagosParciales: boolean,
  cantidadRegistros: number,
  montoBase: number,
  procesamientoDaysAgo: number | null,
  finalizedDaysAgo: number | null,
  vencimiento1Offset: number,
  vencimiento2Offset: number | null,
  vencimiento3Offset: number | null,
) {
  const created = subDays(now, diasAtras);
  const procesamiento =
    procesamientoDaysAgo !== null ? subDays(now, procesamientoDaysAgo) : addDays(created, 1);

  const lote: Lote = {
    id,
    nombre,
    periodo,
    diaProcesamiento: fmt(procesamiento),
    estado,
    tasaInteres,
    fechaVencimiento1: fmt(addDays(created, vencimiento1Offset)),
    fechaVencimiento2:
      vencimiento2Offset !== null ? fmt(addDays(created, vencimiento2Offset)) : null,
    fechaVencimiento3:
      vencimiento3Offset !== null ? fmt(addDays(created, vencimiento3Offset)) : null,
    mediosPago,
    pagosParcialesHabilitado: pagosParciales,
    notificacionesHabilitado: Math.random() < 0.5,
    createdAt: fmtFull(created),
    fechaInicio: estado !== "cargado" && estado !== "pausado" ? fmtFull(procesamiento) : null,
    fechaFinalizacion:
      estado === "finalizado" && finalizedDaysAgo !== null
        ? fmtFull(subDays(now, finalizedDaysAgo))
        : null,
  };
  lotesMock.push(lote);

  const config = {
    fechaVencimiento1: lote.fechaVencimiento1,
    fechaVencimiento2: lote.fechaVencimiento2,
    fechaVencimiento3: lote.fechaVencimiento3,
    mediosPago,
    pagosParciales,
    tasaInteres,
  };

  const registros = generarRegistros(
    id,
    cantidadRegistros * -1,
    cantidadRegistros,
    montoBase,
    config,
  );
  registrosMock.push(...registros);

  for (const r of registros) {
    const p = generarPagos(r);
    pagosMock.push(...p);
  }
}

// Lotes finalizados
addLote(
  "LOT-001",
  "Expensas Noviembre 2025",
  "2025-11",
  210,
  "finalizado",
  10,
  ["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO"],
  true,
  128,
  48200,
  208,
  195,
  10,
  25,
  45,
);
addLote(
  "LOT-002",
  "Expensas Diciembre 2025",
  "2025-12",
  180,
  "finalizado",
  10,
  ["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO"],
  true,
  124,
  48200,
  178,
  165,
  10,
  25,
  45,
);
addLote(
  "LOT-003",
  "Expensas Enero 2026",
  "2026-01",
  150,
  "finalizado",
  10,
  ["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO"],
  true,
  126,
  52800,
  148,
  135,
  10,
  25,
  45,
);
addLote(
  "LOT-004",
  "Expensas Febrero 2026",
  "2026-02",
  120,
  "finalizado",
  10,
  ["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO"],
  true,
  130,
  52800,
  118,
  105,
  10,
  25,
  45,
);

// Lotes en proceso
addLote(
  "LOT-005",
  "Expensas Marzo 2026",
  "2026-03",
  90,
  "en_proceso",
  10,
  ["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO", "QR"],
  true,
  128,
  48200,
  88,
  null,
  10,
  25,
  45,
);
addLote(
  "LOT-006",
  "Cuotas Socios Marzo 2026",
  "2026-03",
  85,
  "en_proceso",
  5,
  ["TRANSFERENCIA", "QR"],
  false,
  86,
  15000,
  83,
  null,
  10,
  25,
  45,
);

// Lote finalizado (alquileres)
addLote(
  "LOT-007",
  "Alquileres Marzo 2026",
  "2026-03",
  88,
  "finalizado",
  8,
  ["TRANSFERENCIA"],
  false,
  42,
  320000,
  86,
  75,
  5,
  15,
  35,
);

// Lotes cargados/pendientes
addLote(
  "LOT-008",
  "Expensas Abril 2026",
  "2026-04",
  20,
  "cargado",
  10,
  ["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO", "QR"],
  true,
  128,
  48200,
  null,
  null,
  10,
  25,
  45,
);
addLote(
  "LOT-009",
  "Cuotas Sociales Abril 2026",
  "2026-04",
  18,
  "cargado",
  5,
  ["TRANSFERENCIA", "TARJETA_CREDITO"],
  false,
  90,
  18000,
  null,
  null,
  10,
  null,
  null,
);

// Lote pausado
addLote(
  "LOT-010",
  "Expensas Mayo 2026",
  "2026-05",
  5,
  "pausado",
  10,
  ["TRANSFERENCIA", "QR"],
  true,
  0,
  48200,
  null,
  null,
  14,
  28,
  48,
);

// Lote con error
addLote(
  "LOT-011",
  "Mantenimiento Edificio 7",
  "2026-03",
  60,
  "error",
  0,
  ["TRANSFERENCIA"],
  false,
  18,
  25000,
  58,
  null,
  5,
  null,
  null,
);

// Lote cargado (nuevo)
addLote(
  "LOT-012",
  "Expensas Junio 2026",
  "2026-06",
  2,
  "cargado",
  10,
  ["TRANSFERENCIA", "TARJETA_CREDITO", "TARJETA_DEBITO", "QR"],
  true,
  128,
  52800,
  null,
  null,
  12,
  26,
  46,
);

export const lotes = lotesMock;
export const registros = registrosMock;
export const pagos = pagosMock;
export const cbus = cbusMock;

// ===== Helpers de filtrado y cálculo =====
export interface PeriodFilter {
  label: string;
  from: Date;
  to: Date;
}

export function periodFilter(label: string, days?: number, from?: Date, to?: Date): PeriodFilter {
  if (days !== undefined) return { label, from: subDays(now, days), to: now };
  return { label, from: from!, to: to! };
}

function parseDate(s: string): Date {
  try {
    return parseISO(s);
  } catch {
    return new Date();
  }
}

function filterLotes(filter: PeriodFilter): Lote[] {
  return lotesMock.filter((l) => {
    const d = parseDate(l.createdAt);
    return d >= filter.from && d <= filter.to;
  });
}

// Para filtros de dashboard: aplica sobre lotes que tienen registros en el periodo
function filterRegistrosDirect(filter: PeriodFilter): RegistroDeLote[] {
  return registrosMock.filter((r) => {
    const d = parseDate(r.createdAt);
    return d >= filter.from && d <= filter.to;
  });
}

// ===== Dashboard KPIs =====
export interface DashboardKPI {
  totalLotes: number;
  enProceso: number;
  finalizados: number;
  conError: number;
  montoTotal: number;
  montoCobrado: number;
  montoPendiente: number;
}

export function computeDashboardKPI(filter: PeriodFilter): DashboardKPI {
  const lotesFiltrados = filterLotes(filter);
  const lotesValidos = lotesFiltrados.filter((l) => l.estado !== "eliminado");

  return {
    totalLotes: lotesValidos.length,
    enProceso: lotesValidos.filter((l) => l.estado === "en_proceso").length,
    finalizados: lotesValidos.filter((l) => l.estado === "finalizado").length,
    conError: lotesValidos.filter((l) => l.estado === "error").length,
    montoTotal: lotesValidos.reduce((sum, l) => {
      const regs = registrosMock.filter((r) => r.loteId === l.id);
      return sum + regs.reduce((s, r) => s + r.monto, 0);
    }, 0),
    montoCobrado: lotesValidos.reduce((sum, l) => {
      const regs = registrosMock.filter((r) => r.loteId === l.id);
      return sum + regs.reduce((s, r) => s + r.montoPagado, 0);
    }, 0),
    montoPendiente: lotesValidos.reduce((sum, l) => {
      const regs = registrosMock.filter((r) => r.loteId === l.id);
      return sum + regs.reduce((s, r) => s + (r.monto - r.montoPagado), 0);
    }, 0),
  };
}

// ===== Cobros por medio de pago =====
export interface MedioPagoData {
  medio: string;
  monto: number;
  cantidad: number;
  porcentaje: number;
}

export function computePorMedio(filter: PeriodFilter): MedioPagoData[] {
  const lotesFiltrados = filterLotes(filter);
  const loteIds = new Set(lotesFiltrados.map((l) => l.id));
  const pagosFiltrados = pagosMock.filter((p) => loteIds.has(p.loteId) && p.estado === "aprobado");

  const grouped: Record<string, { monto: number; cantidad: number }> = {};
  for (const p of pagosFiltrados) {
    if (!grouped[p.medioPago]) grouped[p.medioPago] = { monto: 0, cantidad: 0 };
    grouped[p.medioPago].monto += p.monto;
    grouped[p.medioPago].cantidad += 1;
  }

  const total = Object.values(grouped).reduce((s, g) => s + g.monto, 0);
  return Object.entries(grouped).map(([medio, data]) => ({
    medio,
    monto: data.monto,
    cantidad: data.cantidad,
    porcentaje: total > 0 ? Math.round((data.monto / total) * 100) : 0,
  }));
}

// ===== Cobros por vencimiento =====
export interface VencimientoData {
  label: string;
  cantidad: number;
  monto: number;
}

export function computePorVencimiento(filter: PeriodFilter): VencimientoData[] {
  const lotesFiltrados = filterLotes(filter);
  const loteIds = new Set(lotesFiltrados.map((l) => l.id));
  const regs = registrosMock.filter((r) => loteIds.has(r.loteId) && r.montoPagado > 0);

  const result: VencimientoData[] = [
    { label: "1er vencimiento", cantidad: 0, monto: 0 },
    { label: "2do vencimiento", cantidad: 0, monto: 0 },
    { label: "3er vencimiento", cantidad: 0, monto: 0 },
  ];

  for (const r of regs) {
    if (!r.fechaPago) continue;
    const fp = parseDate(r.fechaPago);
    const v1 = r.fechaVencimiento1 ? parseDate(r.fechaVencimiento1) : null;
    const v2 = r.fechaVencimiento2 ? parseDate(r.fechaVencimiento2) : null;
    const v3 = r.fechaVencimiento3 ? parseDate(r.fechaVencimiento3) : null;

    if (v1 && fp <= v1) {
      result[0].cantidad += 1;
      result[0].monto += r.montoPagado;
    } else if (v2 && fp <= v2) {
      result[1].cantidad += 1;
      result[1].monto += r.montoPagado;
    } else if (v3 && fp <= v3) {
      result[2].cantidad += 1;
      result[2].monto += r.montoPagado;
    } else if (v1 && !v2) {
      result[0].cantidad += 1;
      result[0].monto += r.montoPagado;
    }
  }

  return result;
}

// ===== Operaciones no cobradas =====
export interface NoCobradasData {
  totalOperaciones: number;
  vencidas: number;
  vigentes: number;
  montoNoCobrado: number;
  porcentajeNoCobrado: number;
}

export function computeNoCobradas(filter: PeriodFilter): NoCobradasData {
  const lotesFiltrados = filterLotes(filter);
  const loteIds = new Set(lotesFiltrados.map((l) => l.id));
  const regs = registrosMock.filter((r) => loteIds.has(r.loteId));

  const noCobradas = regs.filter((r) => r.estado !== "pagado_total");
  const vencidas = noCobradas.filter((r) => r.estado === "vencido");
  const vigentes = noCobradas.filter((r) => r.estado !== "vencido");

  const montoTotal = regs.reduce((s, r) => s + r.monto, 0);
  const montoNoCobrado = noCobradas.reduce((s, r) => s + (r.monto - r.montoPagado), 0);

  return {
    totalOperaciones: regs.length,
    vencidas: vencidas.length,
    vigentes: vigentes.length,
    montoNoCobrado,
    porcentajeNoCobrado: montoTotal > 0 ? Math.round((montoNoCobrado / montoTotal) * 100) : 0,
  };
}

// ===== Evolución de pagos =====
export interface EvolucionData {
  fecha: string;
  monto: number;
  cantidad: number;
}

export function computeEvolucion(filter: PeriodFilter): EvolucionData[] {
  const pagosFiltrados = pagosMock.filter((p) => {
    const d = parseDate(p.timestamp);
    return d >= filter.from && d <= filter.to;
  });

  const grouped: Record<string, { monto: number; cantidad: number }> = {};
  for (const p of pagosFiltrados) {
    const day = format(parseDate(p.timestamp), "dd/MM");
    if (!grouped[day]) grouped[day] = { monto: 0, cantidad: 0 };
    grouped[day].monto += p.monto;
    grouped[day].cantidad += 1;
  }

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, data]) => ({ fecha, ...data }));
}

// ===== Lotes recientes para dashboard =====
export interface LoteResumen {
  id: string;
  nombre: string;
  estado: LoteEstado;
  progreso: number;
  montoTotal: number;
  montoCobrado: number;
  cantidadPagos: number;
  cantidadParciales: number;
  cantidadPendientes: number;
  createdAt: string;
}

export function computeLotesRecientes(filter: PeriodFilter): LoteResumen[] {
  return filterLotes(filter)
    .filter((l) => l.estado !== "eliminado")
    .map((l) => {
      const regs = registrosMock.filter((r) => r.loteId === l.id);
      const total = regs.length;
      const cobrados = regs.filter((r) => r.estado === "pagado_total").length;
      const parciales = regs.filter((r) => r.estado === "pagado_parcial").length;
      const pendientes = regs.filter(
        (r) => r.estado === "pendiente" || r.estado === "vencido",
      ).length;
      const montoTotal = regs.reduce((s, r) => s + r.monto, 0);
      const montoCobrado = regs.reduce((s, r) => s + r.montoPagado, 0);

      return {
        id: l.id,
        nombre: l.nombre,
        estado: l.estado,
        progreso: total > 0 ? Math.round((montoCobrado / montoTotal) * 100) : 0,
        montoTotal,
        montoCobrado,
        cantidadPagos: cobrados,
        cantidadParciales: parciales,
        cantidadPendientes: pendientes,
        createdAt: l.createdAt,
      };
    })
    .sort((a, b) => parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime());
}

// ===== Gestión de lotes (listado completo) =====
export interface LoteGestionRow {
  id: string;
  nombre: string;
  periodo: string;
  createdAt: string;
  fechaFinalizacion: string | null;
  estado: LoteEstado;
  progreso: number;
  cantidadPagos: number;
  cantidadParciales: number;
  cantidadPendientes: number;
  montoTotal: number;
  montoCobrado: number;
  montoPorCobrar: number;
}

export function getLotesGestion(): LoteGestionRow[] {
  return lotesMock
    .filter((l) => l.estado !== "eliminado")
    .map((l) => {
      const regs = registrosMock.filter((r) => r.loteId === l.id);
      const total = regs.length;
      const cobrados = regs.filter((r) => r.estado === "pagado_total").length;
      const parciales = regs.filter((r) => r.estado === "pagado_parcial").length;
      const pendientes = regs.filter(
        (r) => r.estado === "pendiente" || r.estado === "vencido",
      ).length;
      const montoTotal = regs.reduce((s, r) => s + r.monto, 0);
      const montoCobrado = regs.reduce((s, r) => s + r.montoPagado, 0);

      return {
        id: l.id,
        nombre: l.nombre,
        periodo: l.periodo,
        createdAt: l.createdAt,
        fechaFinalizacion: l.fechaFinalizacion,
        estado: l.estado,
        progreso: montoTotal > 0 ? Math.round((montoCobrado / montoTotal) * 100) : 0,
        cantidadPagos: cobrados,
        cantidadParciales: parciales,
        cantidadPendientes: pendientes,
        montoTotal,
        montoCobrado,
        montoPorCobrar: montoTotal - montoCobrado,
      };
    })
    .sort((a, b) => parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime());
}

export function getLoteById(id: string): Lote | undefined {
  return lotesMock.find((l) => l.id === id);
}

export function getRegistrosByLoteId(loteId: string): RegistroDeLote[] {
  return registrosMock.filter((r) => r.loteId === loteId);
}

export function getPagosByRegistroId(registroId: string): Pago[] {
  return pagosMock.filter((p) => p.registroId === registroId);
}

export function getCBUById(id: string): CBURecord | undefined {
  return cbuPool.find((c) => c.id === id);
}

export function getCBUByEntidad(tipo: string, id: string, sub: string): CBURecord | undefined {
  return cbuPool.find((c) => c.tipoEntidad === tipo && c.idEntidad === id && c.subEntidad === sub);
}

// ===== Catálogo de estados =====
export const estadoCatalogo: Record<LoteEstado, { label: string; desc: string }> = {
  cargado: {
    label: "Cargado / Pendiente",
    desc: "El lote fue creado y validado, pero aún no llegó la fecha de procesamiento automático; no se generaron links de pago todavía.",
  },
  en_proceso: {
    label: "En proceso",
    desc: "El lote ya se ejecutó (se generaron los links) pero no todos los pagos fueron efectuados.",
  },
  finalizado: {
    label: "Finalizado",
    desc: "Todos los pagos del lote fueron efectuados en su totalidad.",
  },
  pausado: {
    label: "Pausado",
    desc: "El lote fue pausado manualmente; detiene el avance del procesamiento.",
  },
  eliminado: {
    label: "Eliminado",
    desc: "El lote fue eliminado (soft delete).",
  },
  error: {
    label: "Con error / requiere atención",
    desc: "Ocurrió un fallo técnico durante el procesamiento que impide completar la generación de links o el cobro.",
  },
};

export const medioPagoLabels: Record<MedioPago, string> = {
  TRANSFERENCIA: "Transferencia",
  TARJETA_CREDITO: "Tarjeta de crédito",
  TARJETA_DEBITO: "Tarjeta de débito",
  QR: "Código QR",
};

// ===== Función para iniciar lote manualmente =====
export function iniciarLote(loteId: string): boolean {
  const lote = lotesMock.find((l) => l.id === loteId);
  if (!lote || lote.estado !== "cargado") return false;
  lote.estado = "en_proceso";
  lote.fechaInicio = fmtFull(now);
  const regs = registrosMock.filter((r) => r.loteId === loteId);
  for (const r of regs) {
    if (r.estado === "pendiente") {
      r.linkDePago = `https://pay.molly.com.ar/l/${generateId("LNK").toLowerCase()}`;
    }
  }
  return true;
}

export function pausarLote(loteId: string): boolean {
  const lote = lotesMock.find((l) => l.id === loteId);
  if (!lote || lote.estado !== "en_proceso") return false;
  lote.estado = "pausado";
  return true;
}

export function reanudarLote(loteId: string): boolean {
  const lote = lotesMock.find((l) => l.id === loteId);
  if (!lote || lote.estado !== "pausado") return false;
  lote.estado = "en_proceso";
  return true;
}

export function eliminarLote(loteId: string): boolean {
  const lote = lotesMock.find((l) => l.id === loteId);
  if (!lote) return false;
  lote.estado = "eliminado";
  return true;
}
