import { Trash2 } from 'lucide-react'
import { CATEGORIA_LABEL, CATEGORIAS } from '../types'
import type { PalabraConLibro } from '../types'

interface Props {
  palabras: PalabraConLibro[]
  loading: boolean
  onIrALibro: (libroId: string) => void
  onEliminar: (id: string) => void
}

export function Diccionario({ palabras, loading, onIrALibro, onEliminar }: Props) {
  if (loading) {
    return <p className="px-4 py-8 text-center text-ink-faint">Cargando…</p>
  }

  if (palabras.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-ink-faint">
        Todavía no has capturado ninguna palabra.
      </p>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
      {CATEGORIAS.map((categoria) => {
        const entradas = palabras.filter((p) => p.categoria_gramatical === categoria)
        if (entradas.length === 0) return null
        return (
          <section key={categoria} className="flex flex-col gap-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-accent">
              {CATEGORIA_LABEL[categoria]}
              <span className="ml-2 text-ink-faint">({entradas.length})</span>
            </h2>
            <ul className="flex flex-col divide-y divide-line-soft rounded-lg border border-line bg-paper-raised">
              {entradas.map((p) => (
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
                      <h3 className="font-display text-lg font-semibold text-ink">{p.palabra}</h3>
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
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
                      {p.libro && (
                        <button
                          type="button"
                          onClick={() => onIrALibro(p.libro!.id)}
                          className="rounded-full bg-accent-dim px-2 py-0.5 font-medium text-accent hover:bg-accent hover:text-paper-raised"
                        >
                          {p.libro.titulo}
                        </button>
                      )}
                      {p.pagina_o_capitulo && <span>{p.pagina_o_capitulo}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
