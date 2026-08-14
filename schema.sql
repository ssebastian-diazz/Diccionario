-- Ejecutar esto completo en el SQL Editor de tu proyecto Supabase.

create extension if not exists "pgcrypto";

create type categoria_gramatical as enum ('sustantivo', 'verbo', 'adjetivo', 'adverbio');

create table libros (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table palabras (
  id uuid primary key default gen_random_uuid(),
  palabra text not null,
  categoria_gramatical categoria_gramatical not null,
  definicion text not null,
  imagen_url text,
  libro_id uuid references libros(id) on delete set null,
  pagina_o_capitulo text,
  oracion_original text,
  fecha_captura timestamptz not null default now()
);

create index palabras_libro_idx on palabras (libro_id);
create index palabras_categoria_idx on palabras (categoria_gramatical);

-- Habilita RLS. Como es una app de un solo usuario sin login,
-- se deja abierta con la anon key (mantén el proyecto privado / no compartas la key).
alter table libros enable row level security;
alter table palabras enable row level security;

create policy "allow all libros" on libros for all using (true) with check (true);
create policy "allow all palabras" on palabras for all using (true) with check (true);

-- Storage: bucket público para las imágenes de las palabras.
insert into storage.buckets (id, name, public)
values ('palabras', 'palabras', true)
on conflict (id) do nothing;

create policy "palabras bucket select" on storage.objects for select using (bucket_id = 'palabras');
create policy "palabras bucket insert" on storage.objects for insert with check (bucket_id = 'palabras');
create policy "palabras bucket update" on storage.objects for update using (bucket_id = 'palabras');
create policy "palabras bucket delete" on storage.objects for delete using (bucket_id = 'palabras');
