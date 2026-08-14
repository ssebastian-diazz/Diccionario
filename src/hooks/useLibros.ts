import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Libro } from '../types'

export function useLibros() {
  const [libros, setLibros] = useState<Libro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('libros')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      setLibros(data as Libro[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const agregarLibro = useCallback(
    async (titulo: string, autor: string) => {
      const { data, error } = await supabase
        .from('libros')
        .insert({ titulo, autor: autor || null })
        .select()
        .single()

      if (error) throw error
      setLibros((prev) => [data as Libro, ...prev])
      return data as Libro
    },
    []
  )

  const editarLibro = useCallback(
    async (id: string, cambios: Partial<Pick<Libro, 'titulo' | 'autor' | 'activo'>>) => {
      const { data, error } = await supabase
        .from('libros')
        .update(cambios)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setLibros((prev) => prev.map((l) => (l.id === id ? (data as Libro) : l)))
      return data as Libro
    },
    []
  )

  const archivarLibro = useCallback(
    async (id: string) => {
      await editarLibro(id, { activo: false })
    },
    [editarLibro]
  )

  return { libros, loading, error, refetch, agregarLibro, editarLibro, archivarLibro }
}
