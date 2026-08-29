import { subDays } from "date-fns";

export interface Product {
  id: string;
  name: string;
  qty: number;
  price: number;
  desc?: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  category: "credit" | "debit";
  enabled: boolean;
}

export interface PaymentLink {
  id: string;
  url: string;
  products: Product[];
  status: "Activo" | "Inactivo" | "Vencido";
  partialPayments: boolean;
  methods: string[];
  reference?: string;
  notes?: string;
  createdAt: string;
  expiresAt?: string;
  views: number;
  payments: number;
}

export interface TxItem {
  date: string;
  id: string;
  product: string;
  amount: number;
  method: string;
  status: "Aprobado" | "Pendiente" | "Rechazado" | "Reembolsado";
}

export interface DashboardMetrics {
  totalApproved: number;
  totalTx: number;
  pending: number;
  rejected: number;
  refunds: number;
  conversionRate: number;
  avgTicket: number;
}

export interface PeriodFilter {
  label: string;
  from: Date;
  to: Date;
}

export const paymentMethods: PaymentMethod[] = [
  { id: "visa-cred", label: "Visa Crédito", category: "credit", enabled: true },
  { id: "mc-cred", label: "Mastercard Crédito", category: "credit", enabled: true },
  { id: "amex", label: "American Express", category: "credit", enabled: true },
  { id: "cabal-cred", label: "Cabal Crédito", category: "credit", enabled: true },
  { id: "naranja", label: "Naranja X", category: "credit", enabled: true },
  { id: "diners", label: "Diners Club", category: "credit", enabled: false },
  { id: "visa-deb", label: "Visa Débito", category: "debit", enabled: true },
  { id: "mc-deb", label: "Mastercard Débito", category: "debit", enabled: true },
  { id: "cabal-deb", label: "Cabal Débito", category: "debit", enabled: true },
  { id: "maestro", label: "Maestro", category: "debit", enabled: true },
];

const now = new Date();

export const mockProducts: Product[] = [
  { id: "p1", name: "Suscripción Premium", qty: 1, price: 29900, desc: "Plan mensual premium" },
  { id: "p2", name: "Consultoría inicial", qty: 1, price: 85000, desc: "Sesión de 2 horas" },
  { id: "p3", name: "Curso Marketing Digital", qty: 20, price: 4500, desc: "Acceso por 6 meses" },
  { id: "p4", name: "Kit bienvenida", qty: 5, price: 12000 },
  { id: "p5", name: "Mantenimiento mensual", qty: 1, price: 18000, desc: "Soporte técnico" },
  { id: "p6", name: "Licencia Enterprise", qty: 3, price: 120000 },
];

export const mockLinks: PaymentLink[] = [
  {
    id: "LNK-001",
    url: "https://pay.molly.com.ar/l/abc123",
    products: [mockProducts[0], mockProducts[1]],
    status: "Activo",
    partialPayments: false,
    methods: ["visa-cred", "mc-cred", "visa-deb"],
    reference: "FACT-0034",
    createdAt: "10/07/2026",
    expiresAt: "10/08/2026",
    views: 12,
    payments: 3,
  },
  {
    id: "LNK-002",
    url: "https://pay.molly.com.ar/l/def456",
    products: [mockProducts[2]],
    status: "Activo",
    partialPayments: true,
    methods: ["visa-cred", "mc-cred", "amex", "visa-deb", "mc-deb"],
    reference: "CURSO-MKT",
    notes: "Enviar link por email",
    createdAt: "08/07/2026",
    views: 45,
    payments: 8,
  },
  {
    id: "LNK-003",
    url: "https://pay.molly.com.ar/l/ghi789",
    products: [mockProducts[3]],
    status: "Inactivo",
    partialPayments: false,
    methods: ["visa-cred", "mc-cred"],
    createdAt: "05/07/2026",
    views: 3,
    payments: 0,
  },
  {
    id: "LNK-004",
    url: "https://pay.molly.com.ar/l/jkl012",
    products: [mockProducts[4]],
    status: "Vencido",
    partialPayments: false,
    methods: ["visa-cred", "mc-cred", "visa-deb"],
    createdAt: "01/06/2026",
    expiresAt: "01/07/2026",
    views: 32,
    payments: 5,
  },
];

