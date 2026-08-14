import { useState } from 'react'
import { BookMarked, Library, PenLine } from 'lucide-react'
import { useLibros } from './hooks/useLibros'
import { useLibroActivo } from './hooks/useLibroActivo'
import { usePalabras } from './hooks/usePalabras'
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
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="font-display text-lg font-semibold text-ink">Diccionario Personal</h1>
          <nav className="flex gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => irATab(id)}
                aria-label={label}
                aria-current={tab === id && !libroDetalleId ? 'page' : undefined}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === id && !libroDetalleId
                    ? 'bg-accent text-paper-raised'
                    : 'text-ink-soft hover:bg-line-soft'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
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

      {pendientesEliminar.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
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
