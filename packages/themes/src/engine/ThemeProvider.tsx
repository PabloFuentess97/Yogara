'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ThemeConfig, OrganizationData } from './types'

interface ThemeContextValue {
  config: ThemeConfig
  org: OrganizationData
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  config,
  org,
  children,
}: {
  config: ThemeConfig
  org: OrganizationData
  children: ReactNode
}) {
  return (
    <ThemeContext.Provider value={{ config, org }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return context
}
