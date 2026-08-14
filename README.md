# Diccionario Personal

App de un solo usuario para capturar palabras nuevas mientras lees: palabra,
categoría gramatical, definición, página/capítulo, oración original e imagen
opcional — todo ligado al libro que estás leyendo en ese momento.

## Stack

- React + Vite + TypeScript + Tailwind CSS v4
- Supabase (Postgres + Storage, sin login — RLS abierta con la anon key)
- Deploy a GitHub Pages vía GitHub Actions

## Setup

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Corre todo el contenido de `schema.sql` en el SQL Editor de tu proyecto.
   Esto crea las tablas `libros` y `palabras`, el enum `categoria_gramatical`,
   las políticas de RLS y el bucket de Storage `palabras` para las imágenes.
3. Copia `.env.example` a `.env` y llena `VITE_SUPABASE_URL` /
   `VITE_SUPABASE_ANON_KEY` con los valores de Project Settings → API.
4. `npm install`
5. `npm run dev`

## Deploy

El workflow en `.github/workflows/deploy.yml` construye y publica a GitHub
Pages en cada push a `main`. Antes de que funcione:

1. En GitHub → Settings → Pages, elige "GitHub Actions" como fuente.
2. En Settings → Secrets and variables → Actions, agrega `VITE_SUPABASE_URL`
   y `VITE_SUPABASE_ANON_KEY` como repository secrets.
3. Si el repo no se llama `Diccionario`, actualiza `base` en `vite.config.ts`
   para que coincida con el nombre del repo.

## Flujo de captura

1. En "Libros" agregas el libro que vas a leer (o desde el botón "+ nuevo
   libro" sin salir de la pantalla de captura).
2. En "Captura" eliges el libro activo una vez — se guarda en localStorage,
   así que sobrevive a un recargo de página a mitad de sesión.
3. Cada palabra que guardas se liga automáticamente a ese libro. Puedes
   cambiar el libro activo en cualquier momento desde la misma pantalla.

## Fuera de alcance en v1

Búsqueda/filtro de palabras, juego semanal de oraciones, etimología/sinónimos,
estadísticas — quedan para v2.
