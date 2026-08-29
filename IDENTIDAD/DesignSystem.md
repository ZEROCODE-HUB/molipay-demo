# Sistema de Diseño — MOLI (MollyPay)

> Basado en el Manual de Identidad de Marca MOLI y `BrandRules.md`.
> Donde la información es inferida, se indica con _(por inferencia)_ y se mantiene coherente con el lenguaje visual de la marca: moderno, elegante, minimalista.

---

## 1. Design Tokens

```css
:root {
  /* ════════════════════════════════════════
     COLORS — PALETA PRINCIPAL
     ════════════════════════════════════════ */

  /* Primarios (extraídos de la marca) */
  --color-black:              #000000;
  --color-red:                #D3001F;
  --color-navy:               #324595;
  --color-plata:              #CECECE;
  --color-white:              #FFFFFF;

  /* Negro — escala */
  --color-black-900:          #000000;
  --color-black-800:          #1A1A1A;
  --color-black-700:          #2E2E2E;
  --color-black-600:          #474747;
  --color-black-500:          #5E5E5E;
  --color-black-400:          #767676;
  --color-black-300:          #909090;
  --color-black-200:          #B3B3B3;
  --color-black-100:          #D4D4D4;
  --color-black-50:           #F0F0F0;

  /* Rojo — escala */
  --color-red-700:            #8B0014;
  --color-red-600:            #AD0019;
  --color-red-500:            #D3001F;
  --color-red-400:            #E6394F;
  --color-red-300:            #F06A7A;
  --color-red-200:            #F5A0AA;
  --color-red-100:            #FCD3D8;
  --color-red-50:             #FFF0F1;

  /* Navy — escala */
  --color-navy-700:           #1A235A;
  --color-navy-600:           #26327A;
  --color-navy-500:           #324595;
  --color-navy-400:           #5066B5;
  --color-navy-300:           #7B8ECC;
  --color-navy-200:           #A9B6E1;
  --color-navy-100:           #D4DBF3;
  --color-navy-50:            #EDF0FA;

  /* Plata — escala */
  --color-plata-600:          #8A8A8A;
  --color-plata-500:          #A8A8A8;
  --color-plata-400:          #CECECE;
  --color-plata-300:          #DEDEDE;
  --color-plata-200:          #EBEBEB;
  --color-plata-100:          #F5F5F5;
  --color-plata-50:           #FAFAFA;


  /* ════════════════════════════════════════
     COLORS — SEMÁNTICA (estados)
     ════════════════════════════════════════ */

  --color-success:            #1E8E3E;
  --color-success-bg:         #E6F4EA;
  --color-success-border:     #A8DAB5;

  --color-error:              #D3001F;
  --color-error-bg:           #FDE8EA;
  --color-error-border:       #F5A0AA;

  --color-warning:            #E37B1A;
  --color-warning-bg:         #FFF3E0;
  --color-warning-border:     #FFCC80;

  --color-info:               #324595;
  --color-info-bg:            #EDF0FA;
  --color-info-border:        #A9B6E1;


  /* ════════════════════════════════════════
     TYPOGRAPHY
     ════════════════════════════════════════ */

  --font-primary:             'Josefin Sans', 'Segoe UI', sans-serif;
  --font-secondary:           'Null Free', 'Georgia', serif;
  --font-mono:                'SF Mono', 'Fira Code', monospace;

  /* Display / Hero */
  --text-display-size:        56px;
  --text-disktop-line-height: 1.1;

  /* Headings */
  --text-h1-size:             44px;
  --text-h1-line-height:      1.15;

  --text-h2-size:             34px;
  --text-h2-line-height:      1.2;

  --text-h3-size:             26px;
  --text-h3-line-height:      1.25;

  --text-h4-size:             20px;
  --text-h4-line-height:      1.3;

  --text-h5-size:             18px;
  --text-h5-line-height:      1.35;

  --text-h6-size:             16px;
  --text-h6-line-height:      1.4;

  /* Body */
  --text-body-lg-size:        18px;
  --text-body-size:           16px;
  --text-body-sm-size:        14px;

  /* Caption / Label */
  --text-caption-size:        12px;
  --text-caption-line-height: 1.4;

  --text-small-size:          11px;
  --text-overline-size:       10px;

  /* Font weights */
  --weight-thin:              100;
  --weight-light:             300;
  --weight-regular:           400;
  --weight-semibold:          600;
  --weight-bold:              700;


  /* ════════════════════════════════════════
     SPACING (escala 8px + 4px)
     ════════════════════════════════════════ */

  --space-2:                  2px;
  --space-4:                  4px;
  --space-8:                  8px;
  --space-12:                 12px;
  --space-16:                 16px;
  --space-20:                 20px;
  --space-24:                 24px;
  --space-32:                 32px;
  --space-40:                 40px;
  --space-48:                 48px;
  --space-56:                 56px;
  --space-64:                 64px;
  --space-80:                 80px;
  --space-96:                 96px;
  --space-128:                128px;


  /* ════════════════════════════════════════
     BORDER RADIUS
     ════════════════════════════════════════ */

  --radius-none:              0px;
  --radius-sm:                4px;
  --radius-md:                8px;
  --radius-lg:                12px;
  --radius-xl:                16px;
  --radius-2xl:               24px;
  --radius-full:              9999px;


  /* ════════════════════════════════════════
     SHADOWS
     ════════════════════════════════════════ */

  --shadow-xs:                0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm:                0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:                0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg:                0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);
  --shadow-xl:                0 16px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06);
  --shadow-2xl:               0 24px 64px rgba(0,0,0,0.15);
  --shadow-red:               0 4px 16px rgba(211,0,31,0.25);
  --shadow-navy:              0 4px 16px rgba(50,69,149,0.25);


  /* ════════════════════════════════════════
     TRANSITIONS
     ════════════════════════════════════════ */

  --transition-fast:          150ms ease;
  --transition-base:          250ms ease;
  --transition-slow:          400ms ease;
}
```

