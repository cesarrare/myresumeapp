export type ThemeMode = 'light' | 'dark'

export interface ThemeDefinition {
  mode: ThemeMode
  label: string
  variables: Record<string, string>
}

const shared = {
  '--font-sans': "system-ui, 'Segoe UI', Roboto, sans-serif",
  '--font-heading': "system-ui, 'Segoe UI', Roboto, sans-serif",
  '--radius-sm': '8px',
  '--radius-md': '12px',
  '--radius-lg': '16px',
  '--shadow-card':
    '0 20px 45px rgba(15, 23, 42, 0.08), 0 8px 16px rgba(15, 23, 42, 0.04)',
} as const

export const themes: Record<ThemeMode, ThemeDefinition> = {
  light: {
    mode: 'light',
    label: 'Light',
    variables: {
      ...shared,
      '--color-bg': '#eef2f7',
      '--color-surface': '#ffffff',
      '--color-surface-muted': '#f8fafc',
      '--color-text': '#0f172a',
      '--color-text-muted': '#64748b',
      '--color-primary': '#2563eb',
      '--color-primary-hover': '#1d4ed8',
      '--color-primary-soft': 'rgba(37, 99, 235, 0.12)',
      '--color-border': '#e2e8f0',
      '--color-error': '#dc2626',
      '--color-error-soft': 'rgba(220, 38, 38, 0.1)',
      '--color-google-border': '#dadce0',
      '--color-google-hover': '#f8f9fa',
    },
  },
  dark: {
    mode: 'dark',
    label: 'Dark',
    variables: {
      ...shared,
      '--color-bg': '#0b1220',
      '--color-surface': '#111827',
      '--color-surface-muted': '#1f2937',
      '--color-text': '#f8fafc',
      '--color-text-muted': '#94a3b8',
      '--color-primary': '#60a5fa',
      '--color-primary-hover': '#93c5fd',
      '--color-primary-soft': 'rgba(96, 165, 250, 0.16)',
      '--color-border': '#334155',
      '--color-error': '#f87171',
      '--color-error-soft': 'rgba(248, 113, 113, 0.12)',
      '--color-google-border': '#475569',
      '--color-google-hover': '#1e293b',
      '--shadow-card':
        '0 20px 45px rgba(0, 0, 0, 0.35), 0 8px 16px rgba(0, 0, 0, 0.2)',
    },
  },
}

export const THEME_STORAGE_KEY = 'myresume.theme'

export const DEFAULT_THEME_MODE: ThemeMode = 'light'
