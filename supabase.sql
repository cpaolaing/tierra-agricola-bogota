-- ==========================================
-- CREACIÓN DE LA TABLA
-- ==========================================
create table if not exists public.clientes (
  id bigint generated always as identity primary key,
  nombre text not null,
  telefono text not null,
  producto text not null,
  cantidad text,
  localidad text,
  mensaje text,
  acepta_datos boolean not null default true,
  fecha_registro timestamptz not null default now()
);

-- ==========================================
-- SEGURIDAD (ROW LEVEL SECURITY & PERMISOS)
-- ==========================================
-- Habilitar RLS en la tabla
alter table public.clientes enable row level security;

-- Revocar accesos a roles públicos (anon) y usuarios autenticados normales (authenticated)
revoke all on table public.clientes from anon, authenticated;

-- Asignar permisos completos explícitamente al rol de servicio del backend
grant all on table public.clientes to service_role;
grant usage, select on all sequences in schema public to service_role;

-- ==========================================
-- ÍNDICES DE RENDIMIENTO
-- ==========================================
create index if not exists clientes_fecha_registro_idx
on public.clientes (fecha_registro desc);