---

## 2. Sistema de Colores

### 2.1 Colores Principales

| Token | Color | HEX | Uso |
|-------|-------|-----|-----|
| `--color-black` | Negro | `#000000` | Fondos oscuros, texto principal, header/footer |
| `--color-red` | Rojo | `#D3001F` | CTA principal, acentos, hover states |
| `--color-navy` | Navy | `#324595` | Vínculos, acentos secundarios, badges |
| `--color-white` | Blanco | `#FFFFFF` | Fondos de cards, fondos de sección, texto sobre oscuro |

### 2.2 Colores Secundarios (escala de grises)

| Token | Color | HEX | Uso |
|-------|-------|-----|-----|
| `--color-black-700` | Gris oscuro | `#2E2E2E` | Texto body, títulos en modo claro |
| `--color-black-500` | Gris medio | `#5E5E5E` | Texto secundario, placeholders |
| `--color-black-300` | Gris claro | `#909090` | Texto deshabilitado, hint text |
| `--color-black-100` | Gris muy claro | `#D4D4D4` | Bordes de inputs, separadores |
| `--color-black-50` | Casi blanco | `#F0F0F0` | Fondos de sección alternativos |
| `--color-plata-200` | Plata claro | `#EBEBEB` | Fondos de tabla, hover rows |
| `--color-plata-100` | Plata muy claro | `#F5F5F5` | Fondos de página alternativos |

### 2.3 Colores de Apoyo

| Token | Color | HEX | Uso |
|-------|-------|-----|-----|
| `--color-red-400` | Rojo claro | `#E6394F` | Hover de botones rojos |
| `--color-red-100` | Rojo pálido | `#FCD3D8` | Fondos de badges/estado error |
| `--color-navy-400` | Navy claro | `#5066B5` | Hover de links, iconos |
| `--color-navy-100` | Navy pálido | `#D4DBF3` | Fondos de badges/estado info |
| `--color-plata-400` | Plata | `#CECECE` | Bordes, iconos inactivos |

### 2.4 Colores para Estados

| Estado | HEX (color) | HEX (fondo) | HEX (borde) |
|--------|-------------|-------------|-------------|
| **Success** | `#1E8E3E` | `#E6F4EA` | `#A8DAB5` |
| **Error** | `#D3001F` | `#FDE8EA` | `#F5A0AA` |
| **Warning** | `#E37B1A` | `#FFF3E0` | `#FFCC80` |
| **Info** | `#324595` | `#EDF0FA` | `#A9B6E1` |

