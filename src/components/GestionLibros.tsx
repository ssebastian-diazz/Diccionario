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
      <li className="flex items-center gap-3 py-3">
        <button
          type="button"
          onClick={() => onVerLibro(libro.id)}
          className="flex min-w-0 flex-1 flex-col items-start text-left"
        >
          <span className="font-display text-[17px] font-semibold text-ink">{libro.titulo}</span>
          <span className="mt-0.5 text-[13px] text-ink-soft">
            {libro.autor ?? 'Autor desconocido'} · {conteoPorLibro.get(libro.id) ?? 0} palabra
            {(conteoPorLibro.get(libro.id) ?? 0) === 1 ? '' : 's'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setLibroEditando(libro)}
          className="p-2 text-ink-faint hover:text-accent"
          aria-label={`Editar ${libro.titulo}`}
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => editarLibro(libro.id, { activo: !libro.activo })}
          className="p-2 text-ink-faint hover:text-accent"
          aria-label={libro.activo ? `Archivar ${libro.titulo}` : `Reactivar ${libro.titulo}`}
        >
          {libro.activo ? <Archive size={16} /> : <ArchiveRestore size={16} />}
        </button>
      </li>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-5 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-[28px] font-bold text-ink">Libros</h1>
        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          aria-label="Agregar libro"
          className="rounded-full p-1.5 text-accent hover:bg-accent-dim"
        >
          <Plus size={22} strokeWidth={2.2} />
        </button>
      </div>

      {libros.length === 0 && (
        <p className="py-16 text-center text-[15px] text-ink-soft">
          Todavía no agregaste ningún libro.
        </p>
      )}

      <div className="flex flex-col gap-8">
        {activos.length > 0 && (
          <ul className="flex flex-col divide-y divide-line">
            {activos.map((l) => (
              <Fila key={l.id} libro={l} />
            ))}
          </ul>
        )}

        {archivados.length > 0 && (
          <section>
            <h2 className="mb-1 text-[13px] font-semibold uppercase text-ink-soft">Archivados</h2>
            <ul className="flex flex-col divide-y divide-line opacity-60">
              {archivados.map((l) => (
                <Fila key={l.id} libro={l} />
              ))}
            </ul>
          </section>
        )}
      </div>

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
