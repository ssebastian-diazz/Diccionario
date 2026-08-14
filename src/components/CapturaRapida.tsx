import { useRef, useState, type DragEvent, type FormEvent } from 'react'
import { ChevronDown, ImagePlus, Plus, X } from 'lucide-react'
import { supabase, IMAGENES_BUCKET } from '../lib/supabase'
import { CATEGORIA_LABEL, CATEGORIAS, type CategoriaGramatical, type Libro } from '../types'
import { NuevoLibroModal } from './NuevoLibroModal'

interface Props {
  libros: Libro[]
  libroActivoId: string | null
  setLibroActivoId: (id: string | null) => void
  agregarLibro: (titulo: string, autor: string) => Promise<Libro>
  onPalabraGuardada: () => void
}

const vacio = {
  palabra: '',
  categoria: 'sustantivo' as CategoriaGramatical,
  definicion: '',
  paginaOCapitulo: '',
  oracionOriginal: '',
}

export function CapturaRapida({
  libros,
  libroActivoId,
  setLibroActivoId,
  agregarLibro,
  onPalabraGuardada,
}: Props) {
  const [form, setForm] = useState(vacio)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [imagenUrlInput, setImagenUrlInput] = useState('')
  const [arrastrando, setArrastrando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmacion, setConfirmacion] = useState(false)
  const [modalLibroAbierto, setModalLibroAbierto] = useState(false)
  const palabraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const librosActivos = libros.filter((l) => l.activo)

  function elegirArchivo(file: File | null) {
    setImagenFile(file)
    setImagenUrlInput('')
    if (file) {
      setImagenPreview(URL.createObjectURL(file))
    } else {
      setImagenPreview(null)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setArrastrando(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      elegirArchivo(file)
    }
  }

  function limpiarImagen() {
    elegirArchivo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function subirImagen(file: File): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(IMAGENES_BUCKET).upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from(IMAGENES_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.palabra.trim() || !form.definicion.trim()) return
    setGuardando(true)
    setError(null)
    try {
      let imagen_url: string | null = null
      if (imagenFile) {
        imagen_url = await subirImagen(imagenFile)
      } else if (imagenUrlInput.trim()) {
        imagen_url = imagenUrlInput.trim()
      }

      const { error: insertError } = await supabase.from('palabras').insert({
        palabra: form.palabra.trim(),
        categoria_gramatical: form.categoria,
        definicion: form.definicion.trim(),
        imagen_url,
        libro_id: libroActivoId,
        pagina_o_capitulo: form.paginaOCapitulo.trim() || null,
        oracion_original: form.oracionOriginal.trim() || null,
      })
      if (insertError) throw insertError

      setForm(vacio)
      limpiarImagen()
      onPalabraGuardada()
      setConfirmacion(true)
      setTimeout(() => setConfirmacion(false), 1500)
      palabraInputRef.current?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la palabra')
    } finally {
      setGuardando(false)
    }
  }

  const libroActivo = libros.find((l) => l.id === libroActivoId) ?? null

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={libroActivoId ?? ''}
            onChange={(e) => setLibroActivoId(e.target.value || null)}
            className="w-full appearance-none rounded-md border border-line bg-paper-raised px-3 py-2 pr-9 text-sm text-ink outline-none focus:border-accent"
          >
            <option value="">Sin libro activo</option>
            {librosActivos.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titulo}
                {l.autor ? ` — ${l.autor}` : ''}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
        </div>
        <button
          type="button"
          onClick={() => setModalLibroAbierto(true)}
          className="flex shrink-0 items-center gap-1 rounded-md border border-line bg-paper-raised px-3 py-2 text-sm font-medium text-ink-soft hover:border-accent hover:text-accent"
        >
          <Plus size={16} />
          nuevo libro
        </button>
      </div>
      {!libroActivo && (
        <p className="-mt-4 text-xs text-ink-faint">
          No hay libro activo. Las palabras se guardarán sin libro asociado.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink-soft">Palabra</span>
          <input
            ref={palabraInputRef}
            autoFocus
            value={form.palabra}
            onChange={(e) => setForm((f) => ({ ...f, palabra: e.target.value }))}
            className="rounded-md border border-line bg-paper-raised px-3 py-2 font-display text-lg text-ink outline-none focus:border-accent"
            placeholder="efímero"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink-soft">Categoría gramatical</span>
          <select
            value={form.categoria}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoria: e.target.value as CategoriaGramatical }))
            }
            className="rounded-md border border-line bg-paper-raised px-3 py-2 text-ink outline-none focus:border-accent"
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_LABEL[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink-soft">Definición</span>
          <textarea
            value={form.definicion}
            onChange={(e) => setForm((f) => ({ ...f, definicion: e.target.value }))}
            className="min-h-20 rounded-md border border-line bg-paper-raised px-3 py-2 text-ink outline-none focus:border-accent"
            placeholder="Que dura poco tiempo."
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink-soft">Página o capítulo</span>
          <input
            value={form.paginaOCapitulo}
            onChange={(e) => setForm((f) => ({ ...f, paginaOCapitulo: e.target.value }))}
            className="rounded-md border border-line bg-paper-raised px-3 py-2 text-ink outline-none focus:border-accent"
            placeholder="p. 214 / cap. 3"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ink-soft">Oración original</span>
          <textarea
            value={form.oracionOriginal}
            onChange={(e) => setForm((f) => ({ ...f, oracionOriginal: e.target.value }))}
            className="min-h-16 rounded-md border border-line bg-paper-raised px-3 py-2 text-ink outline-none focus:border-accent"
            placeholder="Frase del libro donde apareció la palabra…"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink-soft">Imagen (opcional)</span>
          {imagenPreview ? (
            <div className="relative w-fit">
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="h-28 w-28 rounded-md border border-line object-cover"
              />
              <button
                type="button"
                onClick={limpiarImagen}
                className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-paper-raised"
                aria-label="Quitar imagen"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setArrastrando(true)
              }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-4 py-6 text-center text-sm transition-colors ${
                arrastrando
                  ? 'border-accent bg-accent-dim text-accent'
                  : 'border-line text-ink-faint hover:border-accent-soft hover:text-accent-soft'
              }`}
            >
              <ImagePlus size={20} />
              <span>Arrastra una imagen o haz clic para elegirla</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
              />
            </div>
          )}
          {!imagenFile && (
            <input
              value={imagenUrlInput}
              onChange={(e) => setImagenUrlInput(e.target.value)}
              className="rounded-md border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              placeholder="…o pega la URL de una imagen"
            />
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={guardando || !form.palabra.trim() || !form.definicion.trim()}
          className="mt-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-paper-raised transition-colors hover:bg-accent-soft disabled:opacity-50"
        >
          {guardando ? 'Guardando…' : confirmacion ? 'Guardado ✓' : 'Guardar'}
        </button>
      </form>

      {modalLibroAbierto && (
        <NuevoLibroModal
          onClose={() => setModalLibroAbierto(false)}
          onGuardar={async (titulo, autor) => {
            const libro = await agregarLibro(titulo, autor)
            setLibroActivoId(libro.id)
          }}
        />
      )}
    </div>
  )
}
