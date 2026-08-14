export type CategoriaGramatical = 'sustantivo' | 'verbo' | 'adjetivo' | 'adverbio'

export const CATEGORIAS: CategoriaGramatical[] = ['sustantivo', 'verbo', 'adjetivo', 'adverbio']

export const CATEGORIA_LABEL: Record<CategoriaGramatical, string> = {
  sustantivo: 'Sustantivo',
  verbo: 'Verbo',
  adjetivo: 'Adjetivo',
  adverbio: 'Adverbio',
}

export const CATEGORIA_ABREV: Record<CategoriaGramatical, string> = {
  sustantivo: 'sust.',
  verbo: 'vb.',
  adjetivo: 'adj.',
  adverbio: 'adv.',
}


export interface Libro {
  id: string
  titulo: string
  autor: string | null
  activo: boolean
  created_at: string
}

export interface Palabra {
  id: string
  palabra: string
  categoria_gramatical: CategoriaGramatical
  definicion: string
  imagen_url: string | null
  libro_id: string | null
  pagina_o_capitulo: string | null
  oracion_original: string | null
  fecha_captura: string
}

export interface PalabraConLibro extends Palabra {
  libro: Pick<Libro, 'id' | 'titulo'> | null
}