---

## 3. Sistema Tipográfico

### 3.1 Fuente Principal: Josefin Sans

Geométrica, moderna, elegante. Usar en toda la interfaz de la aplicación.

### 3.2 Fuente Secundaria: Null Free

Decorativa, estilo serif moderno. Usar SOLO para:
- Títulos de hero/landing pages grandes (display)
- Números decorativos o estadísticas destacadas
- Logotipo o wordmark en contextos de marketing
- **NO** usar en body text, formularios, UI funcional

### 3.3 Jerarquía Tipográfica

| Nivel | Tamaño | Peso | Line-Height | Font | Uso |
|-------|--------|------|-------------|------|-----|
| **Display** | 56px | Bold (700) | 1.1 | Josefin Sans | Hero sections, landing pages |
| **H1** | 44px | Bold (700) | 1.15 | Josefin Sans | Título de página principal |
| **H2** | 34px | Bold (700) | 1.2 | Josefin Sans | Título de sección |
| **H3** | 26px | SemiBold (600) | 1.25 | Josefin Sans | Subtítulo de sección |
| **H4** | 20px | SemiBold (600) | 1.3 | Josefin Sans | Título de card |
| **H5** | 18px | SemiBold (600) | 1.35 | Josefin Sans | Título de sub-sección |
| **H6** | 16px | SemiBold (600) | 1.4 | Josefin Sans | Encabezado menor |
| **Body LG** | 18px | Regular (400) | 1.6 | Josefin Sans | Texto destacado |
| **Body** | 16px | Regular (400) | 1.6 | Josefin Sans | Texto base |
| **Body SM** | 14px | Regular (400) | 1.5 | Josefin Sans | Texto secundario |
| **Caption** | 12px | Light (300) | 1.4 | Josefin Sans | Notas, pies de foto |
| **Small** | 11px | Light (300) | 1.4 | Josefin Sans | Metadata, etiquetas |
| **Overline** | 10px | SemiBold (600) | 1.3 | Josefin Sans | Etiquetas uppercase |

### 3.4 Pesos y Usos

| Peso | Uso principal |
|------|---------------|
| Thin (100) | Display decorativo grande (solo contextos editoriales) |
| Light (300) | Captions, small text, body alternativo |
| Regular (400) | Body text, párrafos |
| SemiBold (600) | Subtítulos, botones, labels |
| Bold (700) | Títulos, headings, CTA emphasis |

### 3.5 Reglas de Hierarquía

- Máximo un Display por página (en landing/hero)
- No saltar niveles de heading (h1 → h2 → h3, nunca h1 → h4)
- Body text nunca debe pesar más que un heading cercano
- Usar SemiBold para botones y labels (no Bold, salvo excepción)

---

## 4. Espaciados

### 4.1 Escala

Basada en una unidad base de 8px con un micro-escalón de 4px:

| Token | px | Ejemplo de uso |
|-------|----|----------------|
| `--space-2` | 2px | Separación entre icono y texto en un badge |
| `--space-4` | 4px | Gap compacto, inner padding pequeño |
| `--space-8` | 8px | Padding de inputs, gap entre elementos inline |
| `--space-12` | 12px | Padding interno de badges/chips |
| `--space-16` | 16px | Padding de cards, gap entre secciones pequeñas |
| `--space-20` | 20px | Padding de modales, margen entre bloques |
| `--space-24` | 24px | Padding de contenedores, gap entre secciones |
| `--space-32` | 32px | Margen entre secciones mayores |
| `--space-40` | 40px | Separación entre bloques de contenido |
| `--space-48` | 48px | Margen superior de secciones nuevas |
| `--space-56-96` | 56-96px | Padding lateral de layout en desktop |
| `--space-128` | 128px | Margen de hero sections |

### 4.2 Reglas Generales de Espaciado

- Usar siempre valores de la escala. No usar valores arbitrarios.
- El espaciado entre elementos relacionados debe ser menor que entre secciones.
- Regla práctica: elementos del mismo grupo → 8px o 12px; grupos diferentes → 24px o 32px.
- Padding de página: 16px en mobile, 24px en tablet, 56-96px en desktop.

