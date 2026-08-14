import { ArrowLeft, Trash2 } from 'lucide-react'
import type { Libro, PalabraConLibro } from '../types'
import { CATEGORIA_LABEL } from '../types'

interface Props {
  libro: Libro
  palabras: PalabraConLibro[]
  onVolver: () => void
  onEliminar: (id: string) => void
}

export function LibroDetalle({ libro, palabras, onVolver, onEliminar }: Props) {
  const delLibro = palabras
    .filter((p) => p.libro_id === libro.id)
    .sort((a, b) => a.palabra.localeCompare(b.palabra))

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <button
        type="button"
        onClick={onVolver}
        className="flex w-fit items-center gap-1 text-sm font-medium text-ink-soft hover:text-accent"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">{libro.titulo}</h1>
        {libro.autor && <p className="text-ink-faint">{libro.autor}</p>}
        <p className="mt-1 text-sm text-ink-faint">
          {delLibro.length} palabra{delLibro.length === 1 ? '' : 's'} capturada
          {delLibro.length === 1 ? '' : 's'}
        </p>
      </div>

      {delLibro.length === 0 ? (
        <p className="py-12 text-center text-ink-faint">
          Todavía no hay palabras capturadas de este libro.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-soft rounded-lg border border-line bg-paper-raised">
          {delLibro.map((p) => (
            <li key={p.id} className="flex gap-3 p-4">
              {p.imagen_url && (
                <img
                  src={p.imagen_url}
                  alt={p.palabra}
                  className="h-14 w-14 shrink-0 rounded-md border border-line object-cover"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-display text-lg font-semibold text-ink">
                      {p.palabra}
                    </span>
                    <span className="ml-2 text-xs uppercase tracking-wide text-ink-faint">
                      {CATEGORIA_LABEL[p.categoria_gramatical]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEliminar(p.id)}
                    className="shrink-0 rounded p-1 text-ink-faint hover:bg-danger-dim hover:text-danger"
                    aria-label={`Eliminar ${p.palabra}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-sm text-ink-soft">{p.definicion}</p>
                {p.oracion_original && (
                  <p className="text-sm italic text-ink-faint">
                    &ldquo;{p.oracion_original}&rdquo;
                  </p>
                )}
                {p.pagina_o_capitulo && (
                  <span className="text-xs text-ink-faint">{p.pagina_o_capitulo}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
