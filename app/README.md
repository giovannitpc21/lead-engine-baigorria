# Lead Engine - Grupo Baigorria

Plataforma de captura de leads para servicios inmobiliarios en Gran Mendoza, Argentina.

## 🏢 Marcas

- **Century 21 Baigorria** - Compra/venta de propiedades
- **APROAM** - Administración de propiedades y alquileres
- **CCB** - Centro de Capacitación Baigorria (SOI30)

## 🚀 Tecnología

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deploy**: Vercel (free tier)

## 📁 Estructura del Proyecto

```
├── src/
│   ├── components/
│   │   ├── forms/          # Formularios de leads
│   │   └── ui-custom/      # Componentes UI custom (Navbar, Footer)
│   ├── hooks/              # Custom hooks (useLeads, useAdmin)
│   ├── lib/                # Utilidades y constantes
│   ├── pages/              # Páginas principales
│   ├── types/              # Tipos TypeScript
│   └── App.tsx             # Router principal
├── supabase/
│   └── schema.sql          # Schema de base de datos
└── .env.example            # Variables de entorno
```

## 🛠️ Setup Local

### 1. Clonar e instalar

```bash
cd /mnt/okcomputer/output/app
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_ADMIN_PASSWORD=admin123
VITE_C21_WHATSAPP=5492617166129
VITE_APROAM_WHATSAPP=5492613907452
```

### 3. Configurar Supabase

1. Crear proyecto en [Supabase](https://supabase.com) (free tier)
2. Ejecutar el schema en SQL Editor:
   - Copiar contenido de `supabase/schema.sql`
   - Pegar en SQL Editor → New query → Run

### 4. Correr localmente

```bash
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173)

## 📋 Páginas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Home con servicios |
| `/vender` | Formulario para vendedores |
| `/comprar` | Formulario para compradores |
| `/alquilar` | Formulario para alquiler (APROAM) |
| `/tasador` | Tasador online 5 pasos |
| `/contacto` | Formulario de contacto general |
| `/trabaja-con-nosotros` | Postulaciones (CCB/SOI30) |
| `/admin` | Panel de administración |

## 🔐 Admin Panel

- **URL**: `/admin`
- **Password**: `admin123` (configurable en `.env`)
- **Features**:
  - Listado de leads con filtros
  - Exportación a CSV
  - Estadísticas básicas

## 📱 Contactos (Footer)

### Century 21 Baigorria
- WhatsApp: [+54 9 261 716 6129](https://wa.me/5492617166129)
- Tel: +54 9 261 716 6129

### APROAM
- WhatsApp: [+54 9 261 390 7452](https://wa.me/5492613907452)
- Tel: +54 9 261 390 7452

## 🚢 Deploy a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

O conecta tu repo de GitHub a Vercel para deploy automático.

## 📊 Iteraciones

### Iteración 2 (Actual) ✅
- Lead forms para todas las páginas
- Supabase schema + RLS
- Admin panel básico
- Tasador online 5 pasos

### Iteración 3 (Próxima)
- Wizard de tasación completo
- Tabla de reglas de valoración editable
- Guardar valuaciones en DB

### Iteración 4
- CRUD de propiedades
- Mapeo propiedad-asesor
- Página de detalle de propiedad

### Iteración 5
- SEO pages adicionales
- Tabla de analytics
- Endpoints de webhook para n8n

## ⚠️ Notas MVP

- **Auth**: Password simple (sin Supabase Auth en MVP)
- **Imágenes**: URLs externas (sin storage en MVP)
- **Notificaciones**: Solo links wa.me (sin Twilio)
- **Chatbot**: No incluido en MVP

## 📄 Licencia

Propietario - Grupo Baigorria