export const mockTx: TxItem[] = [
  {
    date: "Hoy 10:23",
    id: "TXN-001",
    product: "Suscripción Premium",
    amount: 29900,
    method: "Visa Crédito",
    status: "Aprobado",
  },
  {
    date: "Hoy 09:45",
    id: "TXN-002",
    product: "Curso Marketing Digital",
    amount: 4500,
    method: "Mastercard Débito",
    status: "Aprobado",
  },
  {
    date: "Ayer 18:30",
    id: "TXN-003",
    product: "Consultoría inicial",
    amount: 85000,
    method: "Visa Débito",
    status: "Aprobado",
  },
  {
    date: "Ayer 14:12",
    id: "TXN-004",
    product: "Licencia Enterprise",
    amount: 120000,
    method: "American Express",
    status: "Pendiente",
  },
  {
    date: "Ayer 11:05",
    id: "TXN-005",
    product: "Kit bienvenida",
    amount: 12000,
    method: "Mastercard Crédito",
    status: "Aprobado",
  },
  {
    date: "08/07/2026",
    id: "TXN-006",
    product: "Suscripción Premium",
    amount: 29900,
    method: "Visa Débito",
    status: "Rechazado",
  },
  {
    date: "07/07/2026",
    id: "TXN-007",
    product: "Curso Marketing Digital",
    amount: 4500,
    method: "Naranja X",
    status: "Reembolsado",
  },
  {
    date: "06/07/2026",
    id: "TXN-008",
    product: "Mantenimiento mensual",
    amount: 18000,
    method: "Mastercard Crédito",
    status: "Aprobado",
  },
  {
    date: "05/07/2026",
    id: "TXN-009",
    product: "Consultoría inicial",
    amount: 85000,
    method: "Visa Crédito",
    status: "Aprobado",
  },
  {
    date: "04/07/2026",
    id: "TXN-010",
    product: "Licencia Enterprise",
    amount: 120000,
    method: "American Express",
    status: "Aprobado",
  },
  {
    date: "03/07/2026",
    id: "TXN-011",
    product: "Kit bienvenida",
    amount: 12000,
    method: "Mastercard Débito",
    status: "Pendiente",
  },
  {
    date: "02/07/2026",
    id: "TXN-012",
    product: "Suscripción Premium",
    amount: 29900,
    method: "Visa Crédito",
    status: "Rechazado",
  },
  {
    date: "01/07/2026",
    id: "TXN-013",
    product: "Curso Marketing Digital",
    amount: 4500,
    method: "Visa Débito",
    status: "Aprobado",
  },
  {
    date: "30/06/2026",
    id: "TXN-014",
    product: "Mantenimiento mensual",
    amount: 18000,
    method: "Mastercard Crédito",
    status: "Reembolsado",
  },
  {
    date: "28/06/2026",
    id: "TXN-015",
    product: "Consultoría inicial",
    amount: 85000,
    method: "American Express",
    status: "Aprobado",
  },
];

export const integrationPlatforms = [
  {
    id: "tiendanube",
    name: "Tiendanube",
    connected: true,
    since: "15/03/2026",
    products: 34,
    logo: "Nuv",
  },
  { id: "shopify", name: "Shopify", connected: false, logo: "Shp" },
  { id: "woocommerce", name: "WooCommerce", connected: false, logo: "Woo" },
];

export function periodFilter(label: string, days?: number, from?: Date, to?: Date): PeriodFilter {
  if (days !== undefined) return { label, from: subDays(now, days), to: now };
  return { label, from: from!, to: to! };
}

export function computeMetrics(filter: PeriodFilter): DashboardMetrics {
  const filtered = mockTx.filter((t) => {
    const d = parseDate(t.date);
    return d >= filter.from && d <= filter.to;
  });
  const total = filtered.length;
  const approved = filtered.filter((t) => t.status === "Aprobado").length;
  const approvedAmount = filtered
    .filter((t) => t.status === "Aprobado")
    .reduce((s, t) => s + t.amount, 0);
  return {
    totalApproved: approvedAmount,
    totalTx: total,
    pending: filtered.filter((t) => t.status === "Pendiente").length,
    rejected: filtered.filter((t) => t.status === "Rechazado").length,
    refunds: filtered.filter((t) => t.status === "Reembolsado").length,
    conversionRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    avgTicket: approved > 0 ? Math.round(approvedAmount / approved) : 0,
  };
}

export function byMethod(filter: PeriodFilter): Record<string, { amount: number; count: number }> {
  const grouped: Record<string, { amount: number; count: number }> = {};
  mockTx
    .filter((t) => {
      const d = parseDate(t.date);
      return d >= filter.from && d <= filter.to;
    })
    .forEach((t) => {
      if (!grouped[t.method]) grouped[t.method] = { amount: 0, count: 0 };
      grouped[t.method].amount += t.amount;
      grouped[t.method].count += 1;
    });
  return grouped;
}

export function byStatus(filter: PeriodFilter): Record<string, number> {
  const counts: Record<string, number> = {
    Aprobado: 0,
    Pendiente: 0,
    Rechazado: 0,
    Reembolsado: 0,
  };
  mockTx
    .filter((t) => {
      const d = parseDate(t.date);
      return d >= filter.from && d <= filter.to;
    })
    .forEach((t) => {
      counts[t.status] += 1;
    });
  return counts;
}

function parseDate(s: string): Date {
  if (s.includes("Hoy") || s.includes("Ayer")) return new Date();
  const [dd, mm, yyyy] = s.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export function formatARS(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(n);
}

export function generateId(): string {
  return "LNK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}
