import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { PalabraConLibro } from '../types'

const DESHACER_MS = 6000

export function usePalabras() {
  const [palabras, setPalabras] = useState<PalabraConLibro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendientesEliminar, setPendientesEliminar] = useState<PalabraConLibro[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('palabras')
      .select('*, libro:libros(id, titulo)')
      .order('palabra', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      setPalabras(data as unknown as PalabraConLibro[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    const activos = timers.current
    return () => {
      activos.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const confirmarEliminacion = useCallback(async (id: string) => {
    timers.current.delete(id)
    setPendientesEliminar((prev) => prev.filter((p) => p.id !== id))
    const { error } = await supabase.from('palabras').delete().eq('id', id)
    if (error) setError(error.message)
  }, [])

  const eliminarPalabra = useCallback(
    (id: string) => {
      const palabra = palabras.find((p) => p.id === id)
      if (!palabra) return

      setPalabras((prev) => prev.filter((p) => p.id !== id))
      setPendientesEliminar((prev) => [...prev, palabra])

      const timer = setTimeout(() => confirmarEliminacion(id), DESHACER_MS)
      timers.current.set(id, timer)
    },
    [palabras, confirmarEliminacion],
  )

  const deshacerEliminar = useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setPendientesEliminar((prev) => {
      const palabra = prev.find((p) => p.id === id)
      if (palabra) {
        setPalabras((actuales) =>
          [...actuales, palabra].sort((a, b) => a.palabra.localeCompare(b.palabra)),
        )
      }
      return prev.filter((p) => p.id !== id)
    })
  }, [])

  return {
    palabras,
    loading,
    error,
    refetch,
    eliminarPalabra,
    deshacerEliminar,
    pendientesEliminar,
  }
}