---

## 5. Radios de Borde

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-none` | 0px | Sin borde redondeado |
| `--radius-sm` | 4px | Inputs, botones pequeños, badges |
| `--radius-md` | 8px | Cards, modales, contenedores |
| `--radius-lg` | 12px | Cards destacados, dropdowns |
| `--radius-xl` | 16px | Modales grandes, contenedores hero |
| `--radius-2xl` | 24px | Tarjetas promocionales |
| `--radius-full` | 9999px | Chips, avatares, pills |

**Regla:** La marca MOLI es moderna y minimalista. Preferir radios pequeños a medianos (`sm` a `md`) para UI funcional. Radios grandes (`xl` en adelante) solo en elementos decorativos.

---

## 6. Sombras

| Token | Uso |
|-------|-----|
| `--shadow-xs` | Elementos elevados sutiles (hover de links) |
| `--shadow-sm` | Cards pequeñas, dropdowns |
| `--shadow-md` | Cards, modales, contenedores flotantes |
| `--shadow-lg` | Modales grandes, menús contextuales |
| `--shadow-xl` | Notificaciones, tooltips |
| `--shadow-2xl` | Overlay de modales (sombra externa al contenedor) |
| `--shadow-red` | Botón primario (hover/active) |
| `--shadow-navy` | Botón secundario (hover/active) |

**Regla:** Las sombras deben ser sutiles. La marca es elegante, no usar sombras demasiado pronunciadas.

---

## 7. Componentes

### 7.1 Botones

#### Botón Primario (Red — CTA principal)
```
┌─────────────────────────┐
│  Acción Principal       │  ← texto SemiBold (600), 16px
└─────────────────────────┘
  Fondo: var(--color-red)
  Texto: white
  Padding: 12px 24px
  Radius: var(--radius-sm) 4px
  Border: none
  Sombra: none (default), var(--shadow-red) on hover
  Hover: background var(--color-red-400)
  Active: background var(--color-red-700)
  Disabled: background var(--color-black-100), text var(--color-black-300)
  Transition: var(--transition-fast)
```

#### Botón Secundario (Navy — Acción secundaria)
```
┌─────────────────────────┐
│  Acción Secundaria      │
└─────────────────────────┘
  Fondo: var(--color-navy)
  Texto: white
  Padding: 12px 24px
  Radius: var(--radius-sm)
  Hover: var(--color-navy-400)
  Active: var(--color-navy-700)
```

#### Botón Outline
```
┌─────────────────────────┐
│  Acción Outline          │
└─────────────────────────┘
  Fondo: transparent
  Texto: var(--color-black)
  Border: 1.5px solid var(--color-black)
  Hover: background var(--color-black-50)
```

#### Botón Ghost
```
┌─────────────────────────┐
│  Acción                  │
└─────────────────────────┘
  Fondo: transparent
  Texto: var(--color-black)
  Hover: background var(--color-black-50)
  No border
```

#### Botones de Icono (solo icono)
```
┌─┐
│🔍│   36×36px
└─┘
  Radius: var(--radius-sm) o var(--radius-full) para iconos de acción
  Padding: 8px
```

**Tamaños de botón:**

| Tamaño | Padding Y | Padding X | Font Size |
|--------|-----------|-----------|-----------|
| Sm | 6px | 16px | 14px |
| Md (default) | 12px | 24px | 16px |
| Lg | 16px | 32px | 18px |

---

### 7.2 Inputs

```
┌─────────────────────────────┐
│  Label                      │  ← texto 14px SemiBold, color black-700
│                             │     margin-bottom: 4px
├─────────────────────────────┤
│  Placeholder o valor        │  ← texto 16px Regular
└─────────────────────────────┘
  Background: white
  Border: 1.5px solid var(--color-black-100)
  Border-radius: var(--radius-sm) 4px
  Padding: 12px 16px
  Color: var(--color-black-700)
  Placeholder: var(--color-black-300)

  Focus: border-color var(--color-navy), box-shadow 0 0 0 3px var(--color-navy-100)
  Error: border-color var(--color-error)
  Disabled: background var(--color-plata-100), color var(--color-black-300)
  Helper text: 12px, margin-top 4px, color var(--color-black-500)
  Error text: 12px, color var(--color-error)
