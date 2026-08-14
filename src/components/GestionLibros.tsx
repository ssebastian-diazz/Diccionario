import { useState } from 'react'
import { Archive, ArchiveRestore, Pencil, Plus } from 'lucide-react'
import type { Libro, PalabraConLibro } from '../types'
import { NuevoLibroModal } from './NuevoLibroModal'

interface Props {
  libros: Libro[]
  palabras: PalabraConLibro[]
  agregarLibro: (titulo: string, autor: string) => Promise<Libro>
  editarLibro: (id: string, cambios: Partial<Pick<Libro, 'titulo' | 'autor' | 'activo'>>) => Promise<Libro>
  onVerLibro: (libroId: string) => void
}

export function GestionLibros({ libros, palabras, agregarLibro, editarLibro, onVerLibro }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [libroEditando, setLibroEditando] = useState<Libro | null>(null)

  const conteoPorLibro = new Map<string, number>()
  for (const p of palabras) {
    if (!p.libro_id) continue
    conteoPorLibro.set(p.libro_id, (conteoPorLibro.get(p.libro_id) ?? 0) + 1)
  }

  const activos = libros.filter((l) => l.activo)
  const archivados = libros.filter((l) => !l.activo)

  function Fila({ libro }: { libro: Libro }) {
    return (
      <li className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => onVerLibro(libro.id)}
          className="flex min-w-0 flex-1 flex-col items-start text-left"
        >
          <span className="font-display text-base font-semibold text-ink">{libro.titulo}</span>
          <span className="text-sm text-ink-faint">
            {libro.autor ?? 'Autor desconocido'} · {conteoPorLibro.get(libro.id) ?? 0} palabra
            {(conteoPorLibro.get(libro.id) ?? 0) === 1 ? '' : 's'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setLibroEditando(libro)}
          className="rounded p-2 text-ink-faint hover:bg-line-soft hover:text-ink"
          aria-label={`Editar ${libro.titulo}`}
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={() => editarLibro(libro.id, { activo: !libro.activo })}
          className="rounded p-2 text-ink-faint hover:bg-line-soft hover:text-ink"
          aria-label={libro.activo ? `Archivar ${libro.titulo}` : `Reactivar ${libro.titulo}`}
        >
          {libro.activo ? <Archive size={15} /> : <ArchiveRestore size={15} />}
        </button>
      </li>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-ink">Libros</h1>
        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-1 rounded-md bg-accent px-3 py-2 text-sm font-medium text-paper-raised hover:bg-accent-soft"
        >
          <Plus size={16} />
          Agregar libro
        </button>
      </div>

      {libros.length === 0 && (
        <p className="py-12 text-center text-ink-faint">Todavía no agregaste ningún libro.</p>
      )}

      {activos.length > 0 && (
        <ul className="flex flex-col divide-y divide-line-soft rounded-lg border border-line bg-paper-raised">
          {activos.map((l) => (
            <Fila key={l.id} libro={l} />
          ))}
        </ul>
      )}

      {archivados.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Archivados
          </h2>
          <ul className="flex flex-col divide-y divide-line-soft rounded-lg border border-line bg-paper-raised opacity-70">
            {archivados.map((l) => (
              <Fila key={l.id} libro={l} />
            ))}
          </ul>
        </section>
      )}

      {modalAbierto && (
        <NuevoLibroModal
          onClose={() => setModalAbierto(false)}
          onGuardar={async (titulo, autor) => {
            await agregarLibro(titulo, autor)
          }}
        />
      )}

      {libroEditando && (
        <NuevoLibroModal
          libro={libroEditando}
          onClose={() => setLibroEditando(null)}
          onGuardar={async (titulo, autor) => {
            await editarLibro(libroEditando.id, { titulo, autor: autor || null })
          }}
        />
      )}
    </div>
  )
}
