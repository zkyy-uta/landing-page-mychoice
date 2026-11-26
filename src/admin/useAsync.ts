import { useCallback, useEffect, useRef, useState } from 'react'

type State<T> = { data: T | null; error: string | null; loading: boolean }

/** Small async loader with a manual reload trigger; errors are shown, never swallowed. */
export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true })
  const [tick, setTick] = useState(0)
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true }))
    loaderRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            error: error instanceof Error ? error.message : 'Something went wrong.',
            loading: false,
          })
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((value) => value + 1), [])

  return { ...state, reload, setData: (data: T) => setState((prev) => ({ ...prev, data })) }
}
