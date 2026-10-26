import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { ThemeContext } from './theme-context'
import type { Theme } from '../../types/common'
const STORAGE_KEY = 'portfolio-theme'

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      document.documentElement.dataset.theme = resolved
      document.documentElement.style.colorScheme = resolved
    }
    const onSystemChange = () => { if (theme === 'system') applyTheme() }
    applyTheme()
    media.addEventListener('change', onSystemChange)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* Storage may be unavailable in private contexts. */ }
    return () => media.removeEventListener('change', onSystemChange)
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
