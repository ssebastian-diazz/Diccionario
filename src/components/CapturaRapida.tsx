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

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col px-5 pt-6">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* The giant word -- the whole point of the screen. Nothing else competes with it. */}
        <input
          ref={palabraInputRef}
          autoFocus
          value={form.palabra}
          onChange={(e) => setForm((f) => ({ ...f, palabra: e.target.value }))}
          className="font-display w-full bg-transparent text-6xl font-bold tracking-tight text-ink outline-none placeholder:text-ink-faint/40"
          placeholder="efímero"
          required
        />

        <div className="segmented mt-5 w-fit">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={form.categoria === c}
              onClick={() => setForm((f) => ({ ...f, categoria: c }))}
              className={`px-3 py-1.5 text-[13px] font-medium transition-all ${
                form.categoria === c
                  ? 'bg-paper-raised text-ink shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {CATEGORIA_LABEL[c]}
            </button>
          ))}
        </div>

        <div className="mt-7 flex flex-col divide-y divide-line">
          <div className="flex items-center justify-between gap-2 py-3">
            <span className="shrink-0 text-[15px] text-ink-soft">Libro</span>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
              <select
                value={libroActivoId ?? ''}
                onChange={(e) => setLibroActivoId(e.target.value || null)}
                className="min-w-0 max-w-full bg-transparent text-right text-[15px] text-ink outline-none"
              >
                <option value="">Ninguno</option>
                {librosActivos.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.titulo}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="shrink-0 text-ink-faint" />
              <button
                type="button"
                onClick={() => setModalLibroAbierto(true)}
                aria-label="Agregar libro nuevo"
                className="shrink-0 p-1 text-accent"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1 py-3">
            <span className="text-[15px] text-ink-soft">Definición</span>
            <textarea
              value={form.definicion}
              onChange={(e) => setForm((f) => ({ ...f, definicion: e.target.value }))}
              className="min-h-16 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
              placeholder="Que dura poco tiempo."
              required
            />
          </div>

          <div className="flex items-center justify-between gap-2 py-3">
            <span className="shrink-0 text-[15px] text-ink-soft">Página o capítulo</span>
            <input
              value={form.paginaOCapitulo}
              onChange={(e) => setForm((f) => ({ ...f, paginaOCapitulo: e.target.value }))}
              className="min-w-0 flex-1 bg-transparent text-right text-[15px] text-ink outline-none placeholder:text-ink-faint"
              placeholder="p. 214 / cap. 3"
            />
          </div>

          <div className="flex flex-col gap-1 py-3">
            <span className="text-[15px] text-ink-soft">Oración original</span>
            <textarea
              value={form.oracionOriginal}
              onChange={(e) => setForm((f) => ({ ...f, oracionOriginal: e.target.value }))}
              className="min-h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
              placeholder="Frase del libro donde apareció la palabra…"
            />
          </div>

          <div className="flex flex-col gap-2 py-3">
            <span className="text-[15px] text-ink-soft">Imagen</span>
            {imagenPreview ? (
              <div className="relative w-fit">
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="h-24 w-24 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={limpiarImagen}
                  className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-white"
                  aria-label="Quitar imagen"
                >
                  <X size={13} />
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
                className={`flex cursor-pointer items-center gap-2 rounded-xl border border-dashed px-3 py-3 text-[13px] transition-colors ${
                  arrastrando
                    ? 'border-accent bg-accent-dim text-accent'
                    : 'border-line-soft text-ink-faint hover:border-accent hover:text-accent'
                }`}
              >
                <ImagePlus size={18} />
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
                className="bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
                placeholder="…o pega la URL de una imagen"
              />
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={guardando || !form.palabra.trim() || !form.definicion.trim()}
          className="mt-6 rounded-xl bg-accent py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-soft disabled:opacity-40"
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
