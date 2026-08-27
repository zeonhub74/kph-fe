import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getProductPriceSettings, updateProductPriceSettings } from '../api/settings/route'
import { useAuthSession } from '../hooks/api/useLogin'

const ProductSettingsContext = createContext(undefined)

export function ProductSettingsProvider({ children }) {
  const session = useAuthSession()
  const [isPriceDisabled, setIsPriceDisabledState] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    let cancelled = false
    ;(async () => {
      try {
        const data = await getProductPriceSettings()
        if (!cancelled) setIsPriceDisabledState(data.is_price_disabled)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [])

  const setIsPriceDisabled = useCallback(
    async (nextValue) => {
      const previousValue = isPriceDisabled
      setIsPriceDisabledState(nextValue)
      try {
        const token = session?.access_token
        if (!token) throw new Error('Missing auth token.')
        const data = await updateProductPriceSettings(nextValue, token)
        setIsPriceDisabledState(data.is_price_disabled)
      } catch (err) {
        setIsPriceDisabledState(previousValue)
        setError(err)
      }
    },
    [isPriceDisabled, session],
  )

  return (
    <ProductSettingsContext.Provider value={{ isPriceDisabled, setIsPriceDisabled, loading, error }}>
      {children}
    </ProductSettingsContext.Provider>
  )
}

export function useProductSettings() {
  const context = useContext(ProductSettingsContext)
  if (!context) {
    throw new Error('useProductSettings must be used within ProductSettingsProvider')
  }
  return context
}