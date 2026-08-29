## Alcance
Construir el flujo completo de onboarding de MoliPay para Persona Física (Rama A) y Persona Jurídica (Rama B), respetando la identidad visual premium de la landing (navy `#0A1628`, bronce `#B08D57`, rojo primario `#C41E3A`, Fraunces/IBM Plex Mono) y el layout split‑screen (panel izquierdo institucional + panel derecho con formulario).

## Estructura de rutas (TanStack file-based, bajo `src/routes/onboarding.*`)

```text
/registro                      → elección PF (ya existe botón landing)
/registro/empresa              → B1
/registro/exito                → A2/B2 (query ?email=&tipo=)
/registro/validar-email        → email simulado con botón "Validar desde aquí"
/registro/validacion-exitosa   → A3/B3
/login                         → A4/B4
/onboarding/datos-personales   → A5/B5 wizard 3 pasos
/onboarding/datos-empresa      → B6 wizard 2 pasos (solo PJ)
/onboarding/kyc                → A6/B7 wizard 4 pasos
/onboarding/en-proceso         → A7/B8
/app                           → dashboard simple ya existente
```

`/registro` (PF) mantiene su nombre actual; B1 vive en `/registro/empresa`. Cada ruta lleva `head()` propio con title y description específicos y `robots: noindex` (flujo privado).

## Layout compartido `<AuthShell>`
Componente `src/components/onboarding/auth-shell.tsx`:
- Grid `lg:grid-cols-[minmax(0,42%)_1fr]`, mobile: solo panel derecho (el izquierdo se colapsa a una franja superior con logo + mensaje corto).
- Panel izquierdo: fondo navy `#0A1628`, motivo lineal SVG de "red de pagos" (líneas finas bronce con nodos), badge regulatorio ("Registrado ante BCRA"), copy contextual por paso (prop `leftMessage`) en IBM Plex Mono, y footer legal mini.
- Panel derecho: fondo `#F7F5F0` (paper), card centrada `max-w-[460px]`, hairline `1px solid rgba(10,22,40,0.08)`, sin sombra pesada. Header con logo Moli + link "¿Necesitas ayuda?".

## Componentes reutilizables (`src/components/onboarding/`)
- `Stepper` — pasos con estado done/current/future (check verde, número rojo activo, gris futuro).
- `FormField` — label azul semibold + input hairline + helper/error gris/rojo.
- `PasswordField` — con toggle 👁 y validación en tiempo real (≥8, mayúscula, número, especial), muestra checks verdes por regla.
- `FileUpload` — drag & drop, ícono cámara, acepta jpg/png/pdf, preview con nombre + botón "Reemplazar", tamaño máx 8 MB.
- `PrimaryButton` (rojo), `SecondaryButton` (outline navy), `WizardNav` (ATRÁS / SIGUIENTE).
- `SuccessCard` — check verde grande, título, texto, CTA.

## Estado global
`src/lib/onboarding-store.ts` — Zustand con persist a `localStorage` (`molipay-onboarding`):
```ts
{ tipoCuenta: 'fisica' | 'juridica',
  registro: { nombre, apellido, fechaNac, email },
  datosPersonales: { genero, cuitCuil, ocupacion, origenFondos, esPEP },
  datosEmpresa: { cuit, fechaInscripcion, tipoId, nombreLegal, nombreFantasia },
  kyc: { dniFrente, dniDorso, servicio, selfie, direccion, direccion2, ciudad, provincia, cp },
  emailValidado: boolean, aprobado: boolean,
  setTipo, setPaso, reset }
```
Archivos se guardan como object URLs + nombre (no persistimos el blob).

## Validación
Zod schemas por paso en `src/lib/onboarding-schemas.ts`. `react-hook-form` + `zodResolver`. Botón "SIGUIENTE" deshabilitado hasta que el schema pase. CUIT/CUIL regex `^\d{2}-?\d{8}-?\d{1}$` con dígito verificador opcional.

## Detalle por pantalla
Cada pantalla usa `<AuthShell leftMessage={...}>` y sigue el prompt literalmente:
- **A1/B1**: form con los 6 campos + checkbox T&C + helper de password + links cruzados PF↔PJ. Submit → guarda en store → navega a `/registro/exito`.
- **A2/B2**: `SuccessCard` + link "reenviar correo" + botón "IR A INICIO DE SESIÓN" + botón demo "Ver email de validación" → `/registro/validar-email`.
- **Email simulado**: card con marco de mail, saludo con `{nombre}`, botón "Validar desde aquí" → marca `emailValidado=true` → `/registro/validacion-exitosa`.
- **A3/B3**: `SuccessCard` → login.
- **A4/B4 Login**: al submit, si `tipoCuenta` y no completó datos → `/onboarding/datos-personales`; si PJ y falta empresa → `/onboarding/datos-empresa`; si falta KYC → `/onboarding/kyc`; si aprobado → `/app`.
- **A5/B5 wizard 3 pasos**: Datos personales, Información financiera, Validación final (toggle PEP + texto legal en gris/azul).
- **B6 wizard 2 pasos** (solo PJ, condicionado por `tipoCuenta==='juridica'`): datos empresa + confirmación read‑only.
- **A6/B7 wizard 4 pasos KYC**: DNI frente/dorso, servicio, selfie, residencia.
- **A7/B8**: `SuccessCard` "Validación en proceso" + botón demo "Simular aprobación" (visible siempre en el prototipo) → marca `aprobado=true` → `/app`.

## Landing
Actualizar los tres botones del header/landing para apuntar a `/login`, `/registro`, `/registro/empresa` (ya están, verificar destinos). Sin otros cambios a la landing.

## Accesibilidad y responsive
- Focus ring visible en todos los inputs y botones.
- Contraste WCAG AA en navy/paper/crimson (ya validado en landing).
- Mobile: panel izquierdo se convierte en franja superior compacta (logo + una línea de copy); wizard stepper se vuelve horizontal scrollable pero legible; uploads full width.

## Fuera de alcance (no tocar)
- Dashboard `/app/*` existente salvo el mensaje de bienvenida.
- Autenticación real / backend / envío de emails (todo simulado en el store).
- Otros textos y estilos de la landing.

## Detalles técnicos
- Nuevas dependencias: `zustand` y `react-hook-form` + `@hookform/resolvers` (zod ya presente). Instalar con `bun add` antes de importar.
- Cada ruta nueva: `createFileRoute` con path exacto + `head()` con noindex.
- Datepicker: shadcn Popover + Calendar con `pointer-events-auto`.
- Selects: shadcn `Select` con opciones fijas (género, ocupación, origen de fondos, tipo de sociedad, provincia argentina).
- Object URLs de uploads se revocan en `beforeunload` para evitar leaks.
