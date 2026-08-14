import { useCallback, useEffect, useState } from 'react'
import type { Libro } from '../types'

const STORAGE_KEY = 'diccionario:libro-activo-id'

export function useLibroActivo(libros: Libro[]) {
  const [libroActivoId, setLibroActivoIdState] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY)
  )

  const setLibroActivoId = useCallback((id: string | null) => {
    setLibroActivoIdState(id)
    if (id) {
      localStorage.setItem(STORAGE_KEY, id)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Si el libro guardado ya no existe o se archivó, se limpia la selección.
  useEffect(() => {
    if (!libroActivoId || libros.length === 0) return
    const sigueDisponible = libros.some((l) => l.id === libroActivoId && l.activo)
    if (!sigueDisponible) {
      setLibroActivoId(null)
    }
  }, [libros, libroActivoId, setLibroActivoId])

  const libroActivo = libros.find((l) => l.id === libroActivoId) ?? null

  return { libroActivoId, libroActivo, setLibroActivoId }
}
