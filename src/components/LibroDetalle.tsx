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
    <div className="mx-auto flex w-full max-w-2xl flex-col px-5 pt-6">
      <button
        type="button"
        onClick={onVolver}
        className="mb-4 flex w-fit items-center gap-1 text-[15px] font-medium text-accent"
      >
        <ArrowLeft size={17} />
        Diccionario
      </button>

      <h1 className="font-display text-[32px] font-bold leading-tight text-ink">
        {libro.titulo}
      </h1>
      {libro.autor && <p className="mt-1 text-[15px] text-ink-soft">{libro.autor}</p>}
      <p className="mt-2 text-[13px] text-ink-soft">
        {delLibro.length} palabra{delLibro.length === 1 ? '' : 's'}
      </p>

      {delLibro.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-ink-soft">
          Todavía no hay palabras capturadas de este libro.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col divide-y divide-line">
          {delLibro.map((p) => (
            <li key={p.id} className="flex gap-3 py-3.5">
              {p.imagen_url && (
                <img
                  src={p.imagen_url}
                  alt={p.palabra}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="font-display text-[19px] font-semibold text-ink">
                      {p.palabra}
                    </h2>
                    <span className="text-[12px] text-ink-soft">
                      {CATEGORIA_LABEL[p.categoria_gramatical]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEliminar(p.id)}
                    className="shrink-0 p-1 text-ink-faint hover:text-danger"
                    aria-label={`Eliminar ${p.palabra}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-[15px] text-ink-soft">{p.definicion}</p>
                {p.oracion_original && (
                  <p className="text-[14px] italic text-ink-soft">
                    &ldquo;{p.oracion_original}&rdquo;
                  </p>
                )}
                {p.pagina_o_capitulo && (
                  <span className="text-[13px] text-ink-soft">{p.pagina_o_capitulo}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
