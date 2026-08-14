import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Libro } from '../types'

interface Props {
  libro?: Libro
  onClose: () => void
  onGuardar: (titulo: string, autor: string) => Promise<void>
}

export function NuevoLibroModal({ libro, onClose, onGuardar }: Props) {
  const [titulo, setTitulo] = useState(libro?.titulo ?? '')
  const [autor, setAutor] = useState(libro?.autor ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) return
    setGuardando(true)
    setError(null)
    try {
      await onGuardar(titulo.trim(), autor.trim())
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el libro')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="animate-fade-up w-full max-w-sm rounded-lg border border-line bg-paper-raised p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            {libro ? 'Editar libro' : 'Nuevo libro'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-ink-faint hover:bg-line-soft hover:text-ink"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink-soft">Título</span>
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="rounded-md border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
              placeholder="Cien años de soledad"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink-soft">Autor</span>
            <input
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="rounded-md border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
              placeholder="Gabriel García Márquez"
            />
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft hover:bg-line-soft"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !titulo.trim()}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-paper-raised hover:bg-accent-soft disabled:opacity-50"
            >
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
