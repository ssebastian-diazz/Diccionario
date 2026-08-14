import { useState } from 'react'
import { BookMarked, Library, PenLine } from 'lucide-react'
import { useLibros } from './hooks/useLibros'
import { useLibroActivo } from './hooks/useLibroActivo'
import { usePalabras } from './hooks/usePalabras'
import { AmbientDrop } from './components/AmbientDrop'
import { CapturaRapida } from './components/CapturaRapida'
import { Diccionario } from './components/Diccionario'
import { GestionLibros } from './components/GestionLibros'
import { LibroDetalle } from './components/LibroDetalle'
import { UndoToast } from './components/UndoToast'

type Tab = 'captura' | 'diccionario' | 'libros'

const TABS: { id: Tab; label: string; icon: typeof PenLine }[] = [
  { id: 'captura', label: 'Captura', icon: PenLine },
  { id: 'diccionario', label: 'Diccionario', icon: BookMarked },
  { id: 'libros', label: 'Libros', icon: Library },
]

function App() {
  const [tab, setTab] = useState<Tab>('captura')
  const [libroDetalleId, setLibroDetalleId] = useState<string | null>(null)

  const { libros, agregarLibro, editarLibro } = useLibros()
  const { libroActivoId, setLibroActivoId } = useLibroActivo(libros)
  const { palabras, loading, refetch, eliminarPalabra, deshacerEliminar, pendientesEliminar } =
    usePalabras()

  function irATab(t: Tab) {
    setLibroDetalleId(null)
    setTab(t)
  }

  const libroDetalle = libros.find((l) => l.id === libroDetalleId) ?? null

  return (
    <div className="flex min-h-screen flex-col">
      <AmbientDrop />

      <main className="relative z-10 flex-1 pb-24">
        {libroDetalle ? (
          <LibroDetalle
            libro={libroDetalle}
            palabras={palabras}
            onVolver={() => setLibroDetalleId(null)}
            onEliminar={eliminarPalabra}
          />
        ) : tab === 'captura' ? (
          <CapturaRapida
            libros={libros}
            libroActivoId={libroActivoId}
            setLibroActivoId={setLibroActivoId}
            agregarLibro={agregarLibro}
            onPalabraGuardada={refetch}
          />
        ) : tab === 'diccionario' ? (
          <Diccionario
            palabras={palabras}
            loading={loading}
            onIrALibro={setLibroDetalleId}
            onEliminar={eliminarPalabra}
          />
        ) : (
          <GestionLibros
            libros={libros}
            palabras={palabras}
            agregarLibro={agregarLibro}
            editarLibro={editarLibro}
            onVerLibro={setLibroDetalleId}
          />
        )}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper-raised/90 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex w-full max-w-2xl">
          {TABS.map(({ id, label, icon: Icon }) => {
            const activo = tab === id && !libroDetalleId
            return (
              <button
                key={id}
                type="button"
                onClick={() => irATab(id)}
                aria-label={label}
                aria-current={activo ? 'page' : undefined}
                className="flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors"
              >
                <Icon
                  size={22}
                  strokeWidth={activo ? 2.4 : 1.8}
                  className={activo ? 'text-accent' : 'text-ink-soft'}
                />
                <span
                  className={`text-[11px] ${activo ? 'font-semibold text-accent' : 'text-ink-soft'}`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {pendientesEliminar.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4">
          {pendientesEliminar.map((p) => (
            <div key={p.id} className="pointer-events-auto">
              <UndoToast
                mensaje={`«${p.palabra}» eliminada`}
                onDeshacer={() => deshacerEliminar(p.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
