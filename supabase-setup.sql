-- =============================================
-- Kike Meeting Hub - Supabase Setup
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Crear tabla de meetings
create table if not exists public.meetings (
  id            uuid default gen_random_uuid() primary key,
  title         text not null,
  description   text default '',
  hours         numeric(5,2) not null default 1,
  category      text not null default 'consultation',
  priority      text not null default 'medium',
  status        text not null default 'pending',
  admin_comment text default '',
  requester_name  text not null,
  requester_email text not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. Habilitar Row Level Security
alter table public.meetings enable row level security;

-- 3. Política: cualquier persona autenticada o anónima puede leer
create policy "Lectura pública de meetings"
  on public.meetings for select
  using (true);

-- 4. Política: cualquiera puede insertar (crear solicitudes)
create policy "Insertar meetings"
  on public.meetings for insert
  with check (true);

-- 5. Política: cualquiera puede actualizar (Kike cambia estado)
create policy "Actualizar meetings"
  on public.meetings for update
  using (true);

-- 6. Índices para rendimiento
create index if not exists idx_meetings_status on public.meetings(status);
create index if not exists idx_meetings_requester on public.meetings(requester_email);
create index if not exists idx_meetings_created on public.meetings(created_at desc);
