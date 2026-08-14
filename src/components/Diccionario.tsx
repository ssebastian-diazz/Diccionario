import { Trash2 } from 'lucide-react'
import { CATEGORIAS, CATEGORIA_LABEL } from '../types'
import type { PalabraConLibro } from '../types'

interface Props {
  palabras: PalabraConLibro[]
  loading: boolean
  onIrALibro: (libroId: string) => void
  onEliminar: (id: string) => void
}

export function Diccionario({ palabras, loading, onIrALibro, onEliminar }: Props) {
  if (loading) {
    return <p className="px-5 py-8 text-center text-[15px] text-ink-soft">Cargando…</p>
  }

  if (palabras.length === 0) {
    return (
      <p className="px-5 py-16 text-center text-[15px] text-ink-soft">
        Todavía no has capturado ninguna palabra.
      </p>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-5 pt-6">
      <h1 className="font-display mb-4 text-[28px] font-bold text-ink">Diccionario</h1>
      <div className="flex flex-col gap-8">
        {CATEGORIAS.map((categoria) => {
          const entradas = palabras.filter((p) => p.categoria_gramatical === categoria)
          if (entradas.length === 0) return null
          return (
            <section key={categoria}>
              <h2 className="mb-1 text-[13px] font-semibold uppercase text-ink-soft">
                {CATEGORIA_LABEL[categoria]}
              </h2>
              <ul className="flex flex-col divide-y divide-line">
                {entradas.map((p) => (
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
                        <h3 className="font-display text-[19px] font-semibold text-ink">
                          {p.palabra}
                        </h3>
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
                      {(p.libro || p.pagina_o_capitulo) && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-ink-soft">
                          {p.libro && (
                            <button
                              type="button"
                              onClick={() => onIrALibro(p.libro!.id)}
                              className="font-medium text-accent hover:underline"
                            >
                              {p.libro.titulo}
                            </button>
                          )}
                          {p.pagina_o_capitulo && <span>{p.pagina_o_capitulo}</span>}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