```

#### Variantes de Input

- **Text input** — estándar
- **Textarea** — mismo estilo, min-height 120px
- **Select** — mismo estilo, con icono de chevron personalizado
- **Search** — con icono de lupa a la izquierda, padding-left 40px
- **Password** — con toggle de visibilidad

---

### 7.3 Cards

```
┌─────────────────────────────────┐
│                                 │
│   ┌─────────────────────────┐   │
│   │  Imagen / Ilustración   │   │
│   └─────────────────────────┘   │
│                                 │
│   Título de la Card             │  ← H5 o H6
│   Descripción breve del         │  ← Body SM (14px)
│   contenido de la card          │
│                                 │
│   [Acción]                      │
│                                 │
└─────────────────────────────────┘
  Background: white
  Border-radius: var(--radius-md)
  Padding: 24px (16px en mobile)
  Shadow: var(--shadow-sm) (default), var(--shadow-md) (hover)
  Border: 1px solid var(--color-black-100) (opcional, tarjetas outlined)
  Transition: var(--transition-base)
```

**Variantes:**
- **Default** — con sombra, sin borde
- **Outlined** — con borde, sin sombra
- **Elevated** — con sombra más pronunciada (`--shadow-md` o `--shadow-lg`), para destacar
- **Clickable** — hover: sombra mayor + cursor pointer + transform subtle (translateY(-2px))

---

### 7.4 Tablas

```
┌─────────┬──────────┬──────────┬──────────┐
│ Header  │ Header   │ Header   │ Header   │  ← 14px SemiBold, color black
├─────────┼──────────┼──────────┼──────────┤
│ Cell    │ Cell     │ Cell     │ Cell     │  ← 14px Regular, color black-700
├─────────┼──────────┼──────────┼──────────┤
│ Cell    │ Cell     │ Cell     │ Cell     │
└─────────┴──────────┴──────────┴──────────┘

  Header: background var(--color-plata-100), border-bottom 2px solid var(--color-black-100)
  Rows: border-bottom 1px solid var(--color-plata-200)
  Hover row: background var(--color-plata-200)
  Padding cells: 12px 16px
  Border-radius: var(--radius-sm) (solo en la tabla completa)
  Striped: usar filas pares con background var(--color-plata-50) (opcional)
```

---

### 7.5 Modales

```
┌─────────────────────────────────────────────┐
│  ╳                                         │
│  ┌───────────────────────────────────────┐  │
│  │  Título del Modal                    │  │  ← H4
│  ├───────────────────────────────────────┤  │
│  │                                       │  │
│  │  Contenido del modal                  │  │  ← Body
│  │                                       │  │
│  ├───────────────────────────────────────┤  │
│  │  [Cancelar]            [Confirmar]    │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

  Overlay: rgba(0,0,0,0.5), backdrop-filter blur(2px)
  Container: background white, radius var(--radius-lg), shadow var(--shadow-xl)
  Padding: 24px (content), 16px (footer)
  Header: border-bottom 1px solid var(--color-black-100) (opcional)
  Footer: border-top 1px solid var(--color-black-100), justify-content flex-end, gap 12px
  Width: 480px (default), 640px (lg), 320px (sm)
  Max-height: 85vh, scrollable content
  Animación: fadeIn + scale 0.95→1, 250ms ease
```

---

### 7.6 Badges

```
┌──────────┐
│  Activo  │
└──────────┘
  Padding: 2px 10px
  Font: 12px SemiBold
  Radius: var(--radius-full)
  Display: inline-flex, align-items center, gap 4px
```

**Variantes por estado:**

| Variante | Background | Texto |
|----------|-----------|-------|
| Success | `--color-success-bg` | `--color-success` |
| Error | `--color-error-bg` | `--color-error` |
| Warning | `--color-warning-bg` | `--color-warning` |
| Info | `--color-info-bg` | `--color-info` |
| Neutral | `--color-plata-200` | `--color-black-600` |
| Brand | `--color-red` | `white` |

---

### 7.7 Chips / Tags

```
┌──────────────┬──┐
│  Etiqueta    │╳ │
└──────────────┴──┘
  Padding: 6px 12px (text), 6px (close)
  Font: 13px Regular
  Radius: var(--radius-full)
  Background: var(--color-plata-200)
  Color: var(--color-black-700)
  Gap entre texto y close icon: 6px
  Close icon: hover color var(--color-error), 14×14px

  Active/Selected: background var(--color-navy), text white
