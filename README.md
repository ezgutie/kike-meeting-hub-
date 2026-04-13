# Kike Meeting Hub 📅

App para solicitar reuniones con Kike (ONMI Engineering).  
El equipo crea solicitudes con título, descripción, horas y prioridad.  
Kike entra con su correo y las gestiona desde su panel.

---

## Setup rápido (15 min)

### Paso 1 — Crear base de datos en Supabase (gratis)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto (región: EU West para menor latencia desde España)
3. Una vez creado, ve a **SQL Editor** en el menú lateral
4. Copia y pega todo el contenido de `supabase-setup.sql` y ejecútalo
5. Ve a **Settings > API** y copia:
   - `Project URL` → será tu `VITE_SUPABASE_URL`
   - `anon public` key → será tu `VITE_SUPABASE_ANON_KEY`

### Paso 2 — Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y pega tus valores de Supabase.

### Paso 3 — Probar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` y pruébalo.

---

## Deploy en Vercel

### Paso 4 — Subir a GitHub

```bash
# Desde la carpeta del proyecto
git init
git add .
git commit -m "Initial commit - Kike Meeting Hub"

# Crear repo en GitHub (puede ser privado) y conectar:
git remote add origin https://github.com/TU-USUARIO/kike-meeting-hub.git
git branch -M main
git push -u origin main
```

### Paso 5 — Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub
2. Click **"Add New Project"**
3. Importa el repo `kike-meeting-hub`
4. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL` = tu Project URL
   - `VITE_SUPABASE_ANON_KEY` = tu anon key
5. Click **Deploy**

¡Listo! Vercel te dará una URL tipo `kike-meeting-hub.vercel.app`.

---

## Uso

| Rol | Cómo entra | Qué ve |
|-----|-----------|--------|
| Equipo | Nombre + su email | Formulario + sus solicitudes |
| Kike | Nombre + `e.gonzalez@onmi.es` | Dashboard con todas las solicitudes |

---

## Stack

- React 18 + Vite
- Supabase (PostgreSQL)
- Vercel (hosting)
