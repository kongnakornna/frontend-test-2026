import { useEffect, useState } from 'react'

export const EDITOR_THEMES = ['light', 'dark'] as const
export type EditorTheme = (typeof EDITOR_THEMES)[number]

const STORAGE_KEY = 'feature-flag-editor:theme'
const DEFAULT_THEME: EditorTheme = 'dark'

function readStoredTheme(): EditorTheme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null // storage blocked (private mode, disabled cookies)
  }
}

/**
 * The editor's own Light / Dark mode, remembered in localStorage.
 * The server always renders the default (dark); the stored choice is applied
 * after hydration, so server and client markup match.
 */
export function useEditorTheme() {
  const [theme, setThemeState] = useState<EditorTheme>(DEFAULT_THEME)

  useEffect(() => {
    const stored = readStoredTheme()
    if (stored) setThemeState(stored)
  }, [])

  const setTheme = (next: EditorTheme) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // not persisted; the theme still changes for this visit
    }
  }

  return { theme, setTheme }
}

/** Classes for the editor wrapper: scoped tokens, plus `dark` so `dark:` variants work. */
export function editorThemeClass(theme: EditorTheme): string {
  return theme === 'dark' ? 'ff-theme-dark dark' : 'ff-theme-light'
}