```

---

### 7.8 Navegación (Tabs)

```
┌──────────┬──────────┬──────────┬──────────┐
│  Tab 1   │  Tab 2   │  Tab 3   │  Tab 4   │
├──────────┴──────────┴──────────┴──────────┤
│                                            │
│  Contenido del tab activo                  │
│                                            │
└────────────────────────────────────────────┘
  Tab: padding 12px 20px, font 14px SemiBold, color black-500
  Active tab: color black (o var(--color-red)), border-bottom 2.5px solid var(--color-red)
  Hover tab: color black-700, background var(--color-plata-100)
```

---

### 7.9 Tooltips

```
             ┌──────────────┐
             │  Tooltip text │
             └──────────────┘
                    ▼
                [Trigger]

  Background: var(--color-black)
  Text: white, 12px Regular
  Padding: 6px 12px
  Radius: var(--radius-sm)
  Arrow: 6px pseudo-element
  Z-index: 50
```

---

### 7.10 Notificaciones / Toasts

```
┌──────────────────────────────────────────────┐
│  🔔  Mensaje de notificación           [╳]  │
└──────────────────────────────────────────────┘
  Padding: 16px
  Radius: var(--radius-md)
  Shadow: var(--shadow-lg)
  Font: 14px Regular
  Icon left: 20px, color según estado
  Close button: right, 16px

  Success: border-left 4px solid var(--color-success)
  Error: border-left 4px solid var(--color-error)
  Warning: border-left 4px solid var(--color-warning)
  Info: border-left 4px solid var(--color-info)
