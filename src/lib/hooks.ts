/**
 * Hooks for AgriExpert API interactions
 */

import { useState, useCallback, useEffect, useRef } from 'react'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncActions<T> {
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncState<T> & UseAsyncActions<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await asyncFunction(...args)
      setState({ data: response, loading: false, error: null })
      return response
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
      return null
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  }
}

// API Hooks

export function useDiseases() {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch('/api/diseases')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch diseases')
        return res.json()
      })
      .then(d => setData(d.diseases))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export function useDisease(diseaseId: string | null) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!diseaseId) return
    setLoading(true)
    fetch(`/api/diseases/${diseaseId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch disease')
        return res.json()
      })
      .then(d => setData(d.disease))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [diseaseId])

  return { data, loading, error }
}

// FIX: useSymptoms sekarang reactive — re-fetch setiap kali phase/plant_part berubah
export function useSymptoms(phase?: string, plant_part?: string) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!phase || !plant_part) {
      setData(null)
      return
    }

    setLoading(true)
    setData(null)
    setError(null)

    const params = new URLSearchParams({ phase, plant_part })
    fetch(`/api/symptoms?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch symptoms')
        return res.json()
      })
      .then(d => setData(d.symptoms))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [phase, plant_part])

  return { data, loading, error }
}

interface DiagnosisRequest {
  phase: 'vegetatif' | 'generatif'
  plant_part: 'daun' | 'batang' | 'akar' | 'malai' | 'gabah'
  symptoms: Array<{
    symptomId: string
    cfUser: number
  }>
}

export function useDiagnosis() {
  const performDiagnosis = useCallback(async (request: DiagnosisRequest) => {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!res.ok) throw new Error('Diagnosis failed')
    const data = await res.json()
    return data.results
  }, [])

  return useAsync(performDiagnosis)
}

export function useDiagnosisHistory(userId?: string) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)

    fetch(`/api/history?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch history')
        return res.json()
      })
      .then(d => setData(d.history))
      .catch(e => setError(e))
      .finally(() => setLoading(false))
  }, [userId])

  return { data, loading, error }
}

export function useSaveHistory() {
  const saveHistory = useCallback(
    async (diseaseId: string, cfResult: number, userId?: string) => {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease_id: diseaseId,
          cf_result: cfResult,
          user_id: userId,
        }),
      })
      if (!res.ok) throw new Error('Failed to save history')
      const data = await res.json()
      return data.history
    },
    []
  )

  return useAsync(saveHistory)
}
