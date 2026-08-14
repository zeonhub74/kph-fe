import { createContext, useContext, useState } from 'react'

const PRODUCT_SETTINGS_STORAGE_KEY = 'kph.product.settings'
const ProductSettingsContext = createContext(null)

function readSettings() {
  try {
    const storedSettings = JSON.parse(localStorage.getItem(PRODUCT_SETTINGS_STORAGE_KEY) || '{}')
    return { isPriceDisabled: Boolean(storedSettings.isPriceDisabled) }
  } catch {
    return { isPriceDisabled: false }
  }
}

export function ProductSettingsProvider({ children }) {
  const [settings, setSettings] = useState(readSettings)

  function setIsPriceDisabled(isPriceDisabled) {
    const nextSettings = { isPriceDisabled }
    setSettings(nextSettings)
    localStorage.setItem(PRODUCT_SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings))
  }

  return (
    <ProductSettingsContext.Provider value={{ ...settings, setIsPriceDisabled }}>
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