```

---

## 8. Logo

### 8.1 Archivos Oficiales

| Archivo | Uso |
|---------|-----|
| `Logo-MOLI-ORIGINAL.png` | Logo principal. Usar en header, footer, y contextos generales |
| `edicion ver logo ai.ai` | Archivo fuente editable (Illustrator). No usar en producción directa |
| Variantes (`2.png`, `4.png`, `5.png`) | Posibles variantes de color del logo (verificar con el manual PDF) |

### 8.2 Variantes de Perfil Social

| Archivo | Fondo ideal | Contexto |
|---------|-------------|----------|
| `foto perfil blanco.png` | Fondos claros o blancos | Sitios web con fondo claro |
| `Foto perfil negro.png` | Fondos oscuros | Modo oscuro, headers oscuros |
| `Foto perfil plata.png` | Fondos neutros | Contextos promocionales |

### 8.3 Reglas de Uso del Logo

- **No** distorsionar la relación de aspecto del logo.
- **No** cambiar los colores del logo.
- **No** aplicar efectos (sombras, gradientes, brillos) al logo a menos que sea regla aprobada.
- **No** rotar ni inclinar el logo.
- **No** colocar el logo sobre fondos que comprometan su legibilidad.
- **Área de resguardo:** Mínimo 1/4 del alto del logo en todos los lados.
- **Tamaño mínimo:** 120px de ancho en digital, 40mm en impreso.
- **Fondo oscuro:** Usar variante blanca del logo.
- **Fondo claro:** Usar variante original (negra).

---

## 9. Iconografía

### 9.1 Origen

- El set oficial está en `GRAFICOS COMPLEMENTARIOS/ICONOGRAFÍA.ai` (Illustrator).
- Los 20 PNGs complementarios (`Recurso 1–21`) son exportaciones del set de iconografía.

### 9.2 Estilo de Iconos

- **Estilo:** Línea fina, geométrico, consistente con Josefin Sans
- **Stroke:** 1.5px – 2px
- **Tamaño base:** 24×24px (con variantes 16px, 20px, 32px)
- **Color:** Hereda del texto circundante o usa `--color-black-600`
- **Esquinas:** Redondeadas (consistentes con `--radius-sm`)
- **Esquinas rellenas:** Solo para estados o selección

### 9.3 Uso de PNGs Complementarios

Los recursos (`Recurso 1–21`) son para uso en:
- Landing pages
- Secciones ilustrativas
- Gráficos decorativos
- NO usar como iconos de UI funcional (preferir vector/SVG)

---

## 10. Ilustraciones y Gráficos Decorativos

### 10.1 Estilo

- **Líneas limpias y geométricas** — coherente con la tipografía Josefin Sans
- **Paleta restringida:** Negro, Rojo, Navy, Plata (sin配色 adicional salvo necesidad)
- **Formas:** Preferir ángulos rectos y curvas suaves, sin ornamentación excesiva
- **Propósito:** Comunicar claridad, confianza, modernidad (valores fintech)

### 10.2 Cuándo Usar

- Páginas de onboarding / tutoriales
- Estados vacíos (empty states)
- Secciones hero de marketing
- Páginas de error 404/500
- NO usar ilustraciones en UI transaccional densa

### 10.3 Gráficos Decorativos (Fondos)

- Usar los recursos PNG grandes (Recurso 14–18) como fondos decorativos en secciones específicas
- Asegurar que no compitan con el contenido (opacidad reducida si es necesario)
- Preferir patrones sutiles sobre fondos sólidos

---

## 11. Fondos

| Contexto | Fondo |
|----------|-------|
| Página principal | `white` o `--color-plata-50` |
| Cards / Contenedores | `white` |
| Secciones alternas | `--color-plata-100` o `--color-black-50` |
| Header / Footer | `--color-black` con texto blanco |
| Modales | `white` |
| Overlay de modal | `rgba(0,0,0,0.5)` |
| Modo oscuro (si aplica) | `--color-black-800` como base |

---

## 12. Accesibilidad

### 12.1 Contraste

| Elemento | Ratio mínimo | Estándar |
|----------|-------------|----------|
| Texto normal (< 18px) | 4.5:1 | WCAG AA |
| Texto grande (≥ 18px bold o ≥ 24px) | 3:1 | WCAG AA |
| Componentes UI (bordes, iconos) | 3:1 | WCAG AA |

### 12.2 Checklist

- [ ] Todos los botones y enlaces tienen focus visible (`outline` o `box-shadow` azul)
- [ ] Los colores de estados (success, error, warning, info) no dependen solo del color (usar iconos + texto)
- [ ] Touch targets ≥ 44×44px en mobile
- [ ] Texto con tamaño mínimo de 14px para body
- [ ] Los iconos decorativos tienen `aria-hidden="true"`
- [ ] Los iconos funcionales tienen `aria-label` descriptivo
- [ ] Los modales atrapan el foco (focus trap)
- [ ] Las tablas tienen `<th>` con scope
- [ ] Los formularios tienen `<label>` asociado a cada input
- [ ] Los mensajes de error en formularios están asociados mediante `aria-describedby`

### 12.3 Focus Visible

```css
:focus-visible {
  outline: 2.5px solid var(--color-navy);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 13. Buenas Prácticas

### 13.1 Layout

- Usar sistema de grid de 12 columnas para layouts responsive
- Máximo ancho de contenedor: 1200px (1440px para landing pages)
- Side padding responsive: 16px mobile → 24px tablet → 56-96px desktop
- Stack vertical consistente: secciones espaciadas con `--space-48` o `--space-64`

### 13.2 Estados de Interacción

| Estado | Regla |
|--------|-------|
| Default | Estado base del componente |
| Hover | Cambio sutil (background, shadow, transform) |
| Active/Pressed | Oscurecer ligeramente o reducir sombra |
| Focus | Anillo de focus visible (nunca eliminarlo) |
| Disabled | Opacidad 0.4, sin interacción, sin sombras |
| Loading | Spinner o skeleton, deshabilitar interacción |

### 13.3 Animaciones

- Preferir `transform` y `opacity` para animaciones (GPU aceleradas)
- Duración: 150ms para micro-interacciones, 250ms para transiciones generales, 400ms para animaciones de entrada
- Easing: `ease` o `cubic-bezier(0.25, 0.1, 0.25, 1)`
- Movimiento reducido: respetar `prefers-reduced-motion`

### 13.4 Responsive

- **Mobile first** — diseñar desde la vista móvil hacia arriba
- Breakpoints sugeridos: 480px, 768px, 1024px, 1280px
- En mobile: reducir padding de cards a 16px, apilar layouts, aumentar touch targets

---

## 14. Elementos que NO Deben Utilizarse

| ❌ Elemento | Motivo |
|-------------|--------|
| Sombras excesivas o difusas | Rompe la estética elegante y minimalista |
| Gradientes multi-color | La paleta es plana y sólida; los gradientes no forman parte del ADN de marca |
| Esquinas sin radio en UI (0px) | A menos que sea un contenedor de ancho completo, los componentes deben tener radio |
| Tipografía Null Free en body text | Es decorativa, no legible en tamaños pequeños |
| Más de dos colores de acento por página | Máximo: Rojo (primario) + Navy (secundario) |
| Logo con efectos (sombras, brillos, gradientes) | El logo debe usarse limpio, sin alteraciones |
| Iconos de stock que no sigan el estilo de línea | Todos los iconos deben ser consistentes con el set oficial |
| Colores neón o saturados fuera de la paleta | La marca es elegante y sobria |
| Fotos con filtros fuertes o estilos no coherentes | La fotografía debe ser limpia, profesional, de alto contraste |
| Uso de mayúsculas sostenidas en body text | Solo usar en overline (10px) o botones |
| Animaciones que duren más de 600ms | La experiencia debe sentirse rápida y moderna |

---

## 15. Design Tokens (JSON)

```json
{
  "colors": {
    "black":   { "value": "#000000", "type": "color" },
    "red":     { "value": "#D3001F", "type": "color" },
    "navy":    { "value": "#324595", "type": "color" },
    "plata":   { "value": "#CECECE", "type": "color" },
    "white":   { "value": "#FFFFFF", "type": "color" },
    "success": { "value": "#1E8E3E", "type": "color" },
    "error":   { "value": "#D3001F", "type": "color" },
    "warning": { "value": "#E37B1A", "type": "color" },
    "info":    { "value": "#324595", "type": "color" }
  },
  "typography": {
    "fontPrimary":   { "value": "'Josefin Sans', 'Segoe UI', sans-serif" },
    "fontSecondary": { "value": "'Null Free', 'Georgia', serif" },
    "weights": {
      "thin":      { "value": "100" },
      "light":     { "value": "300" },
      "regular":   { "value": "400" },
      "semibold":  { "value": "600" },
      "bold":      { "value": "700" }
    }
  },
  "spacing": {
    "2":   { "value": "2px" },
    "4":   { "value": "4px" },
    "8":   { "value": "8px" },
    "12":  { "value": "12px" },
    "16":  { "value": "16px" },
    "20":  { "value": "20px" },
    "24":  { "value": "24px" },
    "32":  { "value": "32px" },
    "40":  { "value": "40px" },
    "48":  { "value": "48px" },
    "64":  { "value": "64px" },
    "80":  { "value": "80px" },
    "96":  { "value": "96px" },
    "128": { "value": "128px" }
  },
  "borderRadius": {
    "none":  { "value": "0px" },
    "sm":    { "value": "4px" },
    "md":    { "value": "8px" },
    "lg":    { "value": "12px" },
    "xl":    { "value": "16px" },
    "2xl":   { "value": "24px" },
    "full":  { "value": "9999px" }
  },
  "shadows": {
    "xs":  { "value": "0 1px 2px rgba(0,0,0,0.05)" },
    "sm":  { "value": "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" },
    "md":  { "value": "0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)" },
    "lg":  { "value": "0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)" },
    "xl":  { "value": "0 16px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)" },
    "2xl": { "value": "0 24px 64px rgba(0,0,0,0.15)" }
  }
}
```

---

> **Documento generado el:** 27/07/2026
> **Basado en:** BrandRules.md y archivos de `/identidad`
> **Fuente de verdad:** MANUAL DE IDENTIDAD MOLI PDF.pdf
> **Nota:** Los valores inferidos (marcados como "por inferencia") deberán validarse contra el PDF del manual cuando esté disponible en formato legible.
