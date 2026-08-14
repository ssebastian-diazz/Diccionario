import { useState, type FormEvent } from 'react'
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up w-full max-w-sm rounded-t-2xl bg-paper-raised pt-3 shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 pb-3">
          <button type="button" onClick={onClose} className="text-[15px] text-ink-soft">
            Cancelar
          </button>
          <h2 className="font-display text-[15px] font-semibold text-ink">
            {libro ? 'Editar libro' : 'Nuevo libro'}
          </h2>
          <button
            type="submit"
            disabled={guardando || !titulo.trim()}
            className="text-[15px] font-semibold text-accent disabled:opacity-40"
          >
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
        </div>

        <div className="flex flex-col divide-y divide-line px-4">
          <label className="flex flex-col gap-0.5 py-3">
            <span className="text-[13px] text-ink-soft">Título</span>
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
              placeholder="Cien años de soledad"
              required
            />
          </label>
          <label className="flex flex-col gap-0.5 py-3">
            <span className="text-[13px] text-ink-soft">Autor</span>
            <input
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
              placeholder="Gabriel García Márquez"
            />
          </label>
        </div>

        {error && <p className="px-4 pt-2 text-sm text-danger">{error}</p>}
        <div className="h-3" />
      </form>
    </div>
  )
}
