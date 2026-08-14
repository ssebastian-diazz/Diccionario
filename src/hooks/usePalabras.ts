import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { PalabraConLibro } from '../types'

export function usePalabras() {
  const [palabras, setPalabras] = useState<PalabraConLibro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const eliminarPalabra = useCallback(async (id: string) => {
    const { error } = await supabase.from('palabras').delete().eq('id', id)
    if (error) throw error
    setPalabras((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { palabras, loading, error, refetch, eliminarPalabra }
}